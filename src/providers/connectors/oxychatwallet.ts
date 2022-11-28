import { toggleExtensionWindow } from "../../helpers/backdrop";
import { getKey as getKeyRaw, log, makeMove } from "../../helpers/utils";
import { Callbacks } from "../../types";
import { setupNetworkIdTimer } from "./networkIdTimerUtil";

export const oxychatWalletName = "Oxychat Wallet";

const getKey = (type: string) => getKeyRaw(oxychatWalletName, type);

/**
 * oxychatProvider: ProviderRpcClient
 */
export const checkIsProviderExist = async (oxychatProvider: any) => {
  try {
    const isExist = !!(await oxychatProvider?.hasProvider());

    if (!isExist) {
      log({
        type: "error",
        key: oxychatWalletName,
        value: "Extension is not installed",
      });
    }

    return isExist;
  } catch (error) {
    return false;
  }
};

/**
 * oxychatProvider: ProviderRpcClient,
 * options: any | undefined
 */
const checkOxychatWalletAuth = async (OxychatProvider: any, options: any) => {
  try {
    const key = getKey("extension/auth");

    log({
      key,
      value: "check auth start",
    });

    const oxychatProvider = await makeMove(
      {
        before: "provider creating",
        after: "provider created",
        error: "provider creating failed",
        key,
      },
      async () => {
        return new OxychatProvider(options);
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
        const isExist = checkIsProviderExist(oxychatProvider);

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
        const getProviderState = await oxychatProvider?.getProviderState?.();
        const permissions = getProviderState?.permissions;
        const accountInteraction = permissions?.accountInteraction;
        const address = accountInteraction?.address;

        // здесь вызовется только когда уже был залогинен
        setupNetworkIdTimer(address, oxychatProvider, options.checkNetworkId);

        return address && oxychatProvider;
      }
    );

    log({
      key,
      value: "check auth end",
    });

    return {
      auth,
      fallback: oxychatProvider,
    };
  } catch (error) {
    // console.error(error);
  }
};

/**
 * oxychatProvider: ProviderRpcClient,
 * options: any | undefined
 * callbacks: Callbacks
 */
const connectToOxychatWallet = async (
  OxychatProvider: any,
  options: any,
  callbacks: Callbacks
) => {
  try {
    const key = getKey("extension");

    log({
      key,
      value: "connection start",
    });

    const oxychatProvider = await makeMove(
      {
        before: "provider creating",
        after: "provider created",
        error: "provider creating failed",
        key,
      },
      async () => {
        return new OxychatProvider(options);
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
        const isExist = checkIsProviderExist(oxychatProvider);

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
          await oxychatProvider?.requestPermissions({
            permissions,
          });

        if (accountInteraction == null) {
          throw new Error("Insufficient permissions");
        }

        setupNetworkIdTimer(
          accountInteraction.address,
          oxychatProvider,
          options.checkNetworkId
        );

        return accountInteraction;
      }
    );

    log({
      key,
      value: "connection end",
    });

    callbacks.authorizationCompleted(oxychatProvider);

    await toggleExtensionWindow({
      isExtensionWindowOpen: false,
    });

    return oxychatProvider;
  } catch (error) {
    // console.error(error);
    callbacks.extensionWindowClosed();
  }

  await toggleExtensionWindow({
    isExtensionWindowOpen: false,
  });
};

/**
 * oxychatProvider: ProviderRpcClient,
 * options: any | undefined
 */
const getStandaloneConnectionToOxychatWallet = async (
  OxychatProvider: any,
  options: any
) => {
  try {
    const key = getKey("extension");

    log({
      key,
      value: "standalone start",
    });

    const oxychatProvider = await makeMove(
      {
        before: "standalone provider creating",
        after: "standalone provider created",
        error: "standalone provider creating failed",
        key,
      },
      async () => {
        return new OxychatProvider(options);
      }
    );

    log({
      key,
      value: "standalone end",
    });

    return oxychatProvider;
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

const oxychatWallet = {
  extension: {
    connector: connectToOxychatWallet,
    authChecker: checkOxychatWalletAuth,
    standalone: getStandaloneConnectionToOxychatWallet,
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

export default oxychatWallet;
