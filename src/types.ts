import { ThemeNameList } from "./themes";

type BackdropTheme = {
  color: string;
  opacity?: number | string;
  backdropFilter?: string;
  offset?: number | string;
};

type CommonTheme = {
  text: {
    color: string;
  };
  backdrop: BackdropTheme;
};

type PopupTheme = {
  maxWidth?: number;
  background: {
    color: string;
    backdropFilter?: string;
  };
  border: {
    width: number;
    color: string;
    borderRadius: number;
  };
  text: {
    color: string;
  };
  closeCross: {
    color: string;
    hoverColor?: string;
    // pressed?: string;
  };
  title?: {
    fontWeight?: string | number;
  };
};

type ItemTheme = {
  background: {
    color: string;
  };
  border: {
    width: number;
    borderWidth: number;
    borderHoverColor?: string;
    color: string;
    hoverColor?: string;
    pressedColor?: string;
  };
  text: {
    color: string;
  };
  warning: {
    background: {
      color: string;
    };
    text: {
      color: string;
    };
  };
  icon: {
    main: {
      color: string;
    };
    subTitle: {
      color: string;
    };
  };
};

export type Theme = {
  common: CommonTheme;
  popup: PopupTheme;
  item: ItemTheme;
  customItems?: {
    [item: string]: ItemTheme;
  };
};

export type ThemeConfig = {
  name: string;
  theme: Theme;
};

export type ThemesList = {
  [name: string]: ThemeConfig;
};

// ==================================================

export type SimpleFunction = (input?: any) => void;

type Links = {
  extension: string | null;
  ios: string | null;
  android: string | null;
  qr: string | null;
};

type ProviderDisplay = {
  name: string;
  logo: string | JSX.Element;
};
export type WalletDisplay = ProviderDisplay & {
  description?: string;
};
export type ConnectorType = "extension" | "qr" | "mobile" | "ios" | "android"; // "hardware"
export type WayToConnect = {
  id: string;
  type: ConnectorType;
  options?: any;
};
type Connector = (provider?: any, options?: any) => Promise<any>;

export type ProviderOptions = {
  id: string;
  wallet: WalletDisplay;
  walletWaysToConnect: (ProviderDisplay & WayToConnect)[];
};
export type ProviderOptionsWithConnector = {
  id: string;
  wallet: WalletDisplay;
  links: Links;
  walletWaysToConnect: (ProviderDisplay &
    WayToConnect & {
      connector: Connector;
      authConnector?: Connector;
      package: any;
      packageOptions?: {
        [id: string]: any;
      };
    })[];
};
export type ProviderOptionsList = (ProviderOptionsWithConnector & {
  id: string;
})[];

type ProviderOptionsWithOnClick = {
  id: string;
  wallet: WalletDisplay;
  links: Links;
  walletWaysToConnect: (ProviderDisplay &
    WayToConnect & {
      onClick: () => Promise<void>;
      package: any;
    })[];
};
export type ProviderOptionsListWithOnClick = (ProviderOptionsWithOnClick & {
  id: string;
})[];

export type ProviderOptionsWithConnectorOptional = {
  id: string;
  wallet: WalletDisplay;
  links: Links;
  walletWaysToConnect: (ProviderDisplay &
    WayToConnect & {
      connector?: Connector;
      authConnector?: Connector;
      package: any;
      packageOptions?: {
        [id: string]: any;
      };
    })[];
  defaultWalletWaysToConnect?: ConnectorType[];
};

type UserProviderOptions = Omit<ProviderOptionsWithConnectorOptional, "id">;
export type UserProvidersOptions = {
  [id: string]: UserProviderOptions;
};

export type EventCallback = {
  event: string;
  callback: (result: any) => void;
};

export type VenomConnectOptions = {
  theme: ThemeNameList | ThemeConfig["theme"];
  providersOptions: UserProvidersOptions;
};

export type ProviderControllerOptions = {
  providersOptions: UserProvidersOptions;
};
