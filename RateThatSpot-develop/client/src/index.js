import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import history from './history';
//import * as serviceWorker from "./serviceWorker";
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

// Options for react alert handler
const options = {
  position: 'bottom center',
  timeout: 5000,
  offset: '30px',
  transition: 'scale'
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter history={history}>
      <AlertProvider template={AlertTemplate} {...options}>
        <App />
      </AlertProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

//serviceWorker.unregister();