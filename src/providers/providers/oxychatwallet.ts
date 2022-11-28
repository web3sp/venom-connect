import { getValueByKey } from ".";
import { ProviderOptions } from "../../types";

import Apple from "../logos/Apple.svg";
import PlayMarket from "../logos/PlayMarket.svg";

// todo logos
import MobileApp from "../logos/MobileAppCommon.svg";

// for oxychat
const oxychatDefaultLink = "https://oxy.page.link/link";
const oxychatIosDeepLink = undefined;
const oxychatAndroidDeepLink = undefined;
const oxychatExtensionLinkChrome = oxychatDefaultLink;
export const oxychatDefaultLinks = {
  ios: oxychatIosDeepLink,
  android: oxychatAndroidDeepLink,
  qr: undefined,
  extension: [
    {
      browser: "chrome",
      link:
        oxychatExtensionLinkChrome !== null
          ? oxychatExtensionLinkChrome || oxychatDefaultLink
          : null,
    },
  ],
};

const OxychatWalletLogos = {
  connectors: {
    extension: MobileApp,
    ios: MobileApp,
    android: MobileApp,

    mobile: MobileApp,
    apple: Apple,
    playMarket: PlayMarket,
  },
};

export const getOxyQr = (link?: string) => {
  return (
    // url
    //
    oxychatDefaultLink +
    //
    // params
    //
    "?link=" +
    (link || encodeURIComponent(window.location.href))
  );
};

export const getOxyIos = getOxyQr;
export const getOxyAndroid = getOxyQr;

export const oxychatwallet: ProviderOptions = {
  id: "oxychatwallet",
  walletWaysToConnect: [
    {
      id: "extension",
      type: "extension",
      logo: {
        chrome: OxychatWalletLogos.connectors.extension,
      },
      name: "OXY.CHAT",
      options: {
        isCurrentBrowser: [["isFalse", "isFalse"]],
        installExtensionLink: (links: typeof oxychatDefaultLinks | undefined) =>
          getValueByKey("oxychatwallet", "extension")(links),
        checkIsProviderExist: () => !!window.__oxy, // todo,
        hide: true,
      },
    },

    {
      id: "mobile",
      type: "mobile",
      logo: OxychatWalletLogos.connectors.mobile,
      name: "OXY.CHAT Mobile App",
      options: {
        qr: (links: typeof oxychatDefaultLinks | undefined) =>
          getValueByKey("oxychatwallet", "qr")(links),
        devises: [
          {
            type: "ios",
            img: OxychatWalletLogos.connectors.apple,
            text: "iOS App",

            deepLink:
              "https://apps.apple.com/th/app/oxy-chat-call-send-receive/id1606970462",
            alt: "iOS",
            storeId: "ios",
          },
          {
            type: "android",
            img: OxychatWalletLogos.connectors.playMarket,
            text: "Android App",

            deepLink:
              "https://play.google.com/store/apps/details?id=com.oxy.chat",
            alt: "Android",
            storeId: "android",
          },
          // {
          //   type: "etc",
          //   img: OxychatWalletLogos.connectors.playMarket,
          //   text: "For Desktop",

          //   deepLink: "https://oxy.chat/downloads",
          //   alt: "Desktop",
          //   storeId: "desktop",
          // },
        ],
      },
    },

    {
      id: "ios",
      type: "ios",
      logo: OxychatWalletLogos.connectors.ios,
      name: "OXY.CHAT Mobile App",
      options: {
        text: "Click here to open App Store",

        deepLink: (
          links: typeof oxychatDefaultLinks | undefined = oxychatDefaultLinks
        ) => getValueByKey("oxychatwallet", "ios")(links),
      },
    },
    {
      id: "android",
      type: "android",
      logo: OxychatWalletLogos.connectors.android,
      name: "OXY.CHAT Mobile App",
      options: {
        text: "Click here to open Google Play",

        deepLink: (
          links: typeof oxychatDefaultLinks | undefined = oxychatDefaultLinks
        ) => getValueByKey("oxychatwallet", "android")(links),
      },
    },
  ],
};
