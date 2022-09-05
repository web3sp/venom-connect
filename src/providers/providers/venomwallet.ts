import { getValueByKey } from ".";
import { ProviderOptions } from "../../types";
import { venomWalletName } from "../connectors/venomwallet";
import ChromeExtension from "../logos/ChromeExtensionVenom.svg";
import MobileApp from "../logos/MobileAppVenom.svg";
import PlayMarket from "../logos/PlayMarket.svg";
import VenomWalletLogo from "../logos/VenomWalletLogo.svg";

export { VenomWalletLogo };

// for venom
const venomDefaultLink = "/";
const venomIosDeepLink = "https://testflight.apple.com/join/x5jOlxzL";
const venomAndroidDeepLink =
  "https://play.google.com/store/apps/details?id=com.venom.wallet";
const venomExtensionLinkChrome =
  "https://chrome.google.com/webstore/detail/venom-wallet/ojggmchlghnjlapmfbnjholfjkiidbch";
export const venomDefaultLinks = {
  ios: venomIosDeepLink !== null ? venomIosDeepLink || venomDefaultLink : null,
  android:
    venomAndroidDeepLink !== null
      ? venomAndroidDeepLink || venomDefaultLink
      : null,
  qr:
    venomIosDeepLink !== null
      ? venomIosDeepLink || venomAndroidDeepLink || venomDefaultLink
      : null,
  extension: [
    {
      browser: "chrome",
      link:
        venomExtensionLinkChrome !== null
          ? venomExtensionLinkChrome || venomDefaultLink
          : null,
    },
  ],
};
//

export const getVenomQr = () => {
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

const VenomWalletLogos = {
  wallet: VenomWalletLogo,
  connectors: {
    chromeExtension: ChromeExtension,
    // mobile: logos.MobileApp?.() || MobileApp, пока так
    mobile: MobileApp,
    // ios: logos.Apple?.() || Apple,
    ios: MobileApp,
    // android: logos.Android?.() || Android,
    android: MobileApp,
    playMarket: PlayMarket,
  },
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
        isCurrentBrowser: [["isChrome", "isDesktop"]],
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
          {
            type: "apk",
            img: VenomWalletLogos.connectors.playMarket,
            text: "Android Apk",

            deepLink: "https://venom.foundation/wallet/android",
            alt: "Android Apk",
            storeId: "android-apk",
          },
        ],
      },
    },
    {
      id: "ios",
      type: "ios",
      logo: VenomWalletLogos.connectors.ios,
      name: "Venom Mobile App",
      options: {
        text: "Click here to open App Store",

        deepLink: (
          links: typeof venomDefaultLinks | undefined = venomDefaultLinks
        ) => getValueByKey("venomwallet", "ios")(links),
      },
    },
    {
      id: "android",
      type: "android",
      logo: VenomWalletLogos.connectors.android,
      name: "Venom Mobile App",
      options: {
        text: "Click here to open Google Play",

        deepLink: (
          links: typeof venomDefaultLinks | undefined = venomDefaultLinks
        ) => getValueByKey("venomwallet", "android")(links),
      },
    },
  ],
};
