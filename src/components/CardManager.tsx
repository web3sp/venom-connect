import { useEffect, useState } from "react";
import { isIOS, isMobile } from "react-device-detect";
import { checkIsCurrentBrowser } from "../helpers/utils";
import { ProviderCard, ProviderCardProps } from "./ProviderCard";

type CardManagerProps = Omit<
  ProviderCardProps,
  "isProviderExist" | "isCurrentBrowser"
> & {
  // checkIsProviderExist: () => Promise<boolean>;
};
export const CardManager = (props: CardManagerProps) => {
  const { connectorType, options } = props;
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

  if (connectorType) {
    if (isMobile) {
      if (isIOS) {
        return connectorType === "ios" ? (
          <ProviderCard
            {...props}
            isCurrentBrowser={true}
            isProviderExist={true}
            isFirst={true}
          />
        ) : null;
      } else {
        return connectorType === "android" ? (
          <ProviderCard
            {...props}
            isCurrentBrowser={true}
            isProviderExist={true}
            isFirst={true}
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
            />
          );
        } else {
          return (
            <ProviderCard
              {...props}
              isCurrentBrowser={false}
              isProviderExist={false}
              onClick={undefined}
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
