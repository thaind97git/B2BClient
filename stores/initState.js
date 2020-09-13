import { SUPPLIER } from "../enums/accountRoles";

export default {
  isLogged: (state = true) => {
    return state;
  },
  role: (state = SUPPLIER) => {
    return state;
  },
};
