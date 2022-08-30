import { isChrome, isDesktop } from "react-device-detect";
import {
  CONNECT_EVENT,
  ERROR_EVENT,
  Events,
  SELECT_EVENT,
} from "../helpers/events";
import * as allProviders from "../providers";
import {
  ConnectorType,
  ProviderControllerOptions,
  ProviderOptionsList,
  ProviderOptionsListWithOnClick,
  ProviderOptionsWithConnector,
  ProviderOptionsWithConnectorOptional,
  UserProvidersOptions,
} from "../types";
import { EventController } from "./EventController";

const sortingArr: ConnectorType[] = ["extension", "mobile", "ios", "android"];

export const getPromisesRaw = (
  windowObject: any,
  walletId: string,
  type: string | undefined = "extension"
) => {
  const promises = {
    venomwallet: {
      extension: {
        waitingVenomPromise: () => {
          if (windowObject) {
            return new Promise((resolve, reject) => {
              if (windowObject.__venom) {
                resolve(windowObject.__venom);
                return
              }
              let nTries = 0 // число попыток, иначе он будет бесконечно, может это вынести в конфиг
              let interval = setInterval(() => {
                if (windowObject.__venom) {
                  clearInterval(interval);
                  resolve(windowObject.__venom);
                } else if (nTries > 0) {
                  nTries--;
                } else {
                  clearInterval(interval);
                  reject('Venom wallet is not found')
                }
              }, 500);
            });
          }
          return Promise.reject();
        },
      },
    },
    everwallet: {
      extension: {
        waitingEverPromise: () => {
          if (windowObject) {
            return new Promise((resolve, reject) => {
              if (windowObject.__ever) {
                resolve(windowObject.__ever);
                return
              }
              let nTries = 0 // число попыток, иначе он будет бесконечно, может это вынести в конфиг
              let interval = setInterval(() => {
                if (windowObject.__ever) {
                  clearInterval(interval);
                  resolve(windowObject.__ever);
                } else if (nTries > 0) {
                  nTries--;
                } else {
                  clearInterval(interval);
                  reject('Ever wallet is not found')
                }
              }, 500);
            });
          }
          return Promise.reject();
        },
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

  private _currentProvider: any;

  get currentProvider() {
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
                getPromisesRaw(window, "venomwallet")?.waitingVenomPromise ||
                (() => Promise.reject("venomwallet fallback error")),
            },
          }
        : {},
      everwallet: window
        ? {
          extension: {
            forceUseFallback: true,
            fallback:
              getPromisesRaw(window, "everwallet")?.waitingEverPromise ||
              (() => Promise.reject("everwallet fallback error")),
          },
        }
        : {},
    };

    this.providerOptions = options.providersOptions;

    // TODO можно будет задать order для списка
    this.providers = (Object.keys(allProviders.connectors).reverse() || []).map((id) => {
      const providerInfo: ProviderOptionsWithConnector =
        // @ts-ignore
        allProviders.providers?.[id] || undefined;

      const { wallet, links, walletWaysToConnect, defaultWalletWaysToConnect } =
        this.providerOptions?.[id];

      const types = walletWaysToConnect?.map(({ type }) => type);
      const ids = walletWaysToConnect?.map(({ id }) => id);

      return {
        id,
        wallet,
        links,
        walletWaysToConnect: (
          providerInfo.walletWaysToConnect as ProviderOptionsWithConnectorOptional["walletWaysToConnect"]
        )
          .filter((walletWayToConnect) => {
            return (
              !!defaultWalletWaysToConnect?.includes(walletWayToConnect.type) &&
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

            const forceUseFallback =
              !!walletWayToConnect.packageOptions?.forceUseFallback;

            const userOptions =
              isChrome && isDesktop && !forceUseFallback
                ? walletWayToConnect.packageOptions
                : null;

            const defaultOptions =
              isChrome && isDesktop
                ? defaultPackageOptions[id]?.[walletWayToConnect.type]
                : {};

            const packageOptions = userOptions || defaultOptions || {};

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
              packageOptions,
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

      return provider || null;
    } catch (error) {
      return null;
    }
  };

  public connectTo = async (
    id: string,
    connectorId: string,
    connector: (providerPackage: any, opts: any) => Promise<any>
  ) => {
    try {
      this._currentProvider = null;

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

      const provider = await connector(providerPackage, options);

      this._currentProvider = provider;

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
