import { rgba } from "polished";
import { useEffect, useState } from "react";
import { isDesktop } from "react-device-detect";
import styled from "styled-components";
import { SimpleFunction, Theme, ThemeConfig } from "../types";
import { CloseCross } from "./CloseCross";

export const SECONDS: number = 0.25;

type BackdropStyleProps = {
  show: boolean;
  visible: boolean;
  backdrop: Theme["common"]["backdrop"];
  popup: Theme["popup"];
};
const SBackdrop = styled.div<BackdropStyleProps>`
  transition: all ${SECONDS / 2}s ease-in-out;

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

  width: 100%;
  height: 100%;
  z-index: 999999999999;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  transition: opacity 0.1s ease-in-out;
  will-change: opacity;

  /* ========================= */
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
  pointer-events: ${({ visible }) => (visible ? "auto" : "none")};

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
  visible: boolean;
};
const SModalContainer = styled.div<ModalContainerStyleProps>`
  transition: all ${SECONDS}s ease-in-out;

  position: relative;

  width: 100vw;
  height: 100vh;
  padding: 15px;

  display: flex;
  align-items: center;
  justify-content: center;

  /* ========================= */
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
  pointer-events: ${({ visible }) => (visible ? "auto" : "none")};
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
  visible: boolean;
  maxWidth?: number;
  border: Theme["popup"]["border"];
};
const SModalCardWrapper = styled.div<ModalCardWrapperStyleProps>`
  transition: all ${SECONDS}s ease-in-out;

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
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
  pointer-events: ${({ visible }) => (visible ? "auto" : "none")};

  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "400px")};
  padding: ${({ border: { width } }) => `${width}px`};
  background: ${({ border: { color } }) => color};
  border-radius: ${({ border: { borderRadius } }) =>
    typeof borderRadius === "string" ? borderRadius : `${borderRadius}px`};
  /* ========================= */
`;

type ModalCardStyleProps = {
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
    (typeof lineHeight === "number" ? `${lineHeight}px` : lineHeight) ||
    "28px"};
`;

type TextAlign = {
  textAlign?: string;
};
const STextAlign = styled.div<TextAlign>`
  width: 100%;
  text-align: ${({ textAlign }) => `${textAlign || "center"}`};
`;

type ScrollSection = {
  color: string;
  isDesktop: boolean;
};
const SScrollSection = styled.div<ScrollSection>`
  max-width: 364px;

  height: 100%;
  max-height: ${({ isDesktop }) =>
    `${isDesktop ? "min(calc(100vh - 210px), 360px)" : "100vh"}`};

  padding: 0 22px;
  margin: 0 -22px;

  overflow-x: hidden;
  overflow-y: auto;
  direction: ltr;
  scrollbar-color: transparent;
  scrollbar-width: all;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: ${({ color }) => color};
  }
`;

type Children = {
  animation?: boolean;
};
const SChildren = styled.div<Children>`
  width: 100%;
  margin-top: 10px;
  opacity: ${({ animation }) => (animation ? 1 : 0)};

  animation-duration: ${SECONDS}s;
  animation-name: ${({ animation }) => (animation ? "children" : "")};

  @keyframes children {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;
type Badge = {
  color: string;
};
const SBadge = styled.div<Badge>`
  width: 100%;
  margin-top: 24px;

  font-size: 13px;
  line-height: 20px;

  text-align: center;

  color: ${({ color }) => `${color}`};
`;

type AbstractPopUpProps = {
  show: boolean;
  hide?: boolean;
  pause?: SimpleFunction;
  goBack?: SimpleFunction;
  onClose?: SimpleFunction;
  themeObject: ThemeConfig["theme"];
  cardHeader: {
    text: string | JSX.Element;
    fontSize?: number | string;
    textAlign?: "left" | "right" | "center";
  };
  children?: JSX.Element;
};
const AbstractPopUp = ({
  show: outerShow,
  hide,
  pause,
  goBack,
  onClose,
  themeObject,
  cardHeader,
  children,
}: AbstractPopUpProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (outerShow) {
      setShow(outerShow);
    }

    const setShowWrapper = () => {
      setShow(outerShow);
    };

    const id = outerShow
      ? undefined
      : setTimeout(setShowWrapper, SECONDS * 1000);

    return () => {
      clearTimeout(id);
    };
  }, [outerShow]);

  useEffect(() => {
    const onCloseWrapper = () => {
      onClose?.();
    };

    const id = show ? undefined : setTimeout(onCloseWrapper, SECONDS * 1000);

    return () => {
      clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  useEffect(() => {
    if (hide) {
      setShow(false);
    }
  }, [hide]);

  const [key, setKey] = useState(cardHeader.text);

  useEffect(() => {
    const fn = () => {
      setKey(cardHeader.text || "");
    };

    const id = setTimeout(fn, 1);

    return () => {
      clearTimeout(id);
    };
  }, [cardHeader.text]);

  return (
    <SBackdrop
      show={outerShow}
      visible={outerShow}
      backdrop={themeObject.common?.backdrop}
      popup={themeObject.popup}
    >
      <SModalContainer show={show} visible={outerShow}>
        <SHitbox
          onClick={
            goBack ||
            (() => {
              if (onClose) {
                setShow(false);
              }
            })
          }
        />
        <SModalCardWrapper
          show={show}
          visible={outerShow}
          border={themeObject.popup.border}
        >
          <SModalCard popup={themeObject.popup}>
            <SCardHeader
              fontSize={cardHeader.fontSize}
              fontWeight={themeObject.popup.title?.fontWeight}
            >
              <STextAlign textAlign={cardHeader.textAlign}>
                {cardHeader.text}
              </STextAlign>
              {!!onClose && (
                <CloseCross
                  color={themeObject.popup.closeCross.color}
                  hoverColor={themeObject.popup.closeCross.hoverColor}
                  onClick={() => setShow(false)}
                />
              )}
            </SCardHeader>
            <SChildren animation={key === cardHeader.text}>
              <SScrollSection
                color={themeObject.popup.scroll.color}
                isDesktop={isDesktop}
              >
                {children}
              </SScrollSection>
              <SBadge color={themeObject.popup.badgeColor}>
                powered by{" "}
                <a
                  href="https://web3.space/venom-connect"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <b>web3.space</b>
                </a>
              </SBadge>
            </SChildren>
          </SModalCard>
        </SModalCardWrapper>
      </SModalContainer>
    </SBackdrop>
  );
};

export default AbstractPopUp;
