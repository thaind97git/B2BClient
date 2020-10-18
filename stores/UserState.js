import { makeFetchAction } from "redux-api-call";
import { respondToSuccess } from "../middlewares/api-reaction";
import nfetch from "../libs/nfetch";
import { saveToken } from "../libs/localStorage";
import { ADMIN, BUYER, MODERATOR, SUPPLIER } from "../enums/accountRoles";
import { getResetter } from "../libs";
import Router from "next/router";
import { openNotification } from "../utils";
const GET_CURRENT_USER = "GetCurrentUserAPI";
const USER_LOGIN = "UserLoginAPI";
const USER_REGISTER = "UserRegisterAPI";

//Login
export const UserLoginAPI = makeFetchAction(USER_LOGIN, ({ email, password }) =>
  nfetch({
    endpoint: "/api/Account/Auth",
  })({ email, password })
);

export const userLogin = ({ email, password }) =>
  respondToSuccess(UserLoginAPI.actionCreator({ email, password }), (resp) => {
    if (resp.token) {
      saveToken(resp.token);
      openNotification("success", { message: "Login success" });
      const returnUrl = Router.query["returnUrl"];
      if (resp.role === BUYER) {
        if (!!returnUrl && returnUrl === "/buyer/rfq/create") {
          Router.push(returnUrl);
        } else {
          Router.push("/buyer/rfq");
        }
      }
      if (resp.role === SUPPLIER) {
        if (!!returnUrl && returnUrl === "/supplier") {
          Router.push(returnUrl);
        } else {
          Router.push("/supplier/chat");
        }
      }
      if (resp.role === ADMIN) {
        Router.push("/admin/product");
      }
      if (resp.role === MODERATOR) {
        Router.push("/aggregator/request");
      }
    }
  });

export const userLoginDataSelector = UserLoginAPI.dataSelector;
export const userLoginDataErrorSelector = UserLoginAPI.errorSelector;
export const userLoginResetter = getResetter(UserLoginAPI);

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

export const verifyScopeAndRoleAdmin = (user) => {
  if (!user) {
    return false;
  }

  return user.systemUserRole;
};

export const verifyScopeAndRoleSupplier = (user) => {
  if (!user) {
    return false;
  }

  return user.systemUserRole;
};

export const verifyScopeAndRoleBuyer = (user) => {
  if (!user) {
    return false;
  }

  return user.systemUserRole;
};

// Register
const UserRegisterAPI = makeFetchAction(USER_REGISTER, (object) =>
  nfetch({
    endpoint: "/api/Account",
  })(object)
);

export const userRegister = (object) =>
  respondToSuccess(UserRegisterAPI.actionCreator(object), (resp) => {
    if (resp) {
      console.log({ resp });
      openNotification("success", { message: "Register success" });
      Router.push("/login");
    }
  });

export const userRegisterDataSelector = UserRegisterAPI.dataSelector;
export const userRegisterErrorSelector = UserRegisterAPI.errorSelector;
export const userRegisterResetter = getResetter(UserRegisterAPI);
