import * as deviceDetect from "react-device-detect";

type Logger = {
  type?: "error" | "log";
  key?: string;
  value?: string;
};
export const log = ({ type = "log", key, value }: Logger) => {
  return console[type]?.(`${key ? key + ": " : ""}${value}`);
};

export const getKey = (name: string, type: string) => `${name}/${type}`;

const disableLogs: boolean = true;

type MakeMove = {
  logger: {
    before: string;
    after: string;
    error: string;
    key?: string;
  };
  cb: () => Promise<any> | void;
};
export const makeMove = async (
  logger: MakeMove["logger"],
  cb: MakeMove["cb"]
) => {
  try {
    if (!disableLogs)
      log({
        key: logger.key,
        value: logger.before,
      });

    const response = await cb();

    if (!disableLogs)
      log({
        key: logger.key,
        value: logger.after,
      });
    return response;
  } catch (error: any) {
    if (!disableLogs)
      log({
        type: "error",
        key: logger.key,
        value: logger.error,
      });
    throw error;
  }
};

export const checkIsCurrentBrowser = (isCurrentBrowser?: any) => {
  let _isCurrentBrowser: boolean | undefined;

  try {
    if (isCurrentBrowser && Array.isArray(isCurrentBrowser)) {
      // format: ["isChrome", "isDesktop"]
      _isCurrentBrowser = isCurrentBrowser?.reduce((r, item, i) => {
        if (item && Array.isArray(item)) {
          // format: [["isChrome", "isDesktop"], ["isFirefox", "isDesktop"]]
          return (
            (r && !!i) ||
            !!item?.reduce((rInner, itemInner) => {
              // @ts-ignore
              return rInner && deviceDetect[itemInner];
            }, true)
          );
        }
        // @ts-ignore
        return r && deviceDetect[item];
      }, true);
    } else {
      // format: "isDesktop"
      // @ts-ignore
      _isCurrentBrowser = deviceDetect[isCurrentBrowser];
    }
  } catch (error) {
    _isCurrentBrowser = false;
  }

  return {
    isCurrentBrowser: !!_isCurrentBrowser,
  };
};
