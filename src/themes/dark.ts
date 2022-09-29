import { getThemeWithFallback } from "./helpers";

const theme = {
  common: {
    text: {
      color: "#F2F2F2",
    },
    backdrop: {
      color: "#1C1C26",
      opacity: 0.5,
      backdropFilter: "blur(5px)",
    },
  },
  popup: {
    background: {
      color: "#1C1C26",
      backdropFilter: "blur(5px)",
    },
    border: {
      width: 2,
      color:
        "linear-gradient(317.16deg, rgba(81, 100, 154, 0.6) 78.4%, #68F7AA 105.77%)",

      borderRadius: 16,
    },
    closeCross: {
      color: "#436177",
      hoverColor: "#68F7AA",
    },
    badgeColor: "#3B4363",
    scroll: {
      color: "#3A3A51",
    },
  },
  item: {
    background: {
      color: "#3A3A51",
    },
    border: {
      width: 2,
      borderWidth: 0,
      borderHoverColor: "transparent",
      color: "rgba(72, 84, 125, 1)",
      hoverColor: "#68F7AA",
      pressedColor: "rgb(104, 247, 170)",
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
        color: "#9292B5",
      },
      subTitle: {
        color: "#A2AAAD",
      },
    },
  },
};

const darkTheme = {
  name: "dark" as const,
  theme: getThemeWithFallback(theme),
};

export default darkTheme;
