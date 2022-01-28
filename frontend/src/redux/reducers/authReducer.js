import ReconnectingWebSocket from "reconnecting-websocket";
import { WEBSOCKET_URL } from "../../utils/urls";
import * as actionTypes from "../actions/actionTypes";

const token = localStorage.getItem("token");
const refreshToken = localStorage.getItem("refreshToken");

const defaultDict = {
  isLoggedIn: false,
  username: null,
  email: null,
  role: null,
  verified: null,
  isProfileCompleted: null,
  isSchoolVerified: null,
  isSuspended: null,
  reason: null,
  photo: null,
  classSection: null,
  school: null,
  schoolName: null,
  schoolPhoto: null,
  isSubscriptionExpired: null,
  websocket: null,
};

const initialState =
  token && refreshToken ? { ...defaultDict, isLoggedIn: true } : defaultDict;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        isLoggedIn: true,
      };

    case actionTypes.LOGOUT:
      state.websocket.close();
      return {
        ...state,
        ...defaultDict,
      };

    case actionTypes.UPDATE_USER_DETAIL:
      return {
        ...state,
        username: action.payload.username,
        email: action.payload.email,
        role: action.payload.role,
        verified: action.payload.verified,
        isProfileCompleted: action.payload.isProfileCompleted,
        isSchoolVerified: action.payload.isSchoolVerified,
        isSuspended: action.payload.isSuspended,
        reason: action.payload.reason,
        photo: action.payload.photo,
        classSection: action.payload.classSection,
        school: action.payload.school,
        schoolName: action.payload.schoolName,
        schoolPhoto: action.payload.schoolPhoto,
        isSubscriptionExpired: action.payload.isSubscriptionExpired,
        websocket: new ReconnectingWebSocket(
          `${WEBSOCKET_URL}${action.payload.username}/`
        ),
      };

    case actionTypes.UPDATE_VERIFIED:
      return {
        ...state,
        verified: true,
      };

    case actionTypes.UPDATE_EMAIL:
      return {
        ...state,
        email: action.payload.email,
      };

    default:
      return state;
  }
};

export default reducer;
