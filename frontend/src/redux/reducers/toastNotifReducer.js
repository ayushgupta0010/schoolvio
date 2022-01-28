import * as actionTypes from "../actions/actionTypes";

const initialState = { toastNotifs: [] };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_TOAST_NOTIFICATION:
      return {
        ...state,
        toastNotifs: [...state.toastNotifs, action.payload],
      };

    case actionTypes.REMOVE_TOAST_NOTIFICATION:
      return {
        ...state,
        toastNotifs: state.toastNotifs.filter(
          (x) => x.timestamp !== action.payload.timestamp
        ),
      };

    case actionTypes.RESET_TOAST_NOTIFICATION_LIST:
      return {
        ...state,
        toastNotifs: [],
      };

    default:
      return state;
  }
};

export default reducer;
