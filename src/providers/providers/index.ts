import { ProviderOptions } from "../../types";
import { everDefaultLinks } from "./everwallet";
import { getVenomQr, venomDefaultLinks, VenomWalletLogo } from "./venomwallet";
export * from "./everwallet";
export * from "./venomwallet";

const DefaultWalletLogo = VenomWalletLogo; // todo

type linkCreator = (
  links: typeof venomDefaultLinks | typeof everDefaultLinks | undefined
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
      if (userValue) return userValue;

      const defaultValue = defaultLinks?.[id]?.[key];
      if (defaultValue && key === "qr") {
        if (id === "venomwallet") return getVenomQr();
        // if (id === "everwallet") return getEverQr();
      }
      return defaultValue;
    }

    return null;
  };

export const DEFAULT: ProviderOptions = {
  id: "wallet",
  wallet: {
    name: "wallet",
    description: "default wallet",
    logo: DefaultWalletLogo,
  },
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
