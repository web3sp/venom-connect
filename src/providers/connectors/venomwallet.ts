import { getKey as getKeyRaw, log, makeMove } from "../../helpers/utils";

// checked for version "everscale-inpage-provider": "^0.3.28",
export const venomWalletName = "Venom Wallet";

const getKey = (type: string) => getKeyRaw(venomWalletName, type);

export const checkIsProviderExist = async (venomProvider: any) => {
  try {
    const isExist = !!(await venomProvider?.hasProvider());

    if (!isExist) {
      log({
        type: "error",
        key: venomWalletName,
        value: "Extension is not installed",
      });
    }

    return isExist;
  } catch (error) {
    return false;
  }
};

/**
 * venomProvider: typeof ProviderRpcClient,
 * options: any | undefined
 */
const checkVenomWalletAuth = async (VenomProvider: any, options: any) => {
  try {
    const key = getKey("extension/auth");

    log({
      key,
      value: "check auth start",
    });

    const venomProvider = await makeMove(
      {
        before: "provider creating",
        after: "provider created",
        error: "provider creating failed",
        key,
      },
      async () => {
        return new VenomProvider(options);
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
        const isExist = checkIsProviderExist(venomProvider);

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
        const getProviderState = await venomProvider?.getProviderState?.();
        const permissions = getProviderState?.permissions;
        const accountInteraction = permissions?.accountInteraction;
        const address = accountInteraction?.address;

        return address && venomProvider;
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
 * venomProvider: typeof ProviderRpcClient,
 * options: any | undefined
 */
const connectToVenomWallet = async (VenomProvider: any, options: any) => {
  try {
    const key = getKey("extension");

    log({
      key,
      value: "connection start",
    });

    const venomProvider = await makeMove(
      {
        before: "provider creating",
        after: "provider created",
        error: "provider creating failed",
        key,
      },
      async () => {
        return new VenomProvider(options);
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
        const isExist = checkIsProviderExist(venomProvider);

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
        const { accountInteraction } = await venomProvider?.requestPermissions({
          permissions,
        });

        if (accountInteraction == null) {
          throw new Error("Insufficient permissions");
        }

        return accountInteraction;
      }
    );

    log({
      key,
      value: "connection end",
    });

    return venomProvider;
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

const venomWallet = {
  extension: {
    connector: connectToVenomWallet,
    authChecker: checkVenomWalletAuth,
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

export default venomWallet;
