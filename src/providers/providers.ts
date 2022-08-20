import { ProviderOptions } from "../types";
import { venomWalletName } from "./connectors/venomwallet";
import * as logos from "./logos";
import Android from "./logos/Android.svg";
import Apple from "./logos/Apple.svg";
import ChromeExtension from "./logos/ChromeExtensionVenom.svg";
import MobileApp from "./logos/MobileAppVenom.svg";
import PlayMarket from "./logos/PlayMarket.svg";
import VenomWalletLogo from "./logos/VenomWalletLogo.svg";

const DefaultWalletLogo = VenomWalletLogo; // todo

// for venom
const venomDefaultLink = "/";
const venomIosDeepLink = undefined;
const venomAndroidDeepLink =
  "https://play.google.com/store/apps/details?id=com.venom.wallet";
const venomExtensionLink =
  "https://chrome.google.com/webstore/detail/venom-wallet/ojggmchlghnjlapmfbnjholfjkiidbch";
const venomDefaultLinks = {
  ios: venomIosDeepLink !== null ? venomIosDeepLink || venomDefaultLink : null,
  android:
    venomAndroidDeepLink !== null
      ? venomAndroidDeepLink || venomDefaultLink
      : null,
  qr:
    venomIosDeepLink !== null
      ? venomIosDeepLink || venomAndroidDeepLink || venomDefaultLink
      : null,
  extension:
    venomExtensionLink !== null ? venomExtensionLink || venomDefaultLink : null,
};
//

export type linkCreator = (
  links: typeof venomDefaultLinks | undefined
) => string | null;
const defaultLinks = {
  venomwallet: venomDefaultLinks,
};

const getVenomQr = () => {
  return (
    // url
    //
    "https://venomwallet.page.link" +
    //
    // params
    //
    "/?link=" +
    encodeURIComponent(window.location.href) +
    //
    "&apn=" +
    "com.venom.wallet" +
    //
    "&isi=" +
    "1622970889" +
    //
    "&ibi=" +
    "foundation.venom.wallet"
  );
};

const getValueByKey: (
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
      if (defaultValue && id === "venomwallet" && key === "qr") {
        return getVenomQr();
      }
      return defaultValue;
    }

    return null;
  };

const VenomWalletLogos = {
  wallet: VenomWalletLogo,
  connectors: {
    chromeExtension: ChromeExtension,
    // mobile: logos.MobileApp?.() || MobileApp, пока так
    mobile: MobileApp,
    ios: logos.Apple?.() || Apple,
    android: logos.Android?.() || Android,
    playMarket: PlayMarket,
  },
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

export const venomwallet: ProviderOptions = {
  id: "venomwallet",
  wallet: {
    name: venomWalletName,
    description: "The official wallet of the Venom network",
    logo: VenomWalletLogos.wallet,
  },
  walletWaysToConnect: [
    {
      id: "extension",
      type: "extension",
      logo: VenomWalletLogos.connectors.chromeExtension,
      name: "Venom Chrome Extension",
      options: {
        isCurrentBrowser: ["isChrome", "isDesktop"],
        installExtensionLink: (links: typeof venomDefaultLinks | undefined) =>
          getValueByKey("venomwallet", "extension")(links),
        checkIsProviderExist: () => !!window.__venom, // todo
      },
    },
    {
      id: "mobile",
      type: "mobile",
      logo: VenomWalletLogos.connectors.mobile,
      name: "Venom Mobile App",
      options: {
        qr: (links: typeof venomDefaultLinks | undefined) =>
          getValueByKey("venomwallet", "qr")(links),
        devises: [
          {
            type: "ios",
            img: VenomWalletLogos.connectors.ios,
            text: "iOS App",

            deepLink: (links: typeof venomDefaultLinks | undefined) =>
              getValueByKey("venomwallet", "ios")(links),
            alt: "iOS",
            storeId: "ios",
          },
          {
            type: "android",
            img: VenomWalletLogos.connectors.playMarket,
            text: "Android App",

            deepLink: (
              links: typeof venomDefaultLinks | undefined = venomDefaultLinks
            ) => getValueByKey("venomwallet", "android")(links),
            alt: "Android",
            storeId: "android",
          },
        ],
      },
    },
    {
      id: "ios",
      type: "ios",
      logo: VenomWalletLogos.connectors.ios,
      name: "Mobile App",
      options: {
        text: "Click here to App Store",

        deepLink: (
          links: typeof venomDefaultLinks | undefined = venomDefaultLinks
        ) => getValueByKey("venomwallet", "ios")(links),
      },
    },
    {
      id: "android",
      type: "android",
      logo: VenomWalletLogos.connectors.android,
      name: "Android Mobile App",
      options: {
        text: "Click here to open Google Play",

        deepLink: (
          links: typeof venomDefaultLinks | undefined = venomDefaultLinks
        ) => getValueByKey("venomwallet", "android")(links),
      },
    },
  ],
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
