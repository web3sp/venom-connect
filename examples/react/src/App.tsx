import { Address, ProviderRpcClient } from "everscale-inpage-provider";
import { EverscaleStandaloneClient } from "everscale-standalone-client";
import { useEffect, useState } from "react";

import { VenomConnect } from "venom-connect";

import testContractAbi from "./abi/test.abi.json";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

const initTheme = "light" as const;

const standaloneFallback = () =>
  EverscaleStandaloneClient.create({
    connection: {
      id: 1000,
      group: "venom_testnet",
      type: "jrpc",
      data: {
        endpoint: "https://jrpc.venom.foundation/rpc",
      },
    },
  });

const initVenomConnect = async () => {
  return new VenomConnect({
    theme: initTheme,
    checkNetworkId: 1000,
    // nTries: 3,
    providersOptions: {
      venomwallet: {
        links: {
          // extension: [
          //   {
          //     browser: "chrome", // "chrome" | "firefox"
          //     link: "https://chrome.google.com/webstore/detail/venom-wallet/ojggmchlghnjlapmfbnjholfjkiidbch",
          //   },
          // ],
          // ios: "https://testflight.apple.com/join/x5jOlxzL",
          // android: "https://venomwallet.page.link/download",
          // qr:
          //   // url
          //   //
          //   "https://venomwallet.page.link" +
          //   //
          //   // params
          //   //
          //   "/?link=" +
          //   encodeURIComponent(window.location.href) + '/#' +
          //   //
          //   "&apn=" +
          //   "com.venom.wallet" +
          //   //
          //   "&isi=" +
          //   "1622970889" +
          //   //
          //   "&ibi=" +
          //   "foundation.venom.wallet",
          //
          //   // qr: {
          //   //   targetLink: "",
          //   // },
          //   // ios: {
          //   //   targetLink: "",
          //   // },
        },
        walletWaysToConnect: [
          {
            // NPM package
            package: ProviderRpcClient,
            packageOptions: {
              fallback:
                VenomConnect.getPromise("venomwallet", "extension") ||
                (() => Promise.reject()),
              forceUseFallback: true,
            },
            packageOptionsStandalone: {
              fallback: standaloneFallback,
              forceUseFallback: true,
            },

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
          "mobile",
          "ios",
          "android",
        ],
      },
      oneartwallet: {
        walletWaysToConnect: [
          {
            // NPM package
            package: ProviderRpcClient,
            packageOptions: {
              fallback:
                VenomConnect.getPromise("oneartwallet", "extension") ||
                (() => Promise.reject()),
              forceUseFallback: true,
            },
            packageOptionsStandalone: {
              fallback: standaloneFallback,
              forceUseFallback: true,
            },

            // Setup
            id: "extension",
            type: "extension",
          },
        ],
        defaultWalletWaysToConnect: [
          // List of enabled options
          "mobile",
          "ios",
          "android",
        ],
      },
      oxychatwallet: {
        walletWaysToConnect: [
          {
            // NPM package
            package: ProviderRpcClient,
            packageOptions: {
              fallback:
                VenomConnect.getPromise("oxychatwallet", "extension") ||
                (() => Promise.reject()),
              forceUseFallback: true,
            },
            packageOptionsStandalone: {
              fallback: standaloneFallback,
              forceUseFallback: true,
            },

            // Setup
            id: "extension",
            type: "extension",
          },
        ],
        defaultWalletWaysToConnect: [
          // List of enabled options
          "mobile",
          "ios",
          "android",
        ],
      },
      //
      // Temporarily hidden Ever wallet
      //
      // everwallet: {
      //   links: {
      //     qr: null,
      //   },
      //   walletWaysToConnect: [
      //     {
      //       // NPM package
      //       package: ProviderRpcClient,
      //       packageOptions: {
      //         fallback:
      //           VenomConnect.getPromise("everwallet", "extension") ||
      //           (() => Promise.reject()),
      //         forceUseFallback: true,
      //       },
      //       packageOptionsStandalone: {
      //         fallback: standaloneFallback,
      //         forceUseFallback: true,
      //       },
      //       id: "extension",
      //       type: "extension",
      //     },
      //   ],
      //   defaultWalletWaysToConnect: [
      //     // List of enabled options
      //     "mobile",
      //     "ios",
      //     "android",
      //   ],
      // },
    },
  });
};

const themesList = ["light", "dark", "venom"];

const App = () => {
  const [venomConnect, setVenomConnect] = useState<any>();
  const [venomProvider, setVenomProvider] = useState<any>();
  const [address, setAddress] = useState();
  const [balance, setBalance] = useState();
  const [theme, setTheme] = useState(initTheme);
  const [info, setInfo] = useState("");
  const [standaloneMethodsIsFetching, setStandaloneMethodsIsFetching] =
    useState(false);

  const getTheme = () =>
    venomConnect?.getInfo()?.themeConfig?.name?.toString?.() || "...";

  const onToggleThemeButtonClick = async () => {
    const currentTheme = getTheme();

    const lastIndex = themesList.length - 1;

    const currentThemeIndex = themesList.findIndex(
      (item) => item === currentTheme
    );

    const theme =
      currentThemeIndex >= lastIndex || !~currentThemeIndex || !~lastIndex
        ? themesList[0]
        : themesList[currentThemeIndex + 1];

    await venomConnect?.updateTheme(theme);

    setTheme(getTheme());
  };

  const getAddress = async (provider: any) => {
    const providerState = await provider?.getProviderState?.();

    const address =
      providerState?.permissions.accountInteraction?.address.toString();

    return address;
  };

  const getBalance = async (provider: any, _address: string) => {
    try {
      const providerBalance = await provider?.getBalance?.(_address);

      return providerBalance;
    } catch (error) {
      return undefined;
    }
  };

  const checkAuth = async (_venomConnect: any) => {
    const auth = await _venomConnect?.checkAuth();
    if (auth) await getAddress(_venomConnect);
  };

  const onInitButtonClick = async () => {
    const initedVenomConnect = await initVenomConnect();
    setVenomConnect(initedVenomConnect);

    await checkAuth(initedVenomConnect);
  };

  const onConnectButtonClick = async () => {
    venomConnect?.connect();
  };

  const onDisconnectButtonClick = async () => {
    venomProvider?.disconnect();
  };

  const check = async (_provider: any) => {
    const _address = _provider ? await getAddress(_provider) : undefined;
    const _balance =
      _provider && _address ? await getBalance(_provider, _address) : undefined;

    setAddress(_address);
    setBalance(_balance);

    if (_provider && _address)
      setTimeout(() => {
        check(_provider);
      }, 7000);
  };

  const onConnect = async (provider: any) => {
    setVenomProvider(provider);

    check(provider);
  };

  useEffect(() => {
    const off = venomConnect?.on("connect", onConnect);

    return () => {
      off?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venomConnect]);

  const onStandaloneCall = async () => {
    const standalone: ProviderRpcClient | undefined =
      await venomConnect?.getStandalone("venomwallet");

    if (standalone) {
      const mainnetContractAddress = new Address(
        "0:" // todo
      );

      const contract = new standalone.Contract(
        testContractAbi,
        mainnetContractAddress
      );
      setStandaloneMethodsIsFetching(true);
      const outputs = await contract.methods
        .getMuldivmod({
          a: 4,
          b: 5,
          c: (Date.now() % 3 ^ 0) + 1,
        } as never)
        .call();

      setInfo(JSON.stringify(outputs, null, 2));
    } else {
      alert("Standalone is not available now");
    }

    setStandaloneMethodsIsFetching(false);
  };

  return (
    <Box>
      <Grid container justifyContent="center" my={4}>
        <Grid item>
          <Typography variant="h1" component="h1" textAlign="center">
            Example
            {/* (v1.0.14) */}
            <br />
            <small>(OXY.CHAT version)</small>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <i
                style={{
                  fontSize: "0.3em",
                }}
              >
                [Deployment: Nov 28 2022]
              </i>
            </div>
          </Typography>
        </Grid>
      </Grid>
      <Container>
        {!venomConnect && (
          <Grid
            container
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
          >
            <Grid item>
              <>
                <Button variant="contained" onClick={onInitButtonClick}>
                  Init lib
                </Button>
              </>
            </Grid>
          </Grid>
        )}
        {venomConnect && (
          <Grid container direction={"column"} gap={6}>
            <Grid item>
              <Grid container gap={1} justifyContent={"center"}>
                <Typography variant="h5" component="h2">
                  Theme: <i>{theme}</i>
                </Typography>
                <Button variant="outlined" onClick={onToggleThemeButtonClick}>
                  Toggle theme
                </Button>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                direction={"column"}
                alignItems={"center"}
                gap={2}
              >
                <Typography variant="h5" component="span">
                  You can use:
                </Typography>

                <Grid item>
                  {venomConnect && !address && (
                    <Button variant="contained" onClick={onConnectButtonClick}>
                      Connect via pop up
                    </Button>
                  )}
                  {venomConnect && !!address && (
                    <Button
                      variant="contained"
                      onClick={onDisconnectButtonClick}
                    >
                      Disconnect
                    </Button>
                  )}
                </Grid>

                <Grid item>
                  <Typography variant="h5" component="span">
                    or
                  </Typography>
                </Grid>
                <Grid item>
                  {venomConnect && (
                    <Button variant="contained" onClick={onStandaloneCall}>
                      Standalone test contract call
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Grid container direction={"column"} gap={2}>
                <Grid item>
                  <Typography
                    variant="h5"
                    component="h2"
                    style={{
                      wordBreak: "break-word",
                    }}
                  >
                    Address:{" "}
                    <i
                      style={{
                        fontSize: "smaller",
                      }}
                    >
                      {address}
                    </i>
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item>
                  <Typography
                    variant="h5"
                    component="h2"
                    style={{
                      wordBreak: "break-word",
                    }}
                  >
                    Balance:{" "}
                    <i
                      style={{
                        fontSize: "smaller",
                      }}
                    >
                      {balance ? (balance / 10 ** 9).toFixed(2) : undefined}
                    </i>
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item>
                  {`getMuldivmod({
                    a: 4,
                    b: 5,
                    c: random 1-3,
                  }`}
                  <pre>
                    {(standaloneMethodsIsFetching ? (
                      <i>Standalone request in progress</i>
                    ) : (
                      info
                    )) || <span>&nbsp;</span>}
                  </pre>
                  <Divider />
                </Grid>
                <Grid item>
                  <Typography variant="h5" component="span">
                    User agent:{" "}
                    <i
                      style={{
                        fontSize: "smaller",
                      }}
                    >
                      {window.navigator.userAgent}
                    </i>
                  </Typography>

                  <Divider />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default App;
