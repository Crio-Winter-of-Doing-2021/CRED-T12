import React, { useReducer } from "react";
import axios from "axios";

import AuthContext from "./authContext";
import authReducer from "./authReducer";
import setAuthToken from "../../utils/setAuthToken";
import {
  SET_LOADING,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from "../types";
import { serverUrl } from "../../global.js";

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: false,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = async () => {
    // setAuthToken(localStorage.token);
    const config = {
      headers: {
        'Authorization': 'Bearer ' + localStorage.token,
      },
    };

    try {
      dispatch({
        type: SET_LOADING,
      });
      const res = await axios.get(`${ serverUrl }/user/auth`, config);
      console.log('loadUser', res);

      if(res.data.success === 'success') {
        dispatch({
          type: USER_LOADED,
          payload: res.data.data,
        });
        return;
      }
      dispatch({ type: AUTH_ERROR });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  // Register User
  const register = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      dispatch({
        type: SET_LOADING,
      });
      const res = await axios.post(`${ serverUrl }/user/sign-up`, formData, config);

      if(res.data.success === 'success') {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data.data,
        });

        loadUser();
        return;
      }
      dispatch({
        type: REGISTER_FAIL,
        payload: res.data.message,
      });
    } catch (err) {
      console.log(err.response)
      dispatch({
        type: REGISTER_FAIL,
        payload: (err.response && err.response.data && err.response.data.message) || 'Error occurred',
      });
    }
  };

  // Login User
  const login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      dispatch({
        type: SET_LOADING,
      });
      const res = await axios.post(`${ serverUrl }/user/login`, formData, config);

      if(res.data.success === 'success') {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data.data,
        });

        loadUser();
        return;
      }
      dispatch({
        type: LOGIN_FAIL,
        payload: res.data.message,
      });
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: (err.response && err.response.data && err.response.data.message) || 'Error occurred',
      });
    }
  };

  // Logout
  const logout = () => dispatch({ type: LOGOUT });

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
