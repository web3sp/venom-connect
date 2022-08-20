import { rgba } from "polished";
import React from "react";
import styled from "styled-components";
import { SimpleFunction, Theme, ThemeConfig } from "../types";
import { CloseCross } from "./CloseCross";

type BackdropStyleProps = {
  show: boolean;
  backdrop: Theme["common"]["backdrop"];
  popup: Theme["popup"];
};
const SBackdrop = styled.div<BackdropStyleProps>`
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
  font-style: normal;
  font-weight: 400;
  color: ${({
    popup: {
      text: { color },
    },
  }) => color};

  cursor: default;

  position: fixed;

  width: 100vw;
  min-height: 100vh;
  margin-left: -50vw;
  left: 50%;
  z-index: 999999999999;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  transition: opacity 0.1s ease-in-out;
  will-change: opacity;

  /* ========================= */
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};

  top: ${({ backdrop: { offset } }) =>
    typeof offset === "string" ? offset : `-${offset || 0}px`};
  background: ${({ backdrop: { color, opacity } }) => {
    let alpha = 0.4;
    if (typeof opacity === "number") {
      alpha = opacity;
    }
    return rgba(color, alpha);
  }};
  backdrop-filter: ${({ backdrop: { backdropFilter } }) => backdropFilter};
  /* ========================= */

  & * {
    box-sizing: border-box !important;
  }
`;

type ModalContainerStyleProps = {
  show: boolean;
};
const SModalContainer = styled.div<ModalContainerStyleProps>`
  position: relative;

  width: 100vw;
  height: 100vh;
  padding: 15px;

  display: flex;
  align-items: center;
  justify-content: center;

  /* ========================= */
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};
  /* ========================= */
`;

const SHitbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

type ModalCardWrapperStyleProps = {
  show: boolean;
  maxWidth?: number;
  border: Theme["popup"]["border"];
};
const SModalCardWrapper = styled.div<ModalCardWrapperStyleProps>`
  width: 100%;
  max-height: 100%;
  margin: 10px;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* ========================= */
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};

  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "400px")};
  padding: ${({ border: { width } }) => `${width}px`};
  background: ${({ border: { color } }) => color};
  border-radius: ${({ border: { borderRadius } }) =>
    typeof borderRadius === "string" ? borderRadius : `${borderRadius}px`};
  /* ========================= */
`;

type ModalCardStyleProps = {
  show: boolean;
  popup: ThemeConfig["theme"]["popup"];
};
const SModalCard = styled.div<ModalCardStyleProps>`
  position: relative;

  width: 100%;
  height: 100%;
  flex-grow: 1;

  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* ========================= */
  padding: 28px
    ${({
      popup: {
        border: { width },
      },
    }) => `${40 - width}px`};
  background: ${({
    popup: {
      background: { color },
    },
  }) => color};
  backdrop-filter: ${({
    popup: {
      background: { backdropFilter },
    },
  }) => backdropFilter};
  border-radius: ${({
    popup: {
      border: { borderRadius },
    },
  }) =>
    typeof borderRadius === "string" ? borderRadius : `${borderRadius - 1}px`};
  /* ========================= */

  background-position: center;
`;

type CardHeader = {
  fontSize?: string | number;
  fontWeight?: string | number;
  lineHeight?: string | number;
};
const SCardHeader = styled.div<CardHeader>`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  text-align: left;

  font-weight: ${({ fontWeight }) => fontWeight || 600};
  font-size: ${({ fontSize }) =>
    (typeof fontSize === "number" ? `${fontSize}px` : fontSize) || "24px"};
  line-height: ${({ lineHeight }) =>
  (typeof lineHeight === "number" ? `${lineHeight}px` : lineHeight) || "28px"};
`;

type AbstractPopUpProps = {
  show: boolean;
  goBack?: SimpleFunction;
  onClose: SimpleFunction;
  themeObject: ThemeConfig["theme"];
  cardHeader: {
    text: string | JSX.Element;
    fontSize?: number | string;
  };
  children?: JSX.Element;
};
const AbstractPopUp = ({
  show,
  goBack,
  onClose,
  themeObject,
  cardHeader,
  children,
}: AbstractPopUpProps) => {
  return (
    <SBackdrop
      show={show}
      backdrop={themeObject.common?.backdrop}
      popup={themeObject.popup}
    >
      <SModalContainer show={show}>
        <SHitbox onClick={goBack || onClose} />
        <SModalCardWrapper show={show} border={themeObject.popup.border}>
          <SModalCard show={show} popup={themeObject.popup}>
            <SCardHeader
              fontSize={cardHeader.fontSize}
              fontWeight={themeObject.popup.title?.fontWeight}
            >
              <span>{cardHeader.text}</span>
              <CloseCross
                color={themeObject.popup.closeCross.color}
                hoverColor={themeObject.popup.closeCross.hoverColor}
                onClick={onClose}
              />
            </SCardHeader>
            {children}
          </SModalCard>
        </SModalCardWrapper>
      </SModalContainer>
    </SBackdrop>
  );
};

export default AbstractPopUp;
