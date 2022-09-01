import styled from "styled-components";
import {ThemeConfig} from "../types";

type Color = {
  color: string;
};
const ShowNetwork = styled.div<Color>`
  width: 320px;
  height: 56px;
  border: ${({color}) => color} 1px dashed;

  display: flex;
  align-items: center;
  justify-content: center;
  
  border-radius: 8px;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  color: ${({color}) => color};
  
  margin-top: 35px;
`

const SwitchNetworkButton = styled.div`
  background: #11A97D;
  width: 320px;
  height: 56px;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 20px;
`
const ChangeNetTextDiv = styled.div`
  font-size: 12px;
  line-height: 16px;
  margin-top: 12px;
  width: 100%;
  text-align: left;
`
export type WrongNetworkPopupProps = {
  textColor: ThemeConfig["theme"]["common"]["text"]["color"];
};
export const WrongNetworkPopup = ({textColor}: WrongNetworkPopupProps) => {
  return <>
    <ShowNetwork color={textColor}>Venom Mainnet</ShowNetwork>
    <ChangeNetTextDiv>Please change network in your wallets settings</ChangeNetTextDiv>
    {/*<SwitchNetworkButton>Switch Network</SwitchNetworkButton>*/}
  </>
};
