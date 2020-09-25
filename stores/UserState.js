import { makeFetchAction } from "redux-api-call";
import { respondToSuccess } from "../middlewares/api-reaction";
import nfetch from "../libs/nfetch";
const GET_CURRENT_USER = "GetCurrentUserAPI";
const USER_LOGIN = "UserLoginAPI";

export const UserLoginAPI = makeFetchAction(USER_LOGIN, ({ email, password }) =>
  nfetch({
    endpoint: "/api/Account/Auth",
  })({ email, password })
);

export const userLogin = ({ email, password }) =>
  respondToSuccess(UserLoginAPI.actionCreator({ email, password }), (resp) => {
    console.log(resp);
  });

export const userLoginDataSelector = UserLoginAPI.dataSelector;

export const GetCurrentUserAPI = makeFetchAction(
  GET_CURRENT_USER,
  nfetch({
    endpoint: "/abc",
  })
);

export const getCurrentUser = () =>
  respondToSuccess(GetCurrentUserAPI.actionCreator(), (resp) => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    return;
  });

export const GetCurrentUserDataSelector = GetCurrentUserAPI.dataSelector;
