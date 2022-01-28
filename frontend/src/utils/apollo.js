import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { tryLogout } from "../redux/actions/actionCreators";
import { GRAPHQL_URL } from "./urls";
import store from "../redux/store";
import axios from "axios";
import jwtDecode from "jwt-decode";

const uri = GRAPHQL_URL;

const query = `
mutation RefreshToken($refreshToken: String!) {
  getToken: refreshToken(refreshToken: $refreshToken) {
    token
    refreshToken
    success
    errors
  }
  revokeToken(refreshToken: $refreshToken) {
    revoked
  }
}
`;

const httpLink = new HttpLink({ uri });

const authMiddleware = setContext(async (_, { headers }) => {
  var token = localStorage.getItem("token");
  if (token) {
    const { exp } = jwtDecode(token);
    const expirationTime = exp * 1000 - 60000;
    if (Date.now() >= expirationTime) {
      await axios
        .post(uri, {
          query,
          variables: { refreshToken: localStorage.getItem("refreshToken") },
        })
        .then((res) => {
          if (!res.data.data.getToken.success) store.dispatch(tryLogout());
          else {
            localStorage.setItem("token", res.data.data.getToken.token);
            localStorage.setItem(
              "refreshToken",
              res.data.data.getToken.refreshToken
            );
          }
        })
        .catch((err) => err);
    }
  }

  return {
    headers: {
      ...headers,
      Authorization: token ? `JWT ${token}` : null,
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authMiddleware.concat(httpLink),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

export default client;
