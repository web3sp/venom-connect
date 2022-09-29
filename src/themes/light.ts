import { getThemeWithFallback } from "./helpers";

const theme = {
  common: {
    text: {
      color: "#3A3A51",
    },
    backdrop: {
      color: "#F8F8F8",
      opacity: 0.5,
      backdropFilter: "blur(5px)",
    },
  },
  popup: {
    background: {
      color: "#F8F8F8",
      backdropFilter: "blur(5px)",
    },
    border: {
      width: 2,
      color:
        "linear-gradient(317.16deg, rgba(81, 100, 154, 0.6) 78.4%, #68F7AA 105.77%)",
      borderRadius: 16,
    },
    closeCross: {
      color: "#8BA9BC",
      hoverColor: "#68F7AA",
    },
    badgeColor: "#ACACB5",
    scroll: {
      color: "#E4E4EB",
    },
  },
  item: {
    background: {
      color: "#FFFFFF",
    },
    border: {
      width: 2,
      borderWidth: 0,
      borderHoverColor: "transparent",
      color: "#ECECEC",
      hoverColor:
        "linear-gradient(317.16deg, rgba(81, 100, 154, 0.6) 78.4%, #68F7AA 105.77%)",
      pressedColor: "rgb(104, 247, 170)",
    },
    warning: {
      background: {
        color: "#FFE79F",
      },
      text: {
        color: "#3A3A51",
      },
    },
    icon: {
      main: {
        color: "#575773",
      },
      subTitle: {
        color: "#A2AAAD",
      },
    },
  },
};

const lightTheme = {
  name: "light" as const,
  theme: getThemeWithFallback(theme),
};

export default lightTheme;
