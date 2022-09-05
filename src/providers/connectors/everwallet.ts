import { getKey as getKeyRaw, log, makeMove } from "../../helpers/utils";
import { setupNetworkIdTimer } from "./networkdIdTimerUtil";

// checked for version "everscale-inpage-provider": "^0.3.28",
export const everWalletName = "Ever Wallet";

const getKey = (type: string) => getKeyRaw(everWalletName, type);

export const checkIsProviderExist = async (everProvider: any) => {
  try {
    const isExist = !!(await everProvider?.hasProvider());

    if (!isExist) {
      log({
        type: "error",
        key: everWalletName,
        value: "Extension is not installed",
      });
    }

    return isExist;
  } catch (error) {
    return false;
  }
};

/**
 * everProvider: typeof ProviderRpcClient,
 * options: any | undefined
 */
const checkEverWalletAuth = async (EverProvider: any, options: any) => {
  try {
    const key = getKey("extension/auth");

    log({
      key,
      value: "check auth start",
    });

    const everProvider = await makeMove(
      {
        before: "provider creating",
        after: "provider created",
        error: "provider creating failed",
        key,
      },
      async () => {
        return new EverProvider(options);
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
        const isExist = checkIsProviderExist(everProvider);

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
        const getProviderState = await everProvider?.getProviderState?.();
        const permissions = getProviderState?.permissions;
        const accountInteraction = permissions?.accountInteraction;
        const address = accountInteraction?.address;

        // здесь вызовется только когда уже был залогинен
        setupNetworkIdTimer(address, everProvider, options.checkNetworkId);

        return address && everProvider;
      }
    );

    log({
      key,
      value: "check auth end",
    });

    return auth;
  } catch (error) {
    // console.error(error);
  }
};

/**
 * everProvider: typeof ProviderRpcClient,
 * options: any | undefined
 */
const connectToEverWallet = async (EverProvider: any, options: any) => {
  try {
    const key = getKey("extension");

    log({
      key,
      value: "connection start",
    });

    const everProvider = await makeMove(
      {
        before: "provider creating",
        after: "provider created",
        error: "provider creating failed",
        key,
      },
      async () => {
        return new EverProvider(options);
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
        const isExist = checkIsProviderExist(everProvider);

        if (!isExist) throw new Error();
      }
    );

    const permissions = ["basic", "accountInteraction"];

    await makeMove(
      {
        before: `permissions requesting (${permissions.join(", ")})`,
        after: "permissions requested",
        error: "permissions requesting failed",
        key,
      },
      async () => {
        const { accountInteraction } = await everProvider?.requestPermissions({
          permissions,
        });

        if (accountInteraction == null) {
          throw new Error("Insufficient permissions");
        }

        setupNetworkIdTimer(
          accountInteraction.address,
          everProvider,
          options.checkNetworkId
        );

        return accountInteraction;
      }
    );

    log({
      key,
      value: "connection end",
    });

    return everProvider;
  } catch (error) {
    // console.error(error);
  }
};

/**
 * everProvider: typeof ProviderRpcClient,
 * options: any | undefined
 */
const getStandaloneConnectionToEverWallet = async (
  EverProvider: any,
  options: any
) => {
  try {
    const key = getKey("extension");

    log({
      key,
      value: "standalone start",
    });

    const everProvider = await makeMove(
      {
        before: "standalone provider creating",
        after: "standalone provider created",
        error: "standalone provider creating failed",
        key,
      },
      async () => {
        return new EverProvider(options);
      }
    );

    log({
      key,
      value: "standalone end",
    });

    return everProvider;
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

const everWallet = {
  extension: {
    connector: connectToEverWallet,
    authChecker: checkEverWalletAuth,
    standalone: getStandaloneConnectionToEverWallet,
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

export default everWallet;
