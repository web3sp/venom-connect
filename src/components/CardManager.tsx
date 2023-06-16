import { useEffect, useState } from "react";
import { browserName, isIOS, isMobile } from "react-device-detect";
import { checkIsCurrentBrowser } from "../helpers/utils";
import { ProviderCard, ProviderCardProps } from "./ProviderCard";

type CardManagerProps = Omit<
  ProviderCardProps,
  "isProviderExist" | "isCurrentBrowser" | "browser"
>;
export const CardManager = (props: CardManagerProps) => {
  const {
    connectorType,
    options,
    isBadBrowser,
    allBrowsersNames,
    browsersNames,
  } = props;
  const [isProviderExist, setIsProviderExist] = useState<boolean | undefined>();
  const [isCurrentBrowser, setIsCurrentBrowser] = useState<
    boolean | undefined
  >();

  const checking = async () => {
    const { isCurrentBrowser } = checkIsCurrentBrowser(
      options?.isCurrentBrowser
    );

    const result = isCurrentBrowser
      ? await options?.["checkIsProviderExist"]?.()
      : false;

    setIsCurrentBrowser(isCurrentBrowser);
    setIsProviderExist(result);
  };

  useEffect(() => {
    checking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  // вывод списка под разные платформы
  if (connectorType) {
    if (options?.["hide"]) return null; // hide card if option
    if (isMobile) {
      if (isIOS) {
        return connectorType === "ios" ? (
          <ProviderCard
            {...props}
            isCurrentBrowser={true}
            isProviderExist={true}
            isFirst={false} // всё хорошо с ними
          />
        ) : null;
      } else {
        return connectorType === "android" ? (
          <ProviderCard
            {...props}
            isCurrentBrowser={true}
            isProviderExist={true}
            isFirst={false}
          />
        ) : null;
      }
    } else {
      if (connectorType === "mobile") {
        return (
          <ProviderCard
            {...props}
            isCurrentBrowser={true}
            isProviderExist={true}
          />
        );
      }

      if (connectorType === "extension") {
        if (isCurrentBrowser) {
          if (isProviderExist === undefined) return <>...</>;
          return (
            <ProviderCard
              {...props}
              isCurrentBrowser={isCurrentBrowser}
              isProviderExist={isProviderExist}
              browser={browserName}
              isBadBrowser={isBadBrowser}
              allBrowsersNames={allBrowsersNames}
              browsersNames={browsersNames}
            />
          );
        } else {
          return (
            <ProviderCard
              {...props}
              isCurrentBrowser={false}
              isProviderExist={false}
              onClick={undefined}
              isFirst={props.isFirst}
            />
          );
        }
      }
    }

    return null;
  }

  return (
    <ProviderCard {...props} isCurrentBrowser={true} isProviderExist={true} />
  );
};
