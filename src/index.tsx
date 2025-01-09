import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from "./store/index.ts";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const onBeforeLift = () => persistor.purge();
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor} onBeforeLift={onBeforeLift}>
      <React.StrictMode>
        {/* <React.StrictMode> */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
        {/* </React.StrictMode> */}
      </React.StrictMode>
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
