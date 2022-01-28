import { combineReducers } from "redux";
import authReducer from "./authReducer";
import notifReducer from "./notifReducer";
import toastReducer from "./toastNotifReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  notifs: notifReducer,
  toasts: toastReducer,
});

export default rootReducer;
