import styled from "styled-components";
import { Theme } from "../types";

type Badge = {
  item: Theme["item"];
  isVisualHide: boolean;
};
const SBadge = styled.div<Badge>`
  opacity: ${({ isVisualHide }) => (isVisualHide ? 0 : 1)};

  max-height: ${({ isVisualHide }) => (isVisualHide ? "20px" : "none")};
  width: 100%;
  margin: 8px 0;
  padding: 4px 6px;

  text-align: left;

  background: ${({
    item: {
      warning: {
        background: { color },
      },
    },
  }) => color};
  border-radius: 4px;

  font-size: 12px;
  line-height: 16px;

  color: ${({
    item: {
      warning: {
        text: { color },
      },
    },
  }) => color};
`;

export enum Browsers {
  isChrome = "Google Chrome",
  isFirefox = "Mozilla Firefox",
}

export const filterNameArr = (nameArr: string[]) => {
  // @ts-ignore
  return nameArr?.map((n) => Browsers[n] || null)?.filter((n) => !!n);
};

type BrowserBadgeProps = {
  browserName: Browsers | string;
  themeObject: Theme;
  isVisualHide?: boolean;
};
const BrowserBadge = ({
  browserName,
  themeObject,
  isVisualHide,
}: BrowserBadgeProps) => {
  return (
    <SBadge item={themeObject.item} isVisualHide={!!isVisualHide}>
      Your browser is not supported now.
      <br />
      Please install {browserName}.
    </SBadge>
  );
};

type BrowserTextProps = {
  browserName: Browsers | string;
};
const BrowserText = ({ browserName }: BrowserTextProps) => (
  browserName ? <>You need to install {browserName} browser</> : <></>
);

type ProviderBadgeProps = {
  providerName: Browsers | string;
  themeObject: Theme;
  isVisualHide?: boolean;
};
const ProviderBadge = ({
  providerName,
  themeObject,
  isVisualHide,
}: ProviderBadgeProps) => {
  return (
    <SBadge item={themeObject.item} isVisualHide={!!isVisualHide}>
      Your wallet is not supported now.
      <br />
      Please install {providerName}.
    </SBadge>
  );
};

type ProviderTextProps = {
  providerName: Browsers | string;
};
const ProviderText = ({ providerName }: ProviderTextProps) => (
  <>You need to install {providerName}</>
);

export const notSupported = {
  browser: {
    Badge: BrowserBadge,
    Text: BrowserText,
  },
  provider: {
    Badge: ProviderBadge,
    Text: ProviderText,
  },
};
