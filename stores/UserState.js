import { makeFetchAction } from 'redux-api-call';
import { respondToSuccess } from '../middlewares/api-reaction';
import nfetch from '../libs/nfetch';
import { saveToken } from '../libs/localStorage';
import { ADMIN, BUYER, MODERATOR, SUPPLIER } from '../enums/accountRoles';
import { getToken } from '../libs/localStorage';
import { getResetter } from '../libs';
import Router from 'next/router';
import { openNotification } from '../utils';
const GET_CURRENT_USER = 'GetCurrentUserAPI';
export const USER_LOGIN = 'UserLoginAPI';
export const USER_REGISTER = 'UserRegisterAPI';
export const USER_UPLOAD_AVATAR = 'UserUploadAvatarAPI';
export const USER_UPDATE_PASSWORD = 'UserUpdatePasswordAPI';
export const USER_ACTIVE_CODE = 'UserActiveCodeAPI';
export const USER_UPDATE_PASSWORD_BY_CODE = 'UserUpdatePasswordByCodeAPI';
const GET_USER = 'GetUserAPI';

export const checkMessageLogin = (errorSelector) => {
  if (errorSelector && errorSelector.includes('banned')) {
    Router.push('/banned');
  }
};

//Login
export const UserLoginAPI = makeFetchAction(USER_LOGIN, ({ email, password }) =>
  nfetch({
    endpoint: '/api/Account/Auth'
  })({ email, password })
);

export const userLogin = ({ email, password }) =>
  respondToSuccess(UserLoginAPI.actionCreator({ email, password }), (resp) => {
    if (resp.token) {
      saveToken(resp.token);
      const returnUrl = Router.query['returnUrl'];
      if (resp.role === BUYER) {
        if (!!returnUrl && returnUrl.includes('/buyer/rfq/create')) {
          Router.push(returnUrl);
        } else {
          Router.push('/buyer/rfq');
        }
      }
      if (resp.role === SUPPLIER) {
        if (!!returnUrl && returnUrl.includes('/supplier')) {
          Router.push(returnUrl);
        } else {
          Router.push('/supplier');
        }
      }
      if (resp.role === ADMIN) {
        if (!!returnUrl && returnUrl.includes('/admin')) {
          Router.push(returnUrl);
        } else {
          Router.push('/admin');
        }
      }
      if (resp.role === MODERATOR) {
        if (returnUrl && returnUrl.includes('/aggregator')) {
          Router.push(returnUrl);
        } else {
          Router.push('/aggregator');
        }
      }
    }
  });

export const userLoginDataSelector = UserLoginAPI.dataSelector;
export const userLoginDataErrorSelector = UserLoginAPI.errorSelector;
export const userLoginResetter = getResetter(UserLoginAPI);

export const verifyScopeAndRole = (scope, role) => {
  if (scope === 'buyer' && role === BUYER) {
    return true;
  } else if (scope === 'supplier' && role === SUPPLIER) {
    return true;
  } else if (scope === 'aggregator' && role === MODERATOR) {
    return true;
  } else if (scope === 'admin' && role === ADMIN) {
    return true;
  } else {
    return false;
  }
};

export const GetCurrentUserAPI = makeFetchAction(
  GET_CURRENT_USER,
  nfetch({
    endpoint: '/api/Account/Self',
    method: 'GET'
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
    endpoint: '/api/Account'
  })(object)
);

export const userRegister = (object) =>
  respondToSuccess(UserRegisterAPI.actionCreator(object), (resp) => {
    if (resp) {
      console.log({ resp });
      // openNotification('success', { message: 'Register success' });
      Router.push('/login');
    }
  });

export const userRegisterDataSelector = UserRegisterAPI.dataSelector;
export const userRegisterErrorSelector = UserRegisterAPI.errorSelector;
export const userRegisterResetter = getResetter(UserRegisterAPI);

export default {};

//Update Avatar
export const UserUploadAvatarAPI = makeFetchAction(
  USER_UPLOAD_AVATAR,
  (object) => {
    const listFileOrigin = object.map((file) => file.originFileObj);
    const formData = new FormData();
    for (let file of listFileOrigin) {
      formData.append('file', file);
    }

    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getToken()}`);
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: formData
    };

    fetch(`${process.env.API_SERVER_URL}/api/Account/Avatar`, requestOptions);
  }
);
export const userUploadAvatar = (object) =>
  respondToSuccess(UserUploadAvatarAPI.actionCreator(object), (resp) => {
    if (resp) {
      openNotification('success', { message: 'Upload Avatar success' });
    }
  });
//Update Password
const UserUpdatePasswordAPI = makeFetchAction(
  USER_UPDATE_PASSWORD,
  ({ oldPassword, newPassword }) => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getToken()}`);
    myHeaders.append('Content-Type', `application/json`);
    console.log(oldPassword + ' ' + newPassword);
    const formData = { oldPassword: oldPassword, newPassword: newPassword };
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(formData)
    };
    fetch(`${process.env.API_SERVER_URL}/api/Account/Password`, requestOptions);
  }
);

export const userUpdatePassword = ({ oldPassword, newPassword }) =>
  respondToSuccess(
    UserUpdatePasswordAPI.actionCreator({ oldPassword, newPassword }),
    (resp) => {
      if (resp) {
        openNotification('success', { message: 'Update password success!' });
      }
    }
  );
export const UserUpdatePasswordData = UserUpdatePasswordAPI.dataSelector;
export const UserUpdatePasswordError = UserUpdatePasswordAPI.errorSelector;
export const UserUpdatePasswordResetter = getResetter(UserUpdatePasswordAPI);

//Get Activate Code
const UserActiveCodeAPI = makeFetchAction(USER_ACTIVE_CODE, (email) =>
  nfetch({
    endpoint: `/api/Account/ActiveCode/${email}`,
    method: 'GET'
  })()
);

export const userActiveCode = (email) =>
  respondToSuccess(UserActiveCodeAPI.actionCreator(email), (resp) => {
    if (resp) {
      Router.push(`/refresh-password?email=${email}`);
    }
  });
export const userActiveCodeData = UserActiveCodeAPI.dataSelector;
export const userActiveCodeError = UserActiveCodeAPI.errorSelector;
export const userActiveCodeResetter = getResetter(UserActiveCodeAPI);

//Update password by Code
const UserUpdatePasswordByCodeAPI = makeFetchAction(
  USER_UPDATE_PASSWORD_BY_CODE,
  ({ email, password, code }) =>
    nfetch({
      endpoint: '/api/Account/UpdatePasswordByCode',
      method: 'PUT'
    })({ email, password, code })
);

export const userUpdatePasswordByCode = ({ email, password, code }) =>
  respondToSuccess(
    UserUpdatePasswordByCodeAPI.actionCreator({ email, password, code }),
    (resp) => {
      if (resp) {
        Router.push('/login');
      }
    }
  );
export const userUpdatePasswordByCodeData =
  UserUpdatePasswordByCodeAPI.dataSelector;
export const userUpdatePasswordByCodeError =
  UserUpdatePasswordByCodeAPI.errorSelector;
export const userUpdatePasswordByCodeResetter = getResetter(
  UserUpdatePasswordByCodeAPI
);

//Get User
const GetUserAPI = makeFetchAction(GET_USER, ({ id }) =>
  nfetch({
    endpoint: `/api/Account/${id}`,
    method: 'GET'
  })()
);

export const getUser = (id) =>
  respondToSuccess(GetUserAPI.actionCreator({ id }));
export const getUserData = GetUserAPI.dataSelector;
export const getUserError = GetUserAPI.errorSelector;
export const getUserResetter = getResetter(GetUserAPI);
