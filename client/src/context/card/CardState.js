import React, { useReducer } from "react";
import axios from "axios";

import CardContext from "./cardContext";
import cardReducer from "./cardReducer";
import {
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

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <CardContext.Provider
      value={{
        allCards: state.allCards,
        loading: state.loading,
        error: state.error,
        clearErrors,
      }}
    >
      {props.children}
    </CardContext.Provider>
  );
};

export default CardState;
