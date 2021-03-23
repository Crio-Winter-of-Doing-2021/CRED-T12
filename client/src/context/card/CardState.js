import React, { useReducer } from "react";
import axios from "axios";

import CardContext from "./cardContext";
import cardReducer from "./cardReducer";
import {
  ADD_CARD_SUCCESS,
  ADD_CARD_FAIL,
  GET_ALL_CARDS_SUCCESS,
  GET_ALL_CARDS_FAIL,
  SET_LOADING,
  CLEAR_ERRORS,
} from "../types";
import { serverUrl } from "../../global.js";

const CardState = (props) => {
  const initialState = {
    allCards: [],
    loading: false,
    error: null,
  };

  const [state, dispatch] = useReducer(cardReducer, initialState);

  // Get all cards of logged in user
  const getAllCards = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + localStorage.token,
      },
    };

    try {
      dispatch({
        type: SET_LOADING,
      });
      const res = await axios.get(`${ serverUrl }/card/all`, config);
      console.log(res.data.data);

      if(res.data.success === 'success') {
        dispatch({
          type: GET_ALL_CARDS_SUCCESS,
          payload: res.data.data,
        });
        return;
      }
      dispatch({ 
        type: GET_ALL_CARDS_FAIL,
        payload: res.data.message || "Error occurred!"
      });
    } catch (err) {
      dispatch({
        type: ADD_CARD_FAIL,
        payload: (err.response && err.response.data && err.response.data.message) || 'Error occurred',
      });
    }
  };

  // Add card
  const addCard = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + localStorage.token,
      },
    };

    try {
      console.log(formData);
      dispatch({
        type: SET_LOADING,
      });
      const res = await axios.post(`${ serverUrl }/card/add`, formData, config);
      console.log(res);
      // return;
      if(res.data.success === 'success') {
        dispatch({
          type: ADD_CARD_SUCCESS,
          payload: res.data.data,
        });
        return;
      }
      dispatch({ 
        type: ADD_CARD_FAIL,
        payload: res.data.message || "Couldn't add card!"
      });
    } catch (err) {
      dispatch({
        type: ADD_CARD_FAIL,
        payload: (err.response && err.response.data && err.response.data.message) || 'Error occurred',
      });
    }
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <CardContext.Provider
      value={{
        allCards: state.allCards,
        loading: state.loading,
        error: state.error,
        addCard,
        getAllCards,
        clearErrors,
      }}
    >
      {props.children}
    </CardContext.Provider>
  );
};

export default CardState;
