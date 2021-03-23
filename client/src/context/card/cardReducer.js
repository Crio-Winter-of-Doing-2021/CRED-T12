import {
    SET_LOADING,
    ADD_CARD_SUCCESS,
    ADD_CARD_FAIL,
    GET_ALL_CARDS_SUCCESS,
    GET_ALL_CARDS_FAIL,
    CLEAR_ERRORS,
} from "../types";

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: true,
            };
        case ADD_CARD_SUCCESS:
            localStorage.setItem("token", action.payload.token);
            return {
                ...state,
                loading: false,
            };
        case GET_ALL_CARDS_SUCCESS:
            return {
                ...state,
                allCards: action.payload,
                loading: false,
            };
        case ADD_CARD_FAIL:
        case GET_ALL_CARDS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};
