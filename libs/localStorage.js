import { isServer } from "../utils";

const TOKEN_NAME = "_ut";

export const saveToken = (token) =>
  !isServer && token ? localStorage.setItem(TOKEN_NAME, token) : null;
export const getToken = () =>
  !isServer ? localStorage.getItem(TOKEN_NAME) : null;
export const removeToken = () =>
  !isServer ? localStorage.removeItem(TOKEN_NAME) : null;
