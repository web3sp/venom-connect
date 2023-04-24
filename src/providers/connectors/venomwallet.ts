import { toggleExtensionWindow } from "../../helpers/backdrop";
import { getKey as getKeyRaw, log, makeMove } from "../../helpers/utils";
import { Callbacks } from "../../types";
import { setupNetworkIdTimer } from "./networkIdTimerUtil";

// checked for version "everscale-inpage-provider": "^0.3.28",
export const venomWalletName = "Venom Wallet";

const getKey = (type: string) => getKeyRaw(venomWalletName, type);

/**
 * venomProvider: ProviderRpcClient
 */
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
 * venomProvider: ProviderRpcClient,
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

        // здесь вызовется только когда уже был залогинен
        setupNetworkIdTimer(address, venomProvider, options.checkNetworkId);

        return address && venomProvider;
      }
    );

    log({
      key,
      value: "check auth end",
    });

    return {
      auth,
      fallback: venomProvider,
    };
  } catch (error) {
    // console.error(error);
  }
};

/**
 * venomProvider: ProviderRpcClient,
 * options: any | undefined
 * callbacks: Callbacks
 */
const connectToVenomWallet = async (
  VenomProvider: any,
  options: any,
  callbacks: Callbacks
) => {
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
        const { accountInteraction } = await venomProvider?.requestPermissions({
          permissions,
        });

        if (accountInteraction == null) {
          throw new Error("Insufficient permissions");
        }

        setupNetworkIdTimer(
          accountInteraction.address,
          venomProvider,
          options.checkNetworkId
        );

        return accountInteraction;
      }
    );

    log({
      key,
      value: "connection end",
    });

    callbacks.authorizationCompleted(venomProvider);

    await toggleExtensionWindow({
      isExtensionWindowOpen: false,
    });

    return venomProvider;
  } catch (error: any) {
    let emessage;
    if (typeof error === "object") {
      if (error.message) {
        emessage = error.message; // get the error message
      } else {
        emessage = JSON.stringify(error); // convert the object to a string
      }
    } else {
      emessage = error.toString(); // convert the error to a string
    }
    callbacks.extensionWindowError(emessage);
  } finally {
    await toggleExtensionWindow({
      isExtensionWindowOpen: false,
    });
  }
};

/**
 * venomProvider: ProviderRpcClient,
 * options: any | undefined
 */
const getStandaloneConnectionToVenomWallet = async (
  VenomProvider: any,
  options: any
) => {
  try {
    const key = getKey("extension");

    log({
      key,
      value: "standalone start",
    });

    const venomProvider = await makeMove(
      {
        before: "standalone provider creating",
        after: "standalone provider created",
        error: "standalone provider creating failed",
        key,
      },
      async () => {
        return new VenomProvider(options);
      }
    );

    log({
      key,
      value: "standalone end",
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
    standalone: getStandaloneConnectionToVenomWallet,
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
