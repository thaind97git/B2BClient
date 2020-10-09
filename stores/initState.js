import { SUPPLIER } from "../enums/accountRoles";
export const CURRENT_REQUEST_CATEGORY_ID_SELECTED =
  "CURRENT_REQUEST_CATEGORY_ID_SELECTED";
export const ADD_CATEGORY_SELECTED = "ADD_CATEGORY_SELECTED";
export const SET_CATEGORY_SELECTED = "SET_CATEGORY_SELECTED";

export default {
  isLogged: (state = true) => {
    return state;
  },
  role: (state = SUPPLIER) => {
    return state;
  },
  currentRequestCategoryIdSelected: (state = "", { type, payload }) => {
    if (type === CURRENT_REQUEST_CATEGORY_ID_SELECTED) {
      return payload || "";
    }
    return state;
  },
  categorySelected: (state = [], { type, payload = {} }) => {
    if (type === ADD_CATEGORY_SELECTED && !!payload) {
      return [...state, payload];
    }
    if (type === SET_CATEGORY_SELECTED && !!payload) {
      return [...payload] || [];
    }
    return state;
  },
};
