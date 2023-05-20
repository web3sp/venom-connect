import { isIOS, isMobile } from "react-device-detect";
import { createRoot, Root } from "react-dom/client";
import { Modal } from "./components";
import { getPromiseRaw, ProviderController } from "./controllers";
import { EventController } from "./controllers/EventController";
import {
  ToggleExtensionWindow,
  toggleExtensionWindow,
} from "./helpers/backdrop";
import {
  CLOSE_EVENT,
  CONNECT_EVENT,
  ERROR_EVENT,
  Events,
  EXTENSION_AUTH_EVENT,
  EXTENSION_WINDOW_CLOSED_EVENT,
  SELECT_EVENT,
} from "./helpers/events";
import * as allProviders from "./providers";
import { getThemeConfig, ThemeNameList, themesList } from "./themes";
import {
  ProviderOptionsListWithOnClick,
  SimpleFunction,
  ThemeConfig,
  UserProvidersOptions,
  VenomConnectOptions,
} from "./types";

export const libName = "VenomConnect";

export const VENOM_CONNECT_MODAL_ID = "VENOM_CONNECT_MODAL_ID";

let oldRoot: Root | undefined = undefined;

const _getDefaultVenomNetworkNameById = (networkId: number) => {
  switch (networkId) {
    case 0:
      return "Venom Local Node";
    case 1000:
      return "Venom Testnet";
    case 1:
    default:
      return "Venom Mainnet";

  }
};

const getDefaultVenomNetworkNameById = (networkId: number | number[]) => {
  if (Array.isArray(networkId)) {
    const names = networkId.map((id) => {
      return _getDefaultVenomNetworkNameById(id);
    });

    return Array.from(new Set(names))?.[0];
  }

  return _getDefaultVenomNetworkNameById(networkId);
};

const defaultOptions: VenomConnectOptions = {
  theme: themesList.default.name,
  providersOptions: {},
  checkNetworkId: 1,
  checkNetworkName: "Venom Mainnet",
};
class VenomConnect {
  private show: boolean = false;

  private checkNetworkId: number | number[];
  private checkNetworkName: string;
  private error: string | undefined = undefined;

  private themeConfig: ThemeConfig;
  private options: ProviderOptionsListWithOnClick;
  private providerController: ProviderController;
  private eventController: EventController = new EventController();
  // private pagePosition: number | null = null;

  constructor(options: {
    theme?: VenomConnectOptions["theme"];
    providersOptions: VenomConnectOptions["providersOptions"];
    checkNetworkId?: number | number[];
    checkNetworkName?: string;
  }) {
    const theme = options.theme || defaultOptions.theme;
    this.themeConfig = getThemeConfig(theme);

    const checkNetworkId =
      options.checkNetworkId === undefined ? defaultOptions.checkNetworkId : options.checkNetworkId;
    this.checkNetworkId = checkNetworkId;

    const checkNetworkName =
      options.checkNetworkName ||
      getDefaultVenomNetworkNameById(checkNetworkId);
    this.checkNetworkName = checkNetworkName;

    this.providerController = new ProviderController({
      providersOptions: Object.fromEntries(
        Object.entries(options.providersOptions)?.map(([key, value]) => {
          const defaultAnyProviderOptions:
            | VenomConnectOptions["providersOptions"][0]
            | undefined = defaultOptions.providersOptions?.[key];

          const defaultCurrentProviderOptions:
            | VenomConnectOptions["providersOptions"][0]
            // @ts-ignore
            | undefined = allProviders.providers?.[key];

          const defaultProviderOptions: any = {
            ...(defaultAnyProviderOptions || {}),
            ...(defaultCurrentProviderOptions || {}),
          };

          const providerOptions: UserProvidersOptions["x"] = {
            // wallet: {
            //   ...{
            //     name: "your wallet",
            //   },
            //   ...defaultProviderOptions?.wallet,
            //   ...value.wallet,
            //   logo: !!value.wallet?.logo
            //     ? value.wallet.logo
            //     : defaultProviderOptions?.wallet?.logo || undefined,
            // } as WalletDisplay,
            links: value.links,
            walletWaysToConnect: value.walletWaysToConnect?.length
              ? value.walletWaysToConnect ||
                defaultProviderOptions?.walletWaysToConnect ||
                []
              : defaultProviderOptions?.walletWaysToConnect,
            defaultWalletWaysToConnect: value.defaultWalletWaysToConnect || [],
          };

          return [
            key,
            {
              ...defaultProviderOptions,
              ...providerOptions,
            },
          ];
        })
      ),
      checkNetworkId,
      checkNetworkName,
    });

    this.providerController.on(CONNECT_EVENT, (provider) =>
      this.onConnect(provider)
    );
    this.providerController.on(ERROR_EVENT, (error) => this.onError(error));
    this.providerController.on(SELECT_EVENT, this.onProviderSelect);

    this.providerController.on(EXTENSION_AUTH_EVENT, (_provider) =>
      this.eventController.trigger(EXTENSION_AUTH_EVENT, _provider)
    );
    this.providerController.on(EXTENSION_WINDOW_CLOSED_EVENT, () =>
      this.eventController.trigger(EXTENSION_WINDOW_CLOSED_EVENT)
    );

    this.options = this.providerController.getOptions();

    this.renderModal();
  }

  // --------------- PUBLIC METHODS --------------- //

  private async toggleModal(): Promise<void> {
    await this._toggleModal();
  }

  /**
   * Toggle the backdrop when performing an action in the extension window
   *
   * static method (via window)
   */
  public static async toggleExtensionWindow(
    params: ToggleExtensionWindow
  ): Promise<void> {
    await toggleExtensionWindow(params);
  }

  // работа с логином
  // покажем попап со способами подключения (для мобил - сразу выбор аккаунта)
  // как использовать в случае если уже залогинен - непонятно

  /**
   * This function causes the pop-up to be displayed with the available connection methods: through the extension, links to mobile applications.
   *
   * @return Promise of ProviderRpcClient or error/string
   */
  public connect = (): Promise<any> =>
    new Promise(async (resolve, reject) => {
      this.updateState({
        wrongNetwork: undefined,
      });

      this.on(CONNECT_EVENT, (provider) => resolve(provider));
      this.on(ERROR_EVENT, (error) => reject(error));
      this.on(CLOSE_EVENT, () => reject("Pop-up closed"));

      const connectorIdList = Object.keys(allProviders.connectors);
      const authList = await this.checkAuth(connectorIdList);

      if (!authList || !authList.length) {
        // проверяем что мобильный venom
        if (this.checkIsWalletBrowser().isVenomWalletBrowser) {
          await this.connectTo("venomwallet", "extension");

          // проверяем что мобильный ever
        } else if (this.checkIsWalletBrowser().isEverWalletBrowser) {
          await this.connectTo("everwallet", "extension");

          // показываем обычный попап
        } else {
          await this._toggleModal();
        }
      }
    });

  /**
   * This function allows you to get a specific provider **bypassing the selection pop-up** `connect(walletId, connectorTypeId)`.
   *
   * @return Promise of ProviderRpcClient or error/string
   */
  public connectTo = (id: string, connectorId: string): Promise<any> =>
    new Promise(async (resolve, reject) => {
      this.on(CONNECT_EVENT, (provider) => resolve(provider));
      this.on(ERROR_EVENT, (error) => reject(error));
      this.on(CLOSE_EVENT, () => reject("Pop-up closed"));
      const provider = this.providerController.getProvider(id);
      if (!provider) {
        return reject(
          new Error(
            `Cannot connect to provider (${id}), check provider options`
          )
        );
      }
      const walletWayToConnect =
        provider.walletWaysToConnect.find(
          (walletWayToConnect) => walletWayToConnect.id === connectorId
        ) || provider.walletWaysToConnect[0];

      await this.providerController.connectTo(
        provider.id,
        walletWayToConnect.id,
        walletWayToConnect.connector
      );
    });

  /**
   * return
   *
   * {
   *
   *  show (boolean) for pop-up
   *
   *  themeConfig {...}
   *
   * }
   */
  public getInfo = () => {
    const show = this.show;
    const themeConfig = this.themeConfig;
    // const options = this.options;

    return {
      show,
      themeConfig,
      // options,
    };
  };

  /**
   * You can use this function to interactively switch themes in runtime.
   */
  public async updateTheme(
    theme: ThemeNameList | ThemeConfig["theme"]
  ): Promise<void> {
    const themeConfig = getThemeConfig(theme);
    await this.updateState({ themeConfig });
  }

  /**
   * **Subscribing** to internal library events. `on(event, callback)`
   *
   * Returns the corresponding `off` function with no accepted parameters.
   */
  public on(event: Events, callback: SimpleFunction): SimpleFunction {
    this.eventController.on({
      event,
      callback,
    });

    return () =>
      this.eventController.off({
        event,
        callback,
      });
  }

  /**
   * **Unsubscribe** from internal library events. `on(event, callback)`
   */
  public off(event: Events, callback?: SimpleFunction): void {
    this.eventController.off({
      event,
      callback,
    });
  }

  /**
   * This function checks authorization in the available connection methods (extensions) and **returns** the corresponding **instance** of the wallet provider.
   *
   * @return Promise of auth ProviderRpcClient or false/undefined
   */
  public checkAuth = async (
    providerIdList: string[] | undefined = Object.keys(allProviders.providers)
  ) => {
    let fallback = undefined;
    const providers = providerIdList?.map(async (id) => {
      const provider = this.providerController.getProvider(id);

      const promises = provider?.walletWaysToConnect
        .filter(({ type }) => type === "extension")
        .map(async ({ authConnector, id: connectorId, type }) => {
          const provider =
            authConnector &&
            (await this.providerController.getAuthTo(
              id,
              connectorId,
              authConnector
            ));

          if (!provider?.auth) {
            if (id === "venomwallet") {
              fallback = provider?.fallback;
            }
            return null;
          }

          return {
            connectorId,
            connectorType: type,
            provider: provider?.auth,
          };
        })
        .filter((promise) => !!promise);

      const providerList = promises && (await Promise.all(promises));

      return {
        id,
        walletWaysToConnect: providerList?.filter((item) => !!item?.provider),
      };
    });

    const authList = await Promise.all(providers);

    const filteredAuthList = authList?.filter(
      ({ walletWaysToConnect }) => !!walletWaysToConnect?.length
    );

    const auth = filteredAuthList?.length ? filteredAuthList : false;

    const authProvider =
      (auth && auth?.[0]?.walletWaysToConnect?.[0]?.provider) || fallback;

    this.eventController.trigger(CONNECT_EVENT, authProvider);

    return authProvider;
  };

  /**
   * The function of getting a standalone provider by its ID. `getStandalone("venomwallet")` or `getStandalone()` By default, the ID is **venomwallet**.
   */
  public getStandalone(walletId: string = "venomwallet") {
    return this.providerController.getStandalone(walletId);
  }

  /**
   * Returns the current provider (ProviderRpcClient) or _null_.
   */
  public get currentProvider() {
    return this.providerController.currentProvider;
  }

  /**
   * The function of getting an object with promises, each of which waits for the initialization of the corresponding provider (_for example: `__venom`_) on the `window` object and is resolved by them or after several attempts is rejected.
   *
   *  You can get the promise you need by wallet ID and connection type `getPromise("venomwallet", "extension")` or you can use the default connection type ("extension") `getPromise("venomwallet")`.
   */
  public static getPromise = (
    walletId: string,
    type: string | undefined = "extension"
  ) => getPromiseRaw(window, walletId, type);

  // --------------- PRIVATE METHODS --------------- //

  private checkIsWalletBrowser = () => {
    const ids = this.options.map(({ id }) => id);
    const isVenomWalletBrowser = !!(
      navigator &&
      navigator.userAgent.includes("VenomWalletBrowser") &&
      ids.includes("venomwallet")
    );
    const isEverWalletBrowser = !!(
      navigator &&
      navigator.userAgent.includes("EverWalletBrowser") &&
      ids.includes("everwallet")
    );
    return {
      isVenomWalletBrowser,
      isEverWalletBrowser,
      isOneOfWalletBrowsers: isVenomWalletBrowser || isEverWalletBrowser,
    };
  };

  private async disconnect() {
    try {
      await this.currentProvider?._api?.disconnect?.();
    } catch (error) {}
  }

  private renderModal() {
    const oldContainer = document.getElementById(VENOM_CONNECT_MODAL_ID);

    if (!oldContainer) {
      const el = document.createElement("div");
      el.id = VENOM_CONNECT_MODAL_ID;
      document.body.appendChild(el);
    }

    const container =
      oldContainer || document.getElementById(VENOM_CONNECT_MODAL_ID);

    const root = oldRoot || (oldRoot = createRoot(container!));

    let optionsIds: (string | null)[] = Array.from(
      new Set(this.options.map(({ id }) => id))
    );

    const filteredOptions = this.options.filter(({ id }) => {
      const index = optionsIds.findIndex((optionsId) => optionsId === id);
      if (~index) {
        optionsIds[index] = null;
        return true;
      } else {
        return false;
      }
    });

    const supportedOptions = filteredOptions.filter(
      ({ walletWaysToConnect }) => {
        const booleanArray = walletWaysToConnect.reduce((r, { type }) => {
          let result: boolean;
          if (isMobile) {
            if (isIOS) {
              result = type === "ios";
            } else {
              result = type === "android";
            }
          } else {
            result = type !== "ios" && type !== "android";
          }

          r.push(result);

          return r;
        }, [] as boolean[]);

        return booleanArray.includes(true);
      }
    );

    const injectedLinkOptions = supportedOptions.map((supportedOption) => {
      return {
        ...supportedOption,
        walletWaysToConnect: supportedOption.walletWaysToConnect.map(
          (walletWayToConnect) => {
            const installExtensionLinkRaw =
              walletWayToConnect.options?.["installExtensionLink"];
            const deepLinkRaw = walletWayToConnect.options?.["deepLink"];
            const qrRaw = walletWayToConnect.options?.["qr"];
            const devisesRaw = walletWayToConnect.options?.["devises"];

            const links = supportedOption.links;

            return {
              ...walletWayToConnect,
              options: {
                ...walletWayToConnect.options,
                installExtensionLink:
                  typeof installExtensionLinkRaw === "function"
                    ? installExtensionLinkRaw(links)
                    : installExtensionLinkRaw,
                deepLink:
                  typeof deepLinkRaw === "function"
                    ? deepLinkRaw(links)
                    : deepLinkRaw,
                qr: typeof qrRaw === "function" ? qrRaw(links) : qrRaw,
                devises: devisesRaw?.map?.((devise: any) => {
                  const deviseDeepLinkRaw = devise?.["deepLink"];
                  return {
                    ...devise,
                    deepLink:
                      typeof deviseDeepLinkRaw === "function"
                        ? deviseDeepLinkRaw(links)
                        : deviseDeepLinkRaw,
                  };
                }),
              },
            };
          }
        ),
      };
    });

    root.render(
      <Modal
        clearError={() => {
          this.error = undefined;
          this.renderModal();
        }}
        error={this.error}
        networkName={this.checkNetworkName}
        themeConfig={this.themeConfig}
        options={injectedLinkOptions}
        onClose={this.onClose}
        changeWallet={async () => {
          await this.disconnect();
          this.connect();
        }}
        disconnect={
          this.checkIsWalletBrowser().isOneOfWalletBrowsers
            ? () => this.disconnect()
            : undefined
        }
      />
    );
  }
  private onError = async (error: any) => {
    this.error = error;
    this.renderModal();
    if (!this.show) {
      await this._toggleModal();
    }
    // this.eventController.trigger(ERROR_EVENT, error);
  };

  private onProviderSelect = (providerId: string) => {
    this.eventController.trigger(SELECT_EVENT, providerId);
  };

  private onConnect = async (provider: any) => {
    if (this.show) {
      await this._toggleModal();
    }
    this.eventController.trigger(CONNECT_EVENT, provider);
  };

  private onClose = async () => {
    if (this.show) {
      await this._toggleModal();
    }
    this.eventController.trigger(CLOSE_EVENT);
  };

  private _toggleModal = async () => {
    // const body = document.body;
    // if (body) {
    //   if (this.show) {
    //     body.style.overflow = "initial";

    //     window.scrollTo(0, this.pagePosition || 0);
    //     this.pagePosition = null;
    //   } else {
    //     this.pagePosition = window.scrollY || 0;

    //     body.style.overflow = "hidden";
    //   }
    // }
    await this.updateState({ show: !this.show });
  };

  private updateState = async (state: any) => {
    Object.keys(state).forEach((key) => {
      // @ts-ignore
      this[key] = state[key];
    });
    await window.updateVenomModal(state);
  };
}

export { VenomConnect };
