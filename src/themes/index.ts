import { ThemeConfig } from "../types";
import darkTheme from "./dark";
import lightTheme from "./light";
import venomTheme from "./venom";

export const themesList = {
  default: lightTheme,
  [lightTheme.name]: lightTheme,
  [darkTheme.name]: darkTheme,
  [venomTheme.name]: venomTheme,
};

export type ThemeNameList =
  | typeof lightTheme.name
  | typeof darkTheme.name
  | typeof venomTheme.name;

export const getThemeConfig = (
  theme: ThemeNameList | ThemeConfig["theme"]
): ThemeConfig => {
  return typeof theme === "string"
    ? themesList[theme]
    : {
        name: "custom",
        theme,
      };
};
