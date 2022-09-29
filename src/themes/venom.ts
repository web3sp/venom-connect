import { getThemeWithFallback } from "./helpers";
import vector from "./vector.svg";

const theme = {
  common: {
    text: {
      color: "#FFFFFF",
    },
    backdrop: {
      color: "#11133D",
      opacity: 0.5,
      backdropFilter: "blur(5px)",
    },
  },
  popup: {
    background: {
      color: `#11133D url(${vector})`,
      backdropFilter: "blur(5px)",
    },
    border: {
      width: 2,
      color:
        "linear-gradient(317.16deg, rgba(81, 100, 154, 0.6) 78.4%, #68F7AA 105.77%)",
      borderRadius: 16,
    },
    closeCross: {
      color: "#FFFFFF",
      hoverColor: "#68F7AA",
    },
    title: {
      fontWeight: 500,
    },
    badgeColor: "#70718B",
    scroll: {
      color: "rgba(255, 255, 255, 0.1)",
    },
  },
  item: {
    background: {
      color: "rgba(255, 255, 255, 0.1)",
    },
    border: {
      width: 1,
      borderWidth: 1,
      borderHoverColor: "#68F7AA",
      color: "transparent",
      hoverColor: "rgba(255, 255, 255, 0.2)",
      pressedColor: "rgba(255, 255, 255, 0.15)",
    },
    warning: {
      background: {
        color: "#F8D660",
      },
      text: {
        color: "#3A3A51",
      },
    },

    icon: {
      main: {
        color: "#FCFCFC",
      },
      subTitle: {
        color: "#FFFFFF",
      },
    },
  },
};

const venomTheme = {
  name: "venom" as const,
  theme: getThemeWithFallback(theme),
};

export default venomTheme;
