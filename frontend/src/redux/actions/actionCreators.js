import {
  LOGIN_WITH_EMAIL_MUTATION,
  LOGIN_WITH_USERNAME_MUTATION,
  REFRESH_AND_REVOKE_TOKEN_MUTATION,
  REVOKE_TOKEN_MUTATION,
  SIGNUP_MUTATION,
  UPDATE_USER_AUTH_MUTATION,
} from "../../utils/mutation";
import { ME_QUERY } from "../../utils/query";
import client from "../../utils/apollo";
import * as actionStates from "./actionStates";

export const getUserDetail = () => (dispatch) => {
  client
    .query({ query: ME_QUERY })
    .then((res) => dispatch(actionStates.updateUserDetail(res.data.user)))
    .catch((err) => err);
};

export const setEmail = (email) => async (dispatch) => {
  return await client
    .mutate({
      mutation: UPDATE_USER_AUTH_MUTATION,
      variables: { email },
    })
    .then((res) => {
      if (res.data.updateUserAuth.success) {
        dispatch(actionStates.updateEmail(email));
        client
          .mutate({
            mutation: REFRESH_AND_REVOKE_TOKEN_MUTATION,
            variables: { refreshToken: localStorage.getItem("refreshToken") },
          })
          .then((res) => {
            if (res.data.getToken) {
              localStorage.setItem("token", res.data.getToken.token);
              localStorage.setItem(
                "refreshToken",
                res.data.getToken.refreshToken
              );
            } else dispatch(tryLogout());
          })
          .catch((err) => err);
      }
      return res;
    });
};

export const tryLogin =
  (method, usernameOrEmail, password) => async (dispatch) => {
    let mutation =
      method === "email"
        ? LOGIN_WITH_EMAIL_MUTATION
        : LOGIN_WITH_USERNAME_MUTATION;

    return await client
      .mutate({
        mutation,
        variables: { [method]: usernameOrEmail, password },
      })
      .then((res) => {
        if (res.data.login.success) {
          localStorage.setItem("token", res.data.login.token);
          localStorage.setItem("refreshToken", res.data.login.refreshToken);
          dispatch(actionStates.login());
        }
        return res;
      })
      .catch((err) => err);
  };

export const trySignup = (email, username, password) => async (dispatch) => {
  return await client
    .mutate({
      mutation: SIGNUP_MUTATION,
      variables: { email, username, password },
    })
    .then((res) => {
      if (res.data.signup.success) {
        localStorage.setItem("token", res.data.signup.token);
        localStorage.setItem("refreshToken", res.data.signup.refreshToken);
        dispatch(actionStates.login());
      }
      return res;
    })
    .catch((err) => err);
};

export const tryLogout = () => (dispatch) => {
  client
    .mutate({
      mutation: REVOKE_TOKEN_MUTATION,
      variables: { refreshToken: localStorage.getItem("refreshToken") },
    })
    .then((res) => res)
    .catch((err) => err);
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  dispatch(actionStates.logout());
  dispatch(actionStates.resetNotifsList());
  dispatch(actionStates.resetToastNotifications());
  client.clearStore();
};
