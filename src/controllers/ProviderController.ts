import {
  CONNECT_EVENT,
  ERROR_EVENT,
  Events,
  EXTENSION_AUTH_EVENT,
  EXTENSION_WINDOW_CLOSED_EVENT,
  SELECT_EVENT,
} from "../helpers/events";
import { checkIsCurrentBrowser } from "../helpers/utils";
import * as allProviders from "../providers";
import {
  ConnectorType,
  ExtensionConnector,
  ProviderControllerOptions,
  ProviderOptionsList,
  ProviderOptionsListWithOnClick,
  ProviderOptionsWithConnector,
  ProviderOptionsWithConnectorOptional,
  UserProvidersOptions,
} from "../types";
import { EventController } from "./EventController";

const sortingArr: ConnectorType[] = ["extension", "mobile", "ios", "android"];

export const getPromiseRaw = (
  windowObject: any,
  walletId: string,
  type: string | undefined = "extension"
) => {
  const promises = {
    venomwallet: {
      extension: () => {
        if (windowObject) {
          return new Promise((resolve, reject) => {
            if (windowObject.__venom) {
              resolve(windowObject.__venom);
              return;
            }
            let nTries = 0; // число попыток, иначе он будет бесконечно, может это вынести в конфиг
            let interval = setInterval(() => {
              if (windowObject.__venom) {
                clearInterval(interval);
                resolve(windowObject.__venom);
              } else if (nTries > 0) {
                nTries--;
              } else {
                clearInterval(interval);
                reject("Venom wallet is not found");
              }
            }, 100);
          });
        }
        return Promise.reject();
      },
    },
    everwallet: {
      extension: () => {
        if (windowObject) {
          return new Promise((resolve, reject) => {
            if (windowObject.__ever) {
              resolve(windowObject.__ever);
              return;
            }
            let nTries = 0; // число попыток, иначе он будет бесконечно, может это вынести в конфиг
            let interval = setInterval(() => {
              if (windowObject.__ever) {
                clearInterval(interval);
                resolve(windowObject.__ever);
              } else if (nTries > 0) {
                nTries--;
              } else {
                clearInterval(interval);
                reject("Ever wallet is not found");
              }
            }, 100);
          });
        }
        return Promise.reject();
      },
    },
  };

  // @ts-ignore
  return promises[walletId]?.[type];
};

export class ProviderController {
  private eventController: EventController = new EventController();
  private providers: ProviderOptionsList = [];
  private providerOptions: UserProvidersOptions;

  private checkNetworkId: number | number[];
  private checkNetworkName: string;

  private _currentProvider: any;

  public getStandalone = async (walletId: string) => {
    const wallet = this.providers?.find((provider) => provider.id === walletId);

    if (wallet) {
      const standaloneFromUser = wallet?.walletWaysToConnect.find(
        (way) => way.type === "extension" && !!way.standalone
      );
      if (standaloneFromUser?.standalone) {
        return standaloneFromUser.standalone(
          standaloneFromUser.package,
          standaloneFromUser.packageOptionsStandalone
        );
      }
    }

    return null;
  };

  public set currentProvider(cp) {
    const updateVenomModal = () =>
      window.updateVenomModal({
        isFullProvider: !!cp,
      });

    (function tryUpdateVenomModal() {
      try {
        updateVenomModal();
      } catch (error) {
        setTimeout(tryUpdateVenomModal, 100);
      }
    })();

    this._currentProvider = cp;
  }

  public get currentProvider() {
    return this._currentProvider;
  }

  constructor(options: ProviderControllerOptions) {
    const defaultPackageOptions: {
      [key: string]: Record<string, Record<string, any>>;
    } = {
      venomwallet: window
        ? {
            extension: {
              forceUseFallback: true,
              fallback:
                getPromiseRaw(window, "venomwallet") ||
                (() => Promise.reject("venomwallet fallback error")),
            },
            standalone: {}, // ?
          }
        : {},
      everwallet: window
        ? {
            extension: {
              forceUseFallback: true,
              fallback:
                getPromiseRaw(window, "everwallet") ||
                (() => Promise.reject("everwallet fallback error")),
            },
            standalone: {}, // ?
          }
        : {},
    };

    this.checkNetworkId = options.checkNetworkId;
    this.checkNetworkName = options.checkNetworkName;

    this.providerOptions = options.providersOptions;

    // TODO можно будет задать order для списка
    this.providers = (Object.keys(allProviders.connectors).reverse() || [])
      .filter((id) => this.providerOptions?.[id])
      .map((id) => {
        const providerInfo: ProviderOptionsWithConnector =
          // @ts-ignore
          allProviders.providers?.[id] || undefined;

        const {
          // wallet,
          links,
          walletWaysToConnect,
          defaultWalletWaysToConnect,
        } = this.providerOptions?.[id];

        const types = walletWaysToConnect?.map(({ type }) => type);
        const ids = walletWaysToConnect?.map(({ id }) => id);

        return {
          id,
          // wallet,
          links,
          walletWaysToConnect: (
            providerInfo.walletWaysToConnect as ProviderOptionsWithConnectorOptional["walletWaysToConnect"]
          )
            .filter((walletWayToConnect) => {
              return (
                !!defaultWalletWaysToConnect?.includes(
                  walletWayToConnect.type
                ) &&
                (!types?.includes(walletWayToConnect.type) ||
                  !ids?.includes(walletWayToConnect.id))
              );
            })
            .concat(walletWaysToConnect || [])
            .map((walletWayToConnect) => {
              const defaultWay =
                // @ts-ignore
                allProviders?.providers?.[id]?.walletWaysToConnect?.find(
                  // allProviders?.providers?.venomwallet?.walletWaysToConnect?.find(
                  // @ts-ignore
                  ({ type }) => type === walletWayToConnect.type
                );

              const isCurrentDevise = checkIsCurrentBrowser(
                defaultWay.options.isCurrentBrowser
              );

              const userOptions = walletWayToConnect.packageOptions;

              const defaultOptions =
                defaultPackageOptions[id]?.[walletWayToConnect.type];

              const packageOptions = isCurrentDevise.isCurrentBrowser
                ? userOptions || defaultOptions || {}
                : {};

              const userOptionsStandalone =
                walletWayToConnect.packageOptionsStandalone;

              const defaultOptionsStandalone =
                defaultPackageOptions[id]?.["standalone"];

              const packageOptionsStandalone =
                userOptionsStandalone || defaultOptionsStandalone || {};

              // задаём 1000 как дефолт ид венома
              packageOptions.checkNetworkId = this.checkNetworkId;
              packageOptions.checkNetworkName = this.checkNetworkName;

              return {
                ...defaultWay,
                ...walletWayToConnect,
                connector:
                  walletWayToConnect.connector ||
                  // @ts-ignore
                  allProviders?.connectors?.[id]?.[walletWayToConnect.type]?.[
                    "connector"
                  ],
                authConnector:
                  walletWayToConnect.authConnector ||
                  // @ts-ignore
                  allProviders?.connectors?.[id]?.[walletWayToConnect.type]?.[
                    "authChecker"
                  ],
                standalone:
                  walletWayToConnect.standalone ||
                  // @ts-ignore
                  allProviders?.connectors?.[id]?.[walletWayToConnect.type]?.[
                    "standalone"
                  ],
                packageOptions,
                packageOptionsStandalone,
                options: {
                  ...(typeof defaultWay?.options === "object"
                    ? defaultWay?.options
                    : {}),
                  ...walletWayToConnect?.options,
                },
              };
            })
            .sort(
              (a, b) => sortingArr.indexOf(a.type) - sortingArr.indexOf(b.type)
            ),
        };
      });
  }

  public shouldDisplayProvider(id: string) {
    const provider = this.getProvider(id);
    return provider !== undefined;
  }

  public getOptions = () => {
    const options = this.providers.reduce((r, provider) => {
      const { id, walletWaysToConnect } = provider;

      const obj = {
        ...provider,
        walletWaysToConnect: walletWaysToConnect
          .map((walletWayToConnect) => {
            const { connector, id: connectorId } = walletWayToConnect;
            const isShould = this.shouldDisplayProvider(id);

            if (isShould && connector)
              return {
                ...walletWayToConnect,
                onClick: () => this.connectTo(id, connectorId, connector),
              };
            else return null;
          })
          .filter((walletWayToConnect) => !!walletWayToConnect),
      };

      if (obj.walletWaysToConnect.length) {
        r.push(obj as ProviderOptionsListWithOnClick[0]);
      }

      return r;
    }, [] as ProviderOptionsListWithOnClick);
    return options;
  };

  public getProvider = (id: string) => {
    return this.providers.find((provider) => provider.id === id);
  };

  public getProviderOption(id: string, connectorId: string, key: string) {
    const walletWaysToConnect = this.providers?.find(
      (provider) => provider.id === id
    )?.walletWaysToConnect;
    const walletWayToConnect = walletWaysToConnect?.find(
      (walletWayToConnect) => walletWayToConnect.id === connectorId
    );

    // @ts-ignore
    return walletWayToConnect?.[key] || {};
  }

  public getAuthTo = async (
    id: string,
    connectorId: string,
    authConnector: (providerPackage: any, opts: any) => Promise<any>
  ) => {
    try {
      this.currentProvider = null;

      const providerPackage = this.getProviderOption(
        id,
        connectorId,
        "package"
      );
      const providerOptions = this.getProviderOption(
        id,
        connectorId,
        "packageOptions"
      );
      const options = {
        ...providerOptions,
      };

      const provider = await authConnector(providerPackage, options);

      this.currentProvider = provider?.auth || null;

      return provider || null;
    } catch (error) {
      return null;
    }
  };

  public connectTo = async (
    id: string,
    connectorId: string,
    connector: ExtensionConnector
  ) => {
    try {
      this.currentProvider = null;

      this.eventController.trigger(SELECT_EVENT, id);
      const providerPackage = this.getProviderOption(
        id,
        connectorId,
        "package"
      );
      const providerOptions = this.getProviderOption(
        id,
        connectorId,
        "packageOptions"
      );
      const options = {
        ...providerOptions,
      };

      const provider = await connector(providerPackage, options, {
        authorizationCompleted: (_provider) => {
          this.eventController.trigger(EXTENSION_AUTH_EVENT, _provider);
        },
        extensionWindowClosed: () => {
          this.eventController.trigger(EXTENSION_WINDOW_CLOSED_EVENT);
        },
        extensionWindowError: (error) => {
          this.eventController.trigger(ERROR_EVENT, error);
        },
      });

      this.currentProvider = provider;

      this.eventController.trigger(CONNECT_EVENT, provider);
    } catch (error) {
      this.eventController.trigger(ERROR_EVENT, error);
    }
  };

  public on(event: Events, callback: (result: any) => void): () => void {
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

  public off(event: Events, callback?: (result: any) => void): void {
    this.eventController.off({
      event,
      callback,
    });
  }
}
