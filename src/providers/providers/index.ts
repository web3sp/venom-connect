import { ProviderOptions } from "../../types";
import { everDefaultLinks } from "./everwallet";
import { getVenomIos, getVenomQr, venomDefaultLinks } from "./venomwallet";
export * from "./everwallet";
export * from "./venomwallet";

type linkCreator = (
  links:
    | {
        ios:
          | string
          | null
          | {
              targetLink: string;
            };
        android: string | null;
        qr:
          | string
          | null
          | {
              targetLink: string;
            };
        extension: {
          browser: string;
          link: string | null;
        }[];
      }
    | undefined
) =>
  | string
  | null
  | {
      browser: string;
      link: string | null;
    }[];
const defaultLinks = {
  venomwallet: venomDefaultLinks,
  everwallet: everDefaultLinks,
};

export const getValueByKey: (
  id: keyof typeof defaultLinks,
  key: keyof typeof defaultLinks["venomwallet"]
) => linkCreator =
  (id = "venomwallet" as const, key) =>
  (links) => {
    if (links?.[key] !== null && !!id) {
      // @ts-ignore
      const userValue = links?.[key];

      if (
        userValue &&
        typeof userValue === "object" &&
        !Array.isArray(userValue) &&
        typeof userValue?.targetLink === "string"
      ) {
        if (key === "ios") {
          if (id === "venomwallet") {
            return getVenomIos(
              (userValue as { targetLink: string })?.targetLink || undefined
            );
          }
        }

        if (key === "qr") {
          if (id === "venomwallet") {
            return getVenomQr(
              (userValue as { targetLink: string })?.targetLink || undefined
            );
          }
        }

        return "/";
      }

      if (userValue)
        return userValue as Exclude<
          typeof userValue,
          {
            targetLink: string;
          }
        >;

      const defaultValue = defaultLinks?.[id]?.[key];

      if (defaultValue && key === "qr") {
        if (id === "venomwallet") return getVenomQr();
        // if (id === "everwallet") return getEverQr();
      }
      if (defaultValue && key === "ios") {
        if (id === "venomwallet") return getVenomIos();
        // if (id === "everwallet") return getEverIos();
      }
      return defaultValue;
    }

    return null;
  };

export const DEFAULT: ProviderOptions = {
  id: "wallet",
  // wallet: {
  //   name: "wallet",
  //   description: "default wallet",
  //   logo: DefaultWalletLogo,
  // },
  walletWaysToConnect: [],
};

// export const WALLETCONNECT: ProviderOptions = {
//   id: "walletconnect",
//   name: "WalletConnect",
//   logo: WalletConnectLogo,
//   type: "qr",
//   check: "isWalletConnect",
//   package: {
//     required: [["infuraId", "rpc"]],
//   },
// };
