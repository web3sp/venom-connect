import { getValueByKey } from ".";
import { ProviderOptions } from "../../types";

import Apple from "../logos/Apple.svg";
import PlayMarket from "../logos/PlayMarket.svg";

// todo logos
import MobileApp from "../logos/MobileAppOneart.svg";
import MobileAppWhite from "../logos/MobileAppOneartWhite.svg";

// for oneart
const oneartDefaultLink = "https://oneart.page.link/?apn=oneart.digital&isi=1600729515&ibi=co.oneart";
const oneartIosDeepLink = undefined;
const oneartAndroidDeepLink = undefined;
const oneartExtensionLinkChrome = oneartDefaultLink;
export const oneartDefaultLinks = {
  ios: oneartIosDeepLink,
  android: oneartAndroidDeepLink,
  qr: undefined,
  extension: [
    {
      browser: "chrome",
      link:
        oneartExtensionLinkChrome !== null
          ? oneartExtensionLinkChrome || oneartDefaultLink
          : null,
    },
  ],
};

export const getOneArtQr = (link?: string) => {
  return (
    // url
    //
    oneartDefaultLink +
    //
    // params
    //
    "&link=https%3A%2F%2Foneart.digital%2Fen%2F%3Fgetapp%3Dtrue%26action%3Dbrowser%26url%3D" +
    (link || encodeURIComponent(window.location.href))
  );
};

export const getOneArtIos = getOneArtQr;
export const getOneArtAndroid = getOneArtQr;

export const oneartwallet: ProviderOptions = {
  id: "oneartwallet",
  walletWaysToConnect: [
    {
      id: "extension",
      type: "extension",
      logo: {
        chrome: MobileApp,
      },
      name: "OneArt",
      options: {
        isCurrentBrowser: [["isFalse", "isFalse"]],
        installExtensionLink: (links: typeof oneartDefaultLinks | undefined) =>
          getValueByKey("oneartwallet", "extension")(links),
        checkIsProviderExist: () => window.__venom && window.__venom.isOneArt,
        hide: true,
      },
    },

    {
      id: "mobile",
      type: "mobile",
      logo: MobileApp,
      logoWhite: MobileAppWhite,
      name: "OneArt Mobile App",
      options: {
        qr: (links: typeof oneartDefaultLinks | undefined) =>
          getValueByKey("oneartwallet", "qr")(links),
        devises: [
          {
            type: "ios",
            img: Apple,
            text: "iOS App",

            deepLink:
              "https://apps.apple.com/app/id1600729515",
            alt: "iOS",
            storeId: "ios",
          },
          {
            type: "android",
            img: PlayMarket,
            text: "Android App",

            deepLink:
              "https://play.google.com/store/apps/details?id=oneart.digital",
            alt: "Android",
            storeId: "android",
          },
        ],
      },
    },

    {
      id: "ios",
      type: "ios",
      logo: MobileApp,
      logoWhite: MobileAppWhite,
      name: "OneArt Mobile App",
      options: {
        text: "Click here to open App Store",

        deepLink: (
          links: typeof oneartDefaultLinks | undefined = oneartDefaultLinks
        ) => getValueByKey("oneartwallet", "ios")(links),
      },
    },
    {
      id: "android",
      type: "android",
      logo: MobileApp,
      logoWhite: MobileAppWhite,
      name: "OneArt Mobile App",
      options: {
        text: "Click here to open Google Play",

        deepLink: (
          links: typeof oneartDefaultLinks | undefined = oneartDefaultLinks
        ) => getValueByKey("oneartwallet", "android")(links),
      },
    },
  ],
};
