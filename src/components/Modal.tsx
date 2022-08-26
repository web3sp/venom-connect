/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  ProviderOptionsListWithOnClick,
  SimpleFunction,
  ThemeConfig,
} from "../types";
import AbstractPopUp from "./AbstractPopUp";
import { CardManager } from "./CardManager";
import { QrCard } from "./InnerCard";
import {WrongNetworkPopup} from "./WrongNetworkPopup";

declare global {
  // tslint:disable-next-line
  interface Window {
    updateVenomModal: any;

    __hasEverscaleProvider?: boolean;
    __ever?: any;

    hasEverscaleProvider?: boolean;
    ton?: any;

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
};

type ModalState = {
  show: boolean;
  themeConfig?: ThemeConfig;
  wrongNetwork?: boolean;
};

const INITIAL_STATE: ModalState = {
  show: false,
  wrongNetwork: false,
};

export const Modal = ({
  onClose,
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
    setWrongNetwork(state.wrongNetwork)
  };

  const getInitialSlide = () =>
    options.length > 1 ? Slide.walletsList : Slide.currentWallet;
  const getInitialWalletOption = () =>
    getInitialSlide() === Slide.currentWallet ? options[0] : undefined;
  const getInitialWalletWaysToConnect = () =>
    getInitialWalletOption()?.walletWaysToConnect;
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

  const getWalletWaysToConnect = (_walletId: string | undefined) =>
    options.find(({ id }) => id === _walletId)?.walletWaysToConnect;


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
  const [wrongNetwork, setWrongNetwork] = useState<boolean | undefined>(INITIAL_STATE.wrongNetwork);

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

  const onCurrentCardItemClick = (id: string, cb: () => void) => {
    const _walletWayToConnect = walletWaysToConnect?.find(
      (_walletWayToConnect) => _walletWayToConnect.id === id
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
    const walletName = options.find(({ id }) => id === walletId)?.wallet.name;

    return {
      type: Slide.currentWallet,
      element: (
        <SProviders>
          {walletWaysToConnect?.map(
            ({ id, name, logo, onClick, type, options: x }, i) => {
              return (
                <CardManager
                  key={id}
                  name={name}
                  logo={logo}
                  themeObject={themeConfig.theme}
                  onClick={() => onCurrentCardItemClick(id, onClick)}
                  connectorType={type}
                  options={x}
                  isFirst={!i} // todo
                />
              );
            }
          )}
        </SProviders>
      ),
      title: <>Choose the way to connect {walletName}:</>,
    };
  }, [options, themeConfig.theme, walletId, walletWaysToConnect]);

  const mobileAppsPopUp: Case = useMemo(() => {
    if (!walletWayToConnect)
      return {
        type: Slide.innerCard,
        element: <>No way to connect</>,
        title: "Error",
      };

    return {
      type: Slide.innerCard,
      element: (
        <QrCard {...walletWayToConnect.options} themeConfig={themeConfig} />
      ),
      title: (
        <>
          Please scan QR-code
          <br />
          below to download
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
        show={!!wrongNetwork && !show}
        onClose={onClose}
        themeObject={themeConfig.theme}
        cardHeader={{
          text: "Please, connect to",
        }}
      >
        <WrongNetworkPopup
          textColor={themeConfig.theme.common.text.color}
        />
      </AbstractPopUp>
    </>
  );
};
