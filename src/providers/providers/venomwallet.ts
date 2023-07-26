import { getValueByKey } from ".";
import { ProviderOptions } from "../../types";
import Apple from "../logos/Apple.svg";
import ChromeExtension from "../logos/ChromeExtensionVenom.svg";
import FirefoxExtension from "../logos/FirefoxExtensionVenom.svg";
import MobileApp from "../logos/MobileAppVenom.svg";
import MobileAppWhite from "../logos/MobileAppVenomWhite.svg";
import PlayMarket from "../logos/PlayMarket.svg";
import VenomWalletLogo from "../logos/VenomWalletLogo.svg";

export { VenomWalletLogo };

export const getVenomQr = (link?: string) => {
  return (
    // url
    //
    "https://venomwallet.page.link" +
    //
    // params
    //
    "/?link=" +
    (link || encodeURIComponent(window.location.href)) +
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

export const getVenomIos = getVenomQr;
export const getVenomAndroid = getVenomQr;

// for venom
const venomDefaultLink = "/";
const venomIosDeepLink = undefined; // getVenomIos in runtime
const venomAndroidDeepLink = undefined; // getVenomAndroid in runtime
const venomExtensionLinkChrome =
  "https://chrome.google.com/webstore/detail/venom-wallet/ojggmchlghnjlapmfbnjholfjkiidbch";
export const venomDefaultLinks = {
  ios: venomIosDeepLink,
  android: venomAndroidDeepLink,
  qr: undefined,
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

const VenomWalletLogos = {
  wallet: VenomWalletLogo,
  connectors: {
    chromeExtension: ChromeExtension,
    firefoxExtension: FirefoxExtension,
    mobile: MobileApp,
    mobileWhite: MobileAppWhite,
    ios: MobileApp,
    iosWhite: MobileAppWhite,
    android: MobileApp,
    androidWhite: MobileAppWhite,
    apple: Apple,
    playMarket: PlayMarket,
  },
};

export const venomwallet: ProviderOptions = {
  id: "venomwallet",
  // wallet: {
  //   name: venomWalletName,
  //   description: "The official wallet of the Venom network",
  //   logo: VenomWalletLogos.wallet,
  // },
  walletWaysToConnect: [
    {
      id: "extension",
      type: "extension",
      logo: {
        chrome: VenomWalletLogos.connectors.chromeExtension,
        // firefox: VenomWalletLogos.connectors.firefoxExtension,
      },
      name: "Venom [[browser]] Extension", // [[browser]] will replace to 'Chrome' or 'Firefox'
      options: {
        isCurrentBrowser: [["Blink", "isDesktop"]],
        installExtensionLink: (links: typeof venomDefaultLinks | undefined) =>
          getValueByKey("venomwallet", "extension")(links),
        checkIsProviderExist: () => window.__venom && !window.__venom.isOneArt,
      },
    },
    {
      id: "mobile",
      type: "mobile",
      logo: VenomWalletLogos.connectors.mobile,
      logoWhite: VenomWalletLogos.connectors.mobileWhite,
      name: "Venom Mobile App",
      options: {
        qr: (links: typeof venomDefaultLinks | undefined) =>
          getValueByKey("venomwallet", "qr")(links),
        devises: [
          {
            type: "ios",
            img: VenomWalletLogos.connectors.apple,
            text: "iOS App",

            deepLink:
              "https://apps.apple.com/app/venom-blockchain-wallet/id1622970889",
            alt: "iOS",
            storeId: "ios",
          },
          {
            type: "android",
            img: VenomWalletLogos.connectors.playMarket,
            text: "Android App",

            deepLink:
              "https://play.google.com/store/apps/details?id=com.venom.wallet",
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
      logoWhite: VenomWalletLogos.connectors.iosWhite,
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
      logoWhite: VenomWalletLogos.connectors.androidWhite,
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
