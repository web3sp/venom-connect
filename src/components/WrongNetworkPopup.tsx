import styled from "styled-components";
import { ThemeConfig } from "../types";

type Color = {
  color: string;
};
const ShowNetworkWrapper = styled.div`
  width: 100%;

  margin-top: 9px;
`;
const ShowNetwork = styled.div<Color>`
  width: 320px;
  height: 56px;
  border: ${({ color }) => color} 1px dashed;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  color: ${({ color }) => color};
`;

const ChangeWalletButton = styled.div`
  background: #11a97d;
  width: 320px;
  height: 56px;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 20px;

  margin-bottom: 17px;
`;

type TextDivType = {
  textAlign?: "center" | "left";
};
const TextDiv = styled.div<TextDivType>`
  font-size: 12px;
  line-height: 16px;
  width: 100%;

  margin: 12px 0;
  text-align: ${({ textAlign }) => textAlign || "center"};
`;
export type WrongNetworkPopupProps = {
  textColor: ThemeConfig["theme"]["common"]["text"]["color"];
  changeWallet: () => void;
};
export const WrongNetworkPopup = ({
  textColor,
  changeWallet,
}: WrongNetworkPopupProps) => {
  return (
    <>
      <ShowNetworkWrapper>
        <TextDiv textAlign="left">
          Please change network in your wallets settings to
        </TextDiv>
        <ShowNetwork color={textColor}>Venom Mainnet</ShowNetwork>
      </ShowNetworkWrapper>
      <TextDiv textAlign="center">or</TextDiv>
      <ChangeWalletButton onClick={changeWallet}>
        Change Wallet
      </ChangeWalletButton>
    </>
  );
};
