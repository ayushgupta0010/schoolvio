import * as actionTypes from "../actions/actionTypes";

const initialState = { notifsList: [] };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_NOTIF:
      return {
        ...state,
        notifsList: [action.payload, ...state.notifsList],
      };

    case actionTypes.SET_NOTIF_LIST:
      return {
        ...state,
        notifsList: action.payload.notifsList,
      };

    case actionTypes.MARK_NOTIF_READ:
      return {
        ...state,
        notifsList: state.notifsList.map((notif) =>
          notif.id === action.payload.id ? { ...notif, isRead: true } : notif
        ),
      };

    case actionTypes.RESET_NOTIF_LIST:
      return {
        ...state,
        notifsList: [],
      };

    default:
      return state;
  }
};

export default reducer;
