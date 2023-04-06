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

function useInput({ type /*...*/, defaultVal }) {
  const [value, setValue] = useState(defaultVal);
  const input = (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type={type}
    />
  );
  return [value, input];
}

function App() {
  const [fromTokens, setFromTokens] = useState([]);
  const [toTokens, setToTokens] = useState([]);
  const { library, activate, chainId, account } = useWeb3React();
  const [ethProvider, setEthProvider] = useState();
  const [lowerTick, lowerTickInput] = useInput({
    type: "number",
    defaultVal: -24000,
  });
  const [upperTick, upperTickInput] = useInput({
    type: "number",
    defaultVal: -23000,
  });

  // useLocalApi();

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
    setFromTokens(fromTokens);
    getSupportedTokens({
      chainId: [42161],
      protocol: ["dex", "yearn.finance"],
    }).then(setFromTokens);
    getSupportedTokens({ chainId: [42161], protocol: ["uni-v3"] }).then(
      setToTokens
    );
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
              lowerTick,
              upperTick,
            })
          }
        />
        <div>
          <div>
            <label>Lower Tick</label>
            {lowerTickInput}
          </div>
          <div>
            <label>Upper Tick</label>
            {upperTickInput}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
