import {
  getUserDetail,
  setEmail,
  tryLogin,
  tryLogout,
  trySignup,
} from "./actionCreators";

export const GET_ACTIONS = {
  USER_DETAIL: getUserDetail,
};

export const SET_ACTIONS = {
  EMAIL: setEmail,
};

export const TRY_ACTIONS = {
  LOGIN: tryLogin,
  LOGOUT: tryLogout,
  SIGNUP: trySignup,
};
