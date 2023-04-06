import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState, useCallback } from "react";
import { WidoWidget } from "wido-widget";
import { getSupportedTokens, quote } from "wido";
import { useLocalApi } from "wido";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Web3Provider } from "@ethersproject/providers";

export const injected = new InjectedConnector({});

function App() {
  const [fromTokens, setFromTokens] = useState([]);
  const [toTokens, setToTokens] = useState([]);
  const { library, activate, chainId, account } = useWeb3React();
  const [ethProvider, setEthProvider] = useState();

  useLocalApi();

  const handleMetamask = useCallback(async () => {
    await activate(injected);
  }, [activate]);

  const handleConnectWalletClick = useCallback(
    (chainId) => {
      handleMetamask();
    },
    [handleMetamask]
  );

  useEffect(() => {
    if (!library) {
      setEthProvider(undefined);
      return;
    }
    // every time account or chainId changes we need to re-create the provider
    // for the widget to update with the proper address
    setEthProvider(new Web3Provider(library));
  }, [library, account, chainId, setEthProvider]);

  useEffect(() => {
    const fromTokens = [
      // {
      //   chainId: 42161,
      //   address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      //   protocol: "dex",
      //   symbol: "ETH",
      //   name: "ETH",
      //   decimals: 18,
      //   logoURI: "https://arbiscan.io/images/main/empty-token.png",
      // },
      {
        chainId: 42161,
        address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
        protocol: "dex",
        symbol: "GMX",
        name: "GMX",
        decimals: 18,
        logoURI:
          "https://tokens.1inch.io/0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a.png",
      },
    ];
    const toTokens = [
      {
        chainId: 42161,
        address: "0x854c4ee45b2379446c4bf1c2f872c26aa8d95d8d",
        protocol: "uni-v3",
        symbol: "UniV3 USDs/GMX",
        name: "UniV3 USDs/GMX",
        decimals: 18,
        logoURI: "https://arbiscan.io/images/main/empty-token.png",
      },
    ];
    setFromTokens(fromTokens);
    // setToTokens(fromTokens);
    setToTokens(toTokens);
    // getSupportedTokens({ chainId: [42161] }).then(setFromTokens);
    // getSupportedTokens({ chainId: [42161] }).then(setToTokens);
  }, [setFromTokens, setToTokens]);

  return (
    <div className="App">
      <header className="App-header">
        <WidoWidget
          onConnectWalletClick={handleConnectWalletClick}
          ethProvider={ethProvider}
          fromTokens={fromTokens}
          toTokens={toTokens}
          quoteApi={async (request) =>
            quote({
              ...request,
              lowerTick: String(-23000),
              upperTick: String(-20000),
            })
          }
        />
      </header>
    </div>
  );
}

export default App;
