import { toggleExtensionWindow } from "../../helpers/backdrop";
import { getKey as getKeyRaw, log, makeMove } from "../../helpers/utils";
import { Callbacks } from "../../types";
import { setupNetworkIdTimer } from "./networkIdTimerUtil";

export const oneartWalletName = "OneArt Wallet";

const getKey = (type: string) => getKeyRaw(oneartWalletName, type);

/**
 * oneartProvider: ProviderRpcClient
 */
export const checkIsProviderExist = async (oneartProvider: any) => {
  try {
    const isExist = !!(await oneartProvider?.hasProvider());

    if (!isExist) {
      log({
        type: "error",
        key: oneartWalletName,
        value: "Extension is not installed",
      });
    }

    return isExist;
  } catch (error) {
    return false;
  }
};

/**
 * oneartProvider: ProviderRpcClient,
 * options: any | undefined
 */
const checkOneartWalletAuth = async (OneartProvider: any, options: any) => {
  try {
    const key = getKey("extension/auth");

    log({
      key,
      value: "check auth start",
    });

    const oneartProvider = await makeMove(
      {
        before: "provider creating",
        after: "provider created",
        error: "provider creating failed",
        key,
      },
      async () => {
        return new OneartProvider(options);
      }
    );

    await makeMove(
      {
        before: "injected provider checking",
        after: "provider injected",
        error: "injected provider checking failed",
        key,
      },
      async () => {
        const isExist = checkIsProviderExist(oneartProvider);

        if (!isExist) throw new Error();
      }
    );

    const auth = await makeMove(
      {
        before: "auth checking",
        after: "auth checked",
        error: "auth checking failed",
        key,
      },
      async () => {
        const getProviderState = await oneartProvider?.getProviderState?.();
        const permissions = getProviderState?.permissions;
        const accountInteraction = permissions?.accountInteraction;
        const address = accountInteraction?.address;

        setupNetworkIdTimer(address, oneartProvider, options.checkNetworkId);

        return address && oneartProvider;
      }
    );

    log({
      key,
      value: "check auth end",
    });

    return {
      auth,
      fallback: oneartProvider,
    };
  } catch (error) {
    // console.error(error);
  }
};

/**
 * oneartProvider: ProviderRpcClient,
 * options: any | undefined
 * callbacks: Callbacks
 */
const connectToOneartWallet = async (
  OneartProvider: any,
  options: any,
  callbacks: Callbacks
) => {
  try {
    const key = getKey("extension");

    log({
      key,
      value: "connection start",
    });

    const oneartProvider = await makeMove(
      {
        before: "provider creating",
        after: "provider created",
        error: "provider creating failed",
        key,
      },
      async () => {
        return new OneartProvider(options);
      }
    );

    await makeMove(
      {
        before: "injected provider checking",
        after: "provider injected",
        error: "injected provider checking failed",
        key,
      },
      async () => {
        const isExist = checkIsProviderExist(oneartProvider);

        if (!isExist) throw new Error();
      }
    );

    const permissions = ["basic", "accountInteraction"];

    await toggleExtensionWindow({
      isExtensionWindowOpen: true,
    });

    await makeMove(
      {
        before: `permissions requesting (${permissions.join(", ")})`,
        after: "permissions requested",
        error: "permissions requesting failed",
        key,
      },
      async () => {
        const { accountInteraction } =
          await oneartProvider?.requestPermissions({
            permissions,
          });

        if (accountInteraction == null) {
          throw new Error("Insufficient permissions");
        }

        setupNetworkIdTimer(
          accountInteraction.address,
          oneartProvider,
          options.checkNetworkId
        );

        return accountInteraction;
      }
    );

    log({
      key,
      value: "connection end",
    });

    callbacks.authorizationCompleted(oneartProvider);

    await toggleExtensionWindow({
      isExtensionWindowOpen: false,
    });

    return oneartProvider;
  } catch (error) {
    // console.error(error);
    callbacks.extensionWindowClosed();
  }

  await toggleExtensionWindow({
    isExtensionWindowOpen: false,
  });
};

/**
 * oneartProvider: ProviderRpcClient,
 * options: any | undefined
 */
const getStandaloneConnectionToOneartWallet = async (
  OneartProvider: any,
  options: any
) => {
  try {
    const key = getKey("extension");

    log({
      key,
      value: "standalone start",
    });

    const oneartProvider = await makeMove(
      {
        before: "standalone provider creating",
        after: "standalone provider created",
        error: "standalone provider creating failed",
        key,
      },
      async () => {
        return new OneartProvider(options);
      }
    );

    log({
      key,
      value: "standalone end",
    });

    return oneartProvider;
  } catch (error) {
    // console.error(error);
  }
};

const goByQRCode = () => {
  try {
    const key = getKey("qr");

    log({
      key,
      value: "work in progress",
    });

    return undefined as any;
  } catch (error) {}
};

const goByDeepLinkIOS = () => {
  try {
    const key = getKey("ios");

    log({
      key,
      value: "work in progress",
    });

    return undefined as any;
  } catch (error) {}
};

const goByDeepLinkAndroid = () => {
  try {
    const key = getKey("android");

    log({
      key,
      value: "work in progress",
    });

    return undefined as any;
  } catch (error) {}
};

const oneartWallet = {
  extension: {
    connector: connectToOneartWallet,
    authChecker: checkOneartWalletAuth,
    standalone: getStandaloneConnectionToOneartWallet,
  },
  mobile: {
    connector: goByQRCode,
  },
  ios: {
    connector: goByDeepLinkIOS,
  },
  android: {
    connector: goByDeepLinkAndroid,
  },
};

export default oneartWallet;
