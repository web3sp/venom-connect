import QRCode from "react-qr-code";
import styled from "styled-components";
import { ThemeConfig } from "../types";

type QrBox = {
  themeConfig: ThemeConfig;
};
const SQrBox = styled.div<QrBox>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  --x: 160px;
  min-width: var(--x);
  min-height: var(--x);

  border: 1px solid #ececec;
  border-radius: 8px;
  padding: 7px;

  /* ========================= */
  background: ${({
    themeConfig: {
      name,
      theme: {
        item: {
          background: { color },
        },
        common: { text },
      },
    },
  }) => (name === "dark" ? text.color : color)};
  border: 1px solid
    ${({
      themeConfig: {
        theme: {
          item: {
            border: { color },
          },
        },
      },
    }) => color};
  /* ========================= */

  background-position: center;
`;

type QRCardProps = {
  qr: string | null;
  themeConfig: ThemeConfig;
};
export const QrCard = ({ themeConfig, qr }: QRCardProps) => {
  return !!qr ? (
    <SQrBox themeConfig={themeConfig}>
      <QRCode
        value={qr}
        bgColor={
          themeConfig.name === "dark"
            ? themeConfig.theme.common.text.color
            : themeConfig.theme.item.background.color
        }
        fgColor={
          themeConfig.name === "dark"
            ? themeConfig.theme.popup.background.color
            : themeConfig.theme.common.text.color
        }
        size={144}
      />
    </SQrBox>
  ) : null;
};
