import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { WidoWidget } from "wido-widget";
import { getSupportedTokens } from "wido";
import { useLocalApi } from "wido";

function App() {
  const [fromTokens, setFromTokens] = useState([]);
  const [toTokens, setToTokens] = useState([]);
  useLocalApi();

  useEffect(() => {
    const fromTokens = [
      {
        chainId: 42161,
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        protocol: "dex",
        symbol: "ETH",
        name: "ETH",
        decimals: 18,
        logoURI: "https://arbiscan.io/images/main/empty-token.png",
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
          fromTokens={fromTokens}
          toTokens={toTokens}
          quoteApi={(request) => {
            console.log(request);
          }}
        />
      </header>
    </div>
  );
}

export default App;
