import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { sendToVercelAnalytics } from "./vitals";
import { Web3ReactProvider } from "@web3-react/core";

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={(lib) => lib}>
      <App />
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals(sendToVercelAnalytics);
