import "./App.css";
import {useEffect, useState, useCallback} from "react";
import {WidoWidget} from "wido-widget";
import {getSupportedTokens, quote} from "wido";
import {useWeb3React} from "@web3-react/core";
import {InjectedConnector} from "@web3-react/injected-connector";
import {Web3Provider} from "@ethersproject/providers";

export const injected = new InjectedConnector({});

function App() {
  const [fromTokens, setFromTokens] = useState([]);
  const [toTokens, setToTokens] = useState([]);
  const {library, activate, chainId, account} = useWeb3React();
  const [ethProvider, setEthProvider] = useState();
  const [stakingEnabled, setStakingEnabled] = useState(false);

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
    getSupportedTokens({
      chainId: [1313161554],
    }).then((tokens) => {
      setFromTokens(tokens);
      setToTokens(tokens.filter(token => token.protocol === "trisolaris"));
    });
  }, [setFromTokens, setToTokens]);

  return (
    <div className="App">
      <header className="App-header">
        <WidoWidget
          onConnectWalletClick={handleConnectWalletClick}
          ethProvider={ethProvider}
          fromTokens={fromTokens}
          toTokens={toTokens}
          quoteApi={async (request) => {
            if (stakingEnabled) {
              // To enable staking step, an override is set.
              // `$trisolaris_auto_stake` must be set to 1.
              //
              // If the var is not set, or has a different value than 1,
              //  the staking step won't be added.
              //
              // This variable will have no effect on tokens that are not
              // Trisolaris LP tokens with a valid enabled farm.
              request.varsOverride = {
                $trisolaris_auto_stake: "1"
              }
            }
            return quote(request)
          }}
        />
        <div>
          <div>
            <label>Staking enabled</label>
            <input type="checkbox" onClick={(e) => {setStakingEnabled(!stakingEnabled)}}/>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
