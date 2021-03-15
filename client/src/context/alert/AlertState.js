import React, {useReducer} from 'react';
import {v4 as uuidv4} from 'uuid';
import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import {SET_ALERT, REMOVE_ALERT} from '../types';

const AlertState = props => {
  const initialState = null;

  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Set Alert
  const setAlert = (msg, type) => {
    const id = uuidv4();
    dispatch({
      type: SET_ALERT,
      payload: {msg, type, id},
    });
  };

  const removeAlert = () => {
    dispatch({
      type: REMOVE_ALERT,
    });
  };

  return (
    <AlertContext.Provider
      value={{
        alert: state,
        setAlert,
        removeAlert,
      }}>
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
