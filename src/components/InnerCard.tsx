import QRCode from "react-qr-code";
import styled from "styled-components";
import AppStore from "../images/AppStore.png";
import GooglePlay from "../images/GooglePlay.png";
import { ThemeConfig } from "../types";

const storeImages = {
  ios: AppStore,
  android: GooglePlay,
};

const getStoreImageById = (id: keyof typeof storeImages) => {
  return storeImages[id];
};

const SCard = styled.div`
  margin-top: 56px;

  width: 100%;
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
`;

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

const SDeviseList = styled.div`
  width: 100%;
  flex-grow: 1;

  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
`;

type Devise = {
  deepLink: string | null;
  alt?: string;
  storeId: keyof typeof storeImages;
};

type QRCardProps = {
  qr: string | null;
  devises: Devise[];
  themeConfig: ThemeConfig;
};
export const QrCard = ({ themeConfig, qr, devises }: QRCardProps) => {
  return (
    <SCard>
      {!!qr && (
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
      )}
      <SDeviseList>
        {devises
          .filter(
            ({ deepLink, storeId }) =>
              !!deepLink && !!getStoreImageById(storeId)
          )
          .map(({ deepLink, alt, storeId }) => (
            <a href={deepLink || ""} target="_blank" rel="noopener noreferrer">
              <img src={getStoreImageById(storeId)} alt={alt || ""} />
            </a>
          ))}
      </SDeviseList>
    </SCard>
  );
};
