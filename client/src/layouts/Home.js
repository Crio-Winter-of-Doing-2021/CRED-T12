import React, { useState, useContext, useEffect, createRef } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from 'react-toastify';
import "perfect-scrollbar/css/perfect-scrollbar.css";

import Footer from "../components/Footer/Footer.js";
import HomeNavbar from "../components/Navbars/HomeNavbar.js";
import styles from "../assets/jss/material-dashboard-react/layouts/homeStyle.js";
import routes from "../routesHome.js";
import AlertContext from '../context/alert/alertContext';
import AuthContext from '../context/auth/authContext';

let ps;

const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === "/home") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      return null;
    })}
    <Redirect from="/home" to="/home/index" />
  </Switch>
);

const useStyles = makeStyles(styles);

export default function Home({ ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = createRef();
  // states and functions
  const [fixedClasses, setFixedClasses] = useState("dropdown show");
  const [mobileOpen, setMobileOpen] = useState(false);
  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);

  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const { alert, removeAlert } = alertContext;
  const { loadUser } = authContext;

  // useEffect(() => {
  //   loadUser();
  //   // eslint-disable-next-line
  // }, []);

  useEffect(() => {
    if (alert && alert.msg) {
      if (alert.type === 'error') {
        toast.error(alert.msg, {toastId: alert.id});
      }
      if (alert.type === 'success') {
        toast.success(alert.msg, {toastId: alert.id});
      }
      if (alert.type === 'info') {
        toast.info(alert.msg, {toastId: alert.id});
      }
      if (alert.type === 'warn') {
        toast.warn(alert.msg, {toastId: alert.id});
      }
      removeAlert();
    }
  }, [alert]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.mainPanel} ref={mainPanel}>
        <HomeNavbar />
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div>
            <div>{switchRoutes}</div>
          </div>
        ) : (
          <div className={classes.map}>{switchRoutes}</div>
        )}
        {getRoute() ? <Footer /> : null}
      </div>
    </div>
  );
}
