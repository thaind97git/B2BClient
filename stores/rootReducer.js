import { reducers as apiReducers } from "redux-api-call";
import { combineReducers } from "redux";
import initState from "./initState";
import toastState from "./ToastState";

export default combineReducers({
  ...apiReducers,
  ...initState,
  ...toastState,
  // ...userState,
});
