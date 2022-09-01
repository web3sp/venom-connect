# VenomConnect

Dev tips:

- _work in progress_
- _without types (temporary)_
- _temporary supported only import via files; npm support coming soon_

---

You can find the library file in the folder **./lib"**.
If you want to rebuild this file, use the command `yarn lib` (or `npm run lib` if you prefer npm).

---

# How to use VenomConnect?

**Import VenomConnect**

```javascript
import * as venom from "./lib/venom/index.js";
```

**Init VenomConnect with your own settings**

```javascript
type VenomConnect = any; // temp fix for TS

const initVenomConnect = async () => {
  const VenomConnect: VenomConnect = venom.VenomConnect; // temp fix TS

  return new VenomConnect({
    theme: "light",
    providersOptions: {
      venomwallet: {
        wallet: {
          // Wallet setup
          name: "Venom Wallet",
          // logo: "",
          // description: "Custom description",
        },
        links: {
          extension:
            "https://chrome.google.com/webstore/detail/venom-wallet/ojggmchlghnjlapmfbnjholfjkiidbch",
          ios: null,
          android:
            "https://play.google.com/store/apps/details?id=com.venom.wallet",
          qr: undefined,
        },
        links: {
          extension: "...",
          ios: null, // use null if you want to turn it off
          // android: "...", do not set a parameter if you want to use it default version
          android: undefined, // or use undefined
          qr: "...",
        },
        walletWaysToConnect: [
          {
            // NPM package
            // package: ProviderRpcClient,
            // packageOptions: {
            //   fallback: () =>
            //     EverscaleStandaloneClient.create({
            //       connection: {
            //         group: "mainnet",
            //         type: "jrpc",
            //         data: {
            //           endpoint: "https://jrpc-mainnet.venom.rs/rpc",
            //         },
            //       },
            //     }).then(
            //       (
            //         VenomConnect.getPromises("venomwallet", "extension")
            //           ?.waitingVenomPromise || (() => Promise.reject())
            //       )()
            //     ),
            //   forceUseFallback: true,
            //   разрешенные ид сети - число или массив чисел  
            //   checkNetworkId: 1000,  
            // },

            // Setup
            id: "extension",
            type: "extension",

            // name: "Custom Name",
            // logo: "",

            // High-level setup
            // options: ,
            // connector: ,
            // authConnector: ,
          },
        ],
        defaultWalletWaysToConnect: [
          // List of enabled options
          // "extension",
          "mobile",
          "ios",
          "android",
        ],
      },
    },
  });
};

const onInitButtonClick = async () => {
  const venomConnect = await initVenomConnect();
  // you can save venomConnect here

  // and check Authorization
  await checkAuth(initedVenomConnect);
};
```

**Subscribe on events**

```javascript
const onConnect = async (provider: ProviderRpcClient | undefined) => {
  // you can save provider here
};

useEffect(() => {
  const off = venomConnect?.on("connect", onConnect);

  return () => {
    off?.();
  };
}, [venomConnect]);
```

**Connect to provider via VenomConnect popup**

```javascript
const onConnectButtonClick = async () => {
  venomConnect?.connect();
};
```

**Use provider**

```javascript
// get whatever you want
const getAddress = async (provider: ProviderRpcClient) => {
  const providerState = await provider?.getProviderState?.();

  const address =
    providerState?.permissions.accountInteraction?.address.toString();

  return address;
};

// use methods
const disconnect = async () => {
  venomProvider?.disconnect();
  // ...
};
```

**Connecting to the provider after the page is refreshed**

```javascript
// Such a check is also called before the standard pop-up call
const checkAuth = async (venomConnect: VenomConnect) => {
  const authObjectOrFalse = await venomConnect?.checkAuth();

  if (authObjectOrFalse) {
    // You can get the data you need. For example, the address.
    await getAddress(venomConnect);
  }
};
```
