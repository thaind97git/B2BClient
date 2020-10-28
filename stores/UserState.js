import { makeFetchAction } from "redux-api-call";
import { respondToSuccess } from "../middlewares/api-reaction";
import nfetch from "../libs/nfetch";
import { saveToken } from "../libs/localStorage";
import { ADMIN, BUYER, MODERATOR, SUPPLIER } from "../enums/accountRoles";
import { getResetter } from "../libs";
import Router from "next/router";
import { openNotification } from "../utils";
const GET_CURRENT_USER = "GetCurrentUserAPI";
export const USER_LOGIN = "UserLoginAPI";
export const USER_REGISTER = "UserRegisterAPI";

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
      const returnUrl = Router.query["returnUrl"];
      if (resp.role === BUYER) {
        if (!!returnUrl && returnUrl.includes("/buyer/rfq/create")) {
          Router.push(returnUrl);
        } else {
          Router.push("/buyer/rfq");
        }
      }
      if (resp.role === SUPPLIER) {
        if (!!returnUrl && returnUrl.includes("/supplier")) {
          Router.push(returnUrl);
        } else {
          Router.push("/supplier/chat");
        }
      }
      if (resp.role === ADMIN) {
        if (!!returnUrl && returnUrl.includes("/admin")) {
          Router.push(returnUrl);
        } else {
          Router.push("/admin/product");
        }
      }
      if (resp.role === MODERATOR) {
        if (returnUrl && returnUrl.includes("/aggregator")) {
          Router.push(returnUrl);
        } else {
          Router.push("/aggregator/request");
        }
      }
    }
  });

export const userLoginDataSelector = UserLoginAPI.dataSelector;
export const userLoginDataErrorSelector = UserLoginAPI.errorSelector;
export const userLoginResetter = getResetter(UserLoginAPI);

export const verifyScopeAndRole = (scope, role) => {
  if (scope === "buyer" && role === BUYER) {
    return true;
  } else if (scope === "supplier" && role === SUPPLIER) {
    return true;
  } else if (scope === "aggregator" && role === MODERATOR) {
    return true;
  } else if (scope === "admin" && role === ADMIN) {
    return true;
  } else {
    return false;
  }
};

export const GetCurrentUserAPI = makeFetchAction(
  GET_CURRENT_USER,
  nfetch({
    endpoint: "/api/Account/Self",
    method: "GET",
  })
);

export const getCurrentUser = ({ scope, isVerify = true }) =>
  respondToSuccess(GetCurrentUserAPI.actionCreator(), (resp) => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    if (isVerify && scope) {
      if (!verifyScopeAndRole(scope, resp.role)) {
        Router.push(
          `/login?returnUrl=${Router.pathname}${window.location.search}`
        );
      }
    }

    return;
  });

export const CurrentUserData = GetCurrentUserAPI.dataSelector;
export const CurrentUserError = GetCurrentUserAPI.errorSelector;
export const CurrentUserResetter = getResetter(GetCurrentUserAPI);

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

export default {};
