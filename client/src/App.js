import React from "react";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

// core components
import Admin from "./layouts/Admin.js";
import Home from "./layouts/Home.js";

import "./assets/css/material-dashboard-react.css?v=1.9.0";
import 'react-toastify/dist/ReactToastify.css';
import 'react-credit-cards/es/styles-compiled.css';

import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';
import CardState from './context/card/CardState';

const hist = createBrowserHistory();

function App() {
  return (
    <AuthState>
      <CardState>
        <AlertState>
          <ToastContainer />
          <Router history={hist}>
            <Switch>
              <Route path="/admin" component={Admin} />
              <Route path="/home" component={Home} />
              <Redirect from="/" to="/home/index" />
            </Switch>
          </Router>
        </AlertState>
      </CardState>
    </AuthState>
  );
}

export default App;
