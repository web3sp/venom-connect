import { Theme } from "../types";

type PartialTextTheme = Omit<Theme, "popup" | "item"> & {
  popup: Omit<Theme["popup"], "text"> & Partial<Theme["popup"]["text"]>;
  item: Omit<Theme["item"], "text"> &
    Partial<Theme["item"]["text"]> & {
      warning: Omit<Theme["item"]["warning"], "text"> &
        Partial<Theme["item"]["warning"]["text"]>;
    };
};
export const getThemeWithFallback = (theme: PartialTextTheme): Theme => {
  return {
    ...theme,
    popup: {
      ...theme.popup,
      text: theme.common.text,
    },
    item: {
      ...theme.item,
      text: theme.common.text,
      warning: {
        ...theme.item.warning,
        text: theme.item.warning.text,
      },
    },
  };
};
