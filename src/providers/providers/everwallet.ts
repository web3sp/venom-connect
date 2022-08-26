import { getValueByKey } from ".";
import { ProviderOptions } from "../../types";
import { everWalletName } from "../connectors/everwallet";
import * as logos from "../logos";
import Android from "../logos/Android.svg";
import Apple from "../logos/Apple.svg";
import ChromeExtension from "../logos/ChromeExtension.svg";
import EverWalletLogo from "../logos/EverWalletLogo.svg";
import MobileApp from "../logos/MobileApp.svg";
import PlayMarket from "../logos/PlayMarket.svg";

export { EverWalletLogo };

// for ever
const everDefaultLink = "/";
const everIosDeepLink =
  "https://apps.apple.com/ru/app/ton-crystal-wallet/id1581310780";
const everAndroidDeepLink =
  "https://play.google.com/store/apps/details?id=com.broxus.crystal.app";
const everExtensionLink =
  "https://chrome.google.com/webstore/detail/ever-wallet/cgeeodpfagjceefieflmdfphplkenlfk";
export const everDefaultLinks = {
  ios: everIosDeepLink !== null ? everIosDeepLink || everDefaultLink : null,
  android:
    everAndroidDeepLink !== null
      ? everAndroidDeepLink || everDefaultLink
      : null,
  qr:
    everIosDeepLink !== null
      ? everIosDeepLink || everAndroidDeepLink || everDefaultLink
      : null,
  extension:
    everExtensionLink !== null ? everExtensionLink || everDefaultLink : null,
};
//

export const getEverQr = () => {
  return "";
};

const EverWalletLogos = {
  wallet: EverWalletLogo,
  connectors: {
    chromeExtension: ChromeExtension,
    mobile: logos.MobileApp?.() || MobileApp,
    ios: logos.Apple?.() || Apple,
    android: logos.Android?.() || Android,
    playMarket: PlayMarket,
  },
};

export const everwallet: ProviderOptions = {
  id: "everwallet",
  wallet: {
    name: everWalletName,
    description: "The official wallet of the Everscale network",
    logo: EverWalletLogos.wallet,
  },
  walletWaysToConnect: [
    {
      id: "extension",
      type: "extension",
      logo: EverWalletLogos.connectors.chromeExtension,
      name: "Chrome Extension",
      options: {
        isCurrentBrowser: ["isChrome", "isDesktop"],
        installExtensionLink: (links: typeof everDefaultLinks | undefined) =>
          getValueByKey("everwallet", "extension")(links),
        checkIsProviderExist: () => true, // todo
      },
    },
    {
      id: "mobile",
      type: "mobile",
      logo: EverWalletLogos.connectors.mobile,
      name: "Mobile App",
      options: {
        qr: (links: typeof everDefaultLinks | undefined) =>
          getValueByKey("everwallet", "qr")(links),
        devises: [
          {
            type: "ios",
            img: EverWalletLogos.connectors.ios,
            text: "iOS App",

            deepLink: (links: typeof everDefaultLinks | undefined) =>
              getValueByKey("everwallet", "ios")(links),
            alt: "iOS",
            storeId: "ios",
          },
          {
            type: "android",
            img: EverWalletLogos.connectors.playMarket,
            text: "Android App",

            deepLink: (
              links: typeof everDefaultLinks | undefined = everDefaultLinks
            ) => getValueByKey("everwallet", "android")(links),
            alt: "Android",
            storeId: "android",
          },
        ],
      },
    },
    {
      id: "ios",
      type: "ios",
      logo: EverWalletLogos.connectors.ios,
      name: "Mobile App",
      options: {
        text: "Click here to App Store",

        deepLink: (
          links: typeof everDefaultLinks | undefined = everDefaultLinks
        ) => getValueByKey("everwallet", "ios")(links),
      },
    },
    {
      id: "android",
      type: "android",
      logo: EverWalletLogos.connectors.android,
      name: "Android Mobile App",
      options: {
        text: "Click here to open Google Play",

        deepLink: (
          links: typeof everDefaultLinks | undefined = everDefaultLinks
        ) => getValueByKey("everwallet", "android")(links),
      },
    },
  ],
};
