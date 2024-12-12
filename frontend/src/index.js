import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store from "./store";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PayPalScriptProvider deferLoading={true}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PayPalScriptProvider>
  </Provider>
);
