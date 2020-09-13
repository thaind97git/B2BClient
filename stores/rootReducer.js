import { reducers as apiReducers } from "redux-api-call";
import { combineReducers } from "redux";
import initState from "./initState";

export default combineReducers({
  ...apiReducers,
  ...initState,
});
