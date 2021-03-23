import React, { useState, useContext, useEffect } from 'react';
import { Link } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Person from "@material-ui/icons/Person";
import MenuIcon from "@material-ui/icons/Menu";


import Button from "../../components/CustomButtons/Button.js";
import styles from "../../assets/jss/material-dashboard-react/components/headerStyle.js";
import AuthContext from '../../context/auth/authContext';

const useStyles = makeStyles(styles);

export default function Header(props) {
  const classes = useStyles();

  const authContext = useContext(AuthContext);
  const { logout } = authContext;
  
  function getBrand() {
    var name;
    const navbarRoutes = props.routes.filter((item) => {
      return item.inSidebar;
    });
    navbarRoutes.map(item => {
      if (window.location.href.indexOf(item.layout + item.path) !== -1) {
        name = item.name;
      }
      return null;
    });
    return name;
  }
  const { color } = props;
  const appBarClasses = classNames({
    [" " + classes[color]]: color
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
  };

  console.log(window.location.href);
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button color="transparent" className={classes.title}>
            {getBrand()}
          </Button>
        </div>
        {getBrand() === 'Dashboard' && 
          <div>
            <Button color="primary" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              <Person className={classes.icons} />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        }
        {getBrand() === 'Card' && 
          <div>
            <Button color="primary" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              <Person className={classes.icons} />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} component={Link} to='/admin/card'>All Cards</MenuItem>
              <MenuItem onClick={handleClose} component={Link} to='/admin/card/add'>Add Card</MenuItem>
            </Menu>
          </div>
        }
        <Hidden mdUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  handleDrawerToggle: PropTypes.func,
  routes: PropTypes.arrayOf(PropTypes.object)
};
