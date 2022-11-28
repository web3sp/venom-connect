/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { checkIsCurrentBrowser } from "../helpers/utils";
import AppStore from "../images/AppStore.svg";
import DownloadApk from "../images/DownloadApk.svg";
import GooglePlay from "../images/GooglePlay.svg";
import {
  ProviderOptionsListWithOnClick,
  SimpleFunction,
  ThemeConfig,
} from "../types";
import { VENOM_CONNECT_MODAL_ID } from "../VenomConnect";
import AbstractPopUp, { SECONDS } from "./AbstractPopUp";
import { CardManager } from "./CardManager";
import { QrCard } from "./InnerCard";
import { WrongNetworkPopup } from "./WrongNetworkPopup";

const DoneButton = styled.div`
  background: #11a97d;
  width: 100%;
  max-width: 320px;
  height: 56px;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 20px;
`;

declare global {
  // tslint:disable-next-line
  interface Window {
    // ever wallet
    __hasEverscaleProvider?: boolean;
    __ever?: any;

    // venom wallet
    __hasVenomProvider?: boolean;
    __venom?: any;

    // oxychat wallet
    __oxy?: any;

    // lib
    updateVenomModal: any;
    venomNetworkIntervalId?: number;
  }
}

enum Slide {
  walletsList,
  currentWallet,
  innerCard,
  waitingInstallation,
}

type Case = {
  element: JSX.Element;
  title: string | JSX.Element;
  type: Slide;
};

const SProviders = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
`;

type ModalProps = {
  error?: string;
  networkName: string;
  themeConfig: ThemeConfig;
  options: ProviderOptionsListWithOnClick;
  onClose: SimpleFunction;
  changeWallet: SimpleFunction;
  disconnect?: SimpleFunction;
  clearError?: () => void;
};

export type ModalState = {
  show: boolean;
  themeConfig?: ThemeConfig;
  wrongNetwork?: boolean;
  isFullProvider?: boolean;
  isExtensionWindowOpen?: boolean;
  popUpText: {
    title: string;
    text?: string;
  };
};

const INITIAL_STATE: ModalState = {
  show: false,
  wrongNetwork: false,
  isFullProvider: false,
  popUpText: {
    title: "Waiting for an action in the extension window",
    // text: '',
  },
};

export const Modal = ({
  error,
  clearError,
  networkName,
  themeConfig: initThemeConfig,
  options,
  onClose,
  changeWallet,
  disconnect,
}: ModalProps) => {
  window.updateVenomModal = async (state: Partial<ModalState>) => {
    if (state.show !== undefined) {
      setShow(state.show);
    }
    if (state.themeConfig !== undefined) {
      setThemeConfig(state.themeConfig);
    }
    if (state.isFullProvider !== undefined) {
      setIsFullProvider(state.isFullProvider);
    }
    setWrongNetwork(state.wrongNetwork);

    if (state.isExtensionWindowOpen !== undefined) {
      setIsExtensionWindowOpen(state.isExtensionWindowOpen);

      if (state.isExtensionWindowOpen) {
        setExtensionPause(true);
      } else {
        setTimeout(() => {
          setExtensionPause(false);
        }, SECONDS * 1000);
      }

      setPopUpText(state.popUpText || INITIAL_STATE.popUpText);
    }
  };

  const getWalletWaysToConnect = (_walletId: string | undefined) => {
    let ret: ProviderOptionsListWithOnClick[0]["walletWaysToConnect"] = [];
    options.forEach((o) => {
      ret = [...ret, ...o.walletWaysToConnect];
    });
    return ret;
  };

  // const getInitialSlide = () =>
  //   options.length > 1 ? Slide.walletsList : Slide.currentWallet;
  const getInitialSlide = () => Slide.currentWallet;

  // выбираем начальный кошелёк
  const getInitialWalletOption = () =>
    getInitialSlide() === Slide.currentWallet ? options[0] : undefined;

  // const getInitialWalletWaysToConnect = () =>
  //   getInitialWalletOption()?.walletWaysToConnect;

  // выбираем способы подключения
  const getInitialWalletWaysToConnect = () => getWalletWaysToConnect(undefined);

  const getInitialWalletWayToConnect = () => {
    const { id, walletWaysToConnect: _walletWaysToConnect } =
      getInitialWalletOption() || {};
    return (
      (id !== undefined &&
        id === walletId &&
        _walletWaysToConnect &&
        !(_walletWaysToConnect.length > 1) &&
        _walletWaysToConnect[0]) ||
      undefined
    );
  };

  const [slide, setSlide] = useState(getInitialSlide);
  // не актуален
  const [walletId, setWalletId] = useState<string | undefined>();
  const [walletWaysToConnect, setWalletWaysToConnect] = useState<
    ProviderOptionsListWithOnClick[0]["walletWaysToConnect"] | undefined
  >();
  const [walletWayToConnect, setWalletWayToConnect] = useState<
    ProviderOptionsListWithOnClick[0]["walletWaysToConnect"][0] | undefined
  >();

  const [themeConfig, setThemeConfig] = useState(initThemeConfig);
  const [show, setShow] = useState(INITIAL_STATE.show);
  const [wrongNetwork, setWrongNetwork] = useState<boolean | undefined>(
    INITIAL_STATE.wrongNetwork
  );
  const [isFullProvider, setIsFullProvider] = useState<boolean | undefined>(
    INITIAL_STATE.isFullProvider
  );
  const [isExtensionWindowOpen, setIsExtensionWindowOpen] = useState<
    boolean | undefined
  >();
  const [popUpText, setPopUpText] = useState(INITIAL_STATE.popUpText);

  useEffect(() => {
    setSlide(getInitialSlide || Slide.walletsList);
    setWalletId(getInitialWalletOption()?.id);
    setWalletWaysToConnect(getInitialWalletWaysToConnect);
    setWalletWayToConnect(getInitialWalletWayToConnect);
  }, [show]);

  const onCurrentWalletSelectorClick = (id: string) => {
    setWalletId(id);
    setWalletWaysToConnect(getWalletWaysToConnect(id));
    setSlide(Slide.currentWallet);
  };

  const onCloseCrossClick = () => {
    if (!getInitialWalletOption()) setWalletId(undefined);
    if (!getInitialWalletWayToConnect()) setWalletWaysToConnect(undefined);
    clearError?.();

    setSlide(getInitialSlide);
    onClose();
  };

  const goBack = () => {
    switch (slide) {
      case Slide.innerCard:
        setSlide(Slide.currentWallet);
        if (!getInitialWalletWayToConnect())
          setWalletWaysToConnect(getWalletWaysToConnect(walletId));
        break;

      case Slide.currentWallet:
        if (!getInitialWalletOption()) {
          setWalletId(undefined);
          setSlide(Slide.walletsList);
        }
        break;

      case Slide.walletsList:
      default:
        break;
    }
  };

  const onWalletCardItemClick = (id: string) => {
    onCurrentWalletSelectorClick(id);
  };

  // выбран способ коннекта
  const onCurrentCardItemClick = (name: string, id: string, cb: () => void) => {
    const _walletWayToConnect = walletWaysToConnect?.find(
      (_walletWayToConnect) =>
        _walletWayToConnect.name === name && _walletWayToConnect.id === id
    );
    setWalletWayToConnect(_walletWayToConnect);
    if (
      slide === Slide.currentWallet &&
      _walletWayToConnect?.type === "mobile"
    ) {
      setSlide(Slide.innerCard);
    } else {
      cb();
      onCloseCrossClick();
    }
  };

  // первый шаг с кошельками
  // сейчас не используется
  const walletCardList: Case = useMemo(() => {
    return {
      type: Slide.walletsList,
      element: (
        <SProviders>
          {options.map(({ id /* wallet */ }, i) => (
            <CardManager
              key={id}
              name={"wallet.name"} // fix
              logo={"wallet.logo"} // fix
              description={"wallet.description"} // fix
              themeObject={themeConfig.theme}
              themeName={themeConfig.name}
              onClick={() => onWalletCardItemClick(id)}
              isFirst={!i} // todo
            />
          ))}
        </SProviders>
      ),
      title: (
        <>
          Choose the wallet to
          <br />
          connect:
        </>
      ),
    };
  }, [options, themeConfig.theme]);

  // это уже конкретные варианты 2го уровня
  const currentWalletCards: Case = useMemo(() => {
    // const walletName = options.find(({id}) => id === walletId)?.wallet.name;

    return {
      type: Slide.currentWallet,
      element: (
        // список на главной
        <SProviders>
          {walletWaysToConnect?.map(
            ({ id, name, logo, logoWhite, onClick, type, options: x }, i) => {
              return (
                <CardManager
                  key={id}
                  name={name}
                  logo={logo}
                  logoWhite={logoWhite}
                  themeObject={themeConfig.theme}
                  themeName={themeConfig.name}
                  onClick={() => onCurrentCardItemClick(name, id, onClick)}
                  connectorType={type}
                  options={x}
                  // надо только у первого передать что он первый
                  isFirst={!i} // todo
                  isBadBrowser={
                    !options.reduce(
                      (r, wallet) =>
                        r ||
                        !!wallet.walletWaysToConnect
                          .filter((way) => way.type === "extension")
                          .reduce(
                            (rInner, way) =>
                              rInner ||
                              checkIsCurrentBrowser(
                                way.options.isCurrentBrowser
                              ).isCurrentBrowser,
                            false
                          ),
                      false
                    )
                  }
                  allBrowsersNames={options
                    .map((wallet) =>
                      wallet.walletWaysToConnect.map((way) =>
                        way.options.isCurrentBrowser?.map(
                          (browser: any) => browser?.browser
                        )
                      )
                    )
                    .flat(100)}
                  browsersNames={x.isCurrentBrowser?.flat?.(100)}
                />
              );
            }
          )}
        </SProviders>
      ),
      title: <>Choose the way to connect:</>,
      // title: <>Choose the way to connect {walletName}:</>,
    };
  }, [options, themeConfig.theme, walletId, walletWaysToConnect]);

  const mobileAppsPopUp: Case = useMemo(() => {
    if (!walletWayToConnect)
      return {
        type: Slide.innerCard,
        element: <>No way to connect</>,
        title: "Error",
      };

    // ссылки на магазины скачивания
    return {
      type: Slide.innerCard,
      element: (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: "32px",
              width: "286px",
              justifyContent: "space-between",
              marginRight: "auto",
              marginLeft: "auto",
              rowGap: "16px",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div>
                {walletWayToConnect.options.qr ? (
                  <>
                    <QrCard
                      qr={walletWayToConnect.options.qr}
                      themeConfig={themeConfig}
                    />
                  </>
                ) : null}
              </div>
            </div>
            {/*<QrCard {...walletWayToConnect.options} themeConfig={themeConfig} />*/}
            {walletWayToConnect.options.devises?.map((device: any) => {
              if (device.type === "ios") {
                return (
                  <a
                    href={device.deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={AppStore} alt="" />
                  </a>
                );
              }
              if (device.type === "android") {
                return (
                  <a
                    href={device.deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={GooglePlay} alt="" />
                  </a>
                );
              }
              if (device.type === "apk") {
                return (
                  <a
                    href={device.deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={DownloadApk} alt="" />
                  </a>
                );
              }

              return null;
            })}
          </div>
          <div
            style={{
              margin: "24px 0px 2px",
              cursor: "pointer",
              color: "#11A97D",
            }}
            onClick={goBack}
          >
            Back
          </div>
        </>
      ),
      title: (
        <>
          Please connect with
          <br />
          {walletWayToConnect.name}
        </>
      ),
    };
  }, [options, themeConfig.theme, walletId, walletWayToConnect]);

  const innerCard = mobileAppsPopUp;

  const waitingInstallation: Case = useMemo(() => {
    return {
      type: Slide.waitingInstallation,
      element: (
        <>
          <div style={{ marginTop: 20 }}>
            We are currently waiting for the installation and configuration of
            the{" "}
            {error?.includes("Venom")
              ? "Venom"
              : error?.includes("Ever")
              ? "Ever"
              : ""}{" "}
            Wallet extension
          </div>
          <DoneButton onClick={() => window.location.reload()}>Done</DoneButton>
        </>
      ),
      title: <>Waiting for the installation </>,
    };
  }, [options, themeConfig.theme]);

  const cards = [walletCardList, currentWalletCards, innerCard];

  const getCard: () => Case | undefined = () =>
    cards.find((card) => card.type === slide);

  const card = getCard();

  const [networkPause, setNetworkPause] = useState(false);
  const [extensionPause, setExtensionPause] = useState(false);

  useEffect(() => {
    const condition = !!wrongNetwork && !show && !!isFullProvider;

    if (condition) {
      setNetworkPause(true);
    } else {
      setTimeout(() => {
        setNetworkPause(false);
      }, SECONDS * 1000);
    }
  }, [wrongNetwork, show, isFullProvider]);

  // removed error handling window, only if not found
  useEffect(() => {
    if (!!error && !error.includes("wallet is not found")) {
      onCloseCrossClick();
    }
  }, [error]);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>
        {`
          #${VENOM_CONNECT_MODAL_ID} a {
            text-decoration: none !important;
            color: inherit !important;
          }
        `}
      </style>
      {error ? (
        error.includes("wallet is not found") ? (
          <AbstractPopUp
            show={!!error}
            hide={!error}
            themeObject={themeConfig.theme}
            cardHeader={{
              text: waitingInstallation.title,
            }}
          >
            {waitingInstallation?.element}
          </AbstractPopUp>
        ) : (
          <></>
          // <AbstractPopUp
          //   show={!!error}
          //   hide={!error}
          //   themeObject={themeConfig.theme}
          //   onClose={onCloseCrossClick}
          //   cardHeader={{
          //     text: "Error",
          //   }}
          // >
          //   <>
          //     <div style={{ marginTop: 20 }}>{error}</div>
          //     <DoneButton onClick={onCloseCrossClick}>Close</DoneButton>
          //   </>
          // </AbstractPopUp>
        )
      ) : (
        <>
          <AbstractPopUp
            show={show}
            onClose={onCloseCrossClick}
            themeObject={themeConfig.theme}
            cardHeader={{
              text: card?.title || "your wallet",
              // fontSize: card?.type === Slide.currentWallet ? 20 : undefined,
              textAlign: "left",
            }}
            goBack={slide !== getInitialSlide() ? goBack : undefined}
          >
            {card?.element}
          </AbstractPopUp>
          <AbstractPopUp
            show={(!!wrongNetwork && !show && !!isFullProvider) || networkPause}
            hide={!(!!wrongNetwork && !show && !!isFullProvider)}
            themeObject={themeConfig.theme}
            cardHeader={{
              text: "Active network is wrong",
            }}
          >
            <WrongNetworkPopup
              textColor={themeConfig.theme.common.text.color}
              changeWallet={changeWallet}
              disconnect={disconnect}
              networkName={networkName}
            />
          </AbstractPopUp>
          <AbstractPopUp
            show={!!isExtensionWindowOpen || extensionPause}
            hide={!isExtensionWindowOpen}
            themeObject={themeConfig.theme}
            cardHeader={{
              text: popUpText.title,
            }}
          >
            <>{popUpText.text}</>
          </AbstractPopUp>
        </>
      )}
    </>
  );
};
