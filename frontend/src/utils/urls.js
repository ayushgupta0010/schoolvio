export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

export const GRAPHQL_URL = BACKEND_URL + "graphql/";

export const REST_URL = {
  COUNT_USERS: BACKEND_URL + "rest/count",

  FCM_TOKEN: BACKEND_URL + "rest/fcmToken/",

  PEOPLE: BACKEND_URL + "rest/people/",

  SEARCH_BY_NAME: BACKEND_URL + "rest/search/byName/",

  SEARCH_BY_USERNAME: BACKEND_URL + "rest/search/byUsername/",

  SEARCH_BY_QUESTION: BACKEND_URL + "rest/search/byQuestion/",

  SEARCH_IN_SPECIFIC_SCHOOL: BACKEND_URL + "rest/search/inSpecific/",
};

export const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;
