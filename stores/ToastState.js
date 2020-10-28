import { get } from "lodash/fp";
import { ACTIONS } from "redux-api-call";
import { openNotification } from "../utils";
import { ADD_REQUEST_TO_GROUP, CREATE_NEW_GROUP } from "./GroupState";
import { USER_LOGIN, USER_REGISTER } from "./UserState";
const hasErrors = get("json.errors");

export default {
  displayNotify(state = {}, { type, payload = {} }) {
    const { name } = payload;
    let msgNotify = "";
    if (type === ACTIONS.COMPLETE) {
      switch (name) {
        case USER_LOGIN:
          msgNotify = "Login success";
          break;
        case USER_REGISTER:
          msgNotify = "Register success";
          break;
        case ADD_REQUEST_TO_GROUP:
          msgNotify = "Add Request to Group success";
          break;
        case CREATE_NEW_GROUP:
          msgNotify = "Create new Group success";
          break;
        default:
          break;
      }
      msgNotify && openNotification("success", { message: msgNotify });
      return payload;
    } else if (type === ACTIONS.FAILURE) {
      switch (name) {
        case USER_LOGIN:
          msgNotify = "Login fail";
          break;
        case USER_REGISTER:
          msgNotify = "Register fail";
          break;
        case ADD_REQUEST_TO_GROUP:
          msgNotify = "Add Request to Group fail";
          break;
        case CREATE_NEW_GROUP:
          msgNotify = "Create new Group fail";
          break;
        default:
          break;
      }
      msgNotify && openNotification("error", { message: msgNotify });
      return payload;
    }
    return state;
  },
};
