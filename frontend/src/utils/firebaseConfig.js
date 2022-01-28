import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { REST_URL } from "./urls";
import axios from "axios";
import jwtDecode from "jwt-decode";

var firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const firebase = initializeApp(firebaseConfig);

const messaging = getMessaging();

getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY })
  .then((currentToken) => {
    if (!currentToken) {
      console.log(
        "No registration token available. Request permission to generate one."
      );
      return;
    }

    const accessToken = localStorage.getItem("token");
    if (accessToken === null) return;
    const { username } = jwtDecode(accessToken);
    const url = `${REST_URL.FCM_TOKEN}${username}`;
    axios
      .post(url, { token: currentToken })
      .then((res) => res)
      .catch((err) => err);
  })
  .catch((err) => err);

export default firebase;
