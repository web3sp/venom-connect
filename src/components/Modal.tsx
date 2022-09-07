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
import AbstractPopUp from "./AbstractPopUp";
import { CardManager } from "./CardManager";
import { WrongNetworkPopup } from "./WrongNetworkPopup";

declare global {
  // tslint:disable-next-line
  interface Window {
    updateVenomModal: any;

    __hasEverscaleProvider?: boolean;
    __ever?: any;

    venomNetworkIntervalId?: number;

    __venom?: any;
  }
}

enum Slide {
  walletsList,
  currentWallet,
  innerCard,
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
  align-items: center;
`;

type ModalProps = {
  themeConfig: ThemeConfig;
  options: ProviderOptionsListWithOnClick;
  onClose: SimpleFunction;
  changeWallet: SimpleFunction;
};

type ModalState = {
  show: boolean;
  themeConfig?: ThemeConfig;
  wrongNetwork?: boolean;
  isFullProvider?: boolean;
};

const INITIAL_STATE: ModalState = {
  show: false,
  wrongNetwork: false,
  isFullProvider: false,
};

export const Modal = ({
  onClose,
  changeWallet,
  options,
  themeConfig: initThemeConfig,
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
  };

  const getWalletWaysToConnect = (_walletId: string | undefined) => {
    let ret: ProviderOptionsListWithOnClick[0]["walletWaysToConnect"] = [];
    options.forEach((o) => {
      ret = [...ret, ...o.walletWaysToConnect];
    });
    return ret;
    // return options.find(({ id }) => id === _walletId)?.walletWaysToConnect;
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
  const walletCardList: Case = useMemo(() => {
    return {
      type: Slide.walletsList,
      element: (
        <SProviders>
          {options.map(({ id, wallet }, i) => (
            <CardManager
              key={id}
              name={wallet.name}
              logo={wallet.logo}
              description={wallet.description}
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
            }}
          >
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
                    <img
                      style={{ marginTop: "16px", cursor: "pointer" }}
                      src={DownloadApk}
                      alt=""
                    />
                  </a>
                );
              }

              return null;
            })}
          </div>
          <div
            style={{ marginTop: "16px", cursor: "pointer", color: "#11A97D" }}
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

  const cards = [walletCardList, currentWalletCards, innerCard];

  const getCard: () => Case | undefined = () =>
    cards.find((card) => card.type === slide);

  const card = getCard();

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>
        {`
          a {
            text-decoration: none;
            color: inherit;
          }
        `}
      </style>
      <AbstractPopUp
        show={show}
        onClose={onCloseCrossClick}
        themeObject={themeConfig.theme}
        cardHeader={{
          text: card?.title || "your wallet",
          // fontSize: card?.type === Slide.currentWallet ? 20 : undefined,
        }}
        goBack={slide !== getInitialSlide() ? goBack : undefined}
      >
        {card?.element}
      </AbstractPopUp>
      <AbstractPopUp
        show={!!wrongNetwork && !show && !!isFullProvider}
        themeObject={themeConfig.theme}
        cardHeader={{
          text: "Active network is wrong",
        }}
      >
        <WrongNetworkPopup
          textColor={themeConfig.theme.common.text.color}
          changeWallet={changeWallet}
        />
      </AbstractPopUp>
    </>
  );
};
