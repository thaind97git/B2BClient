import { notification } from "antd";
import { isAntdPro } from "./utils";
import Router from "next/router";

const codeMessage = {
  200: "The server successfully returned the requested data. ",
  201: "Create or modify data successfully. ",
  202: "A request has entered the background queue (asynchronous task). ",
  204: "Delete data successfully. ",
  400: "There is an error in the request sent, and the server did not create or modify data. ",
  401: "The user does not have permission (the token, username, password are wrong). ",
  403: "The user is authorized, but access is forbidden. ",
  404: "The request sent is for a record that does not exist, and the server is not operating. ",
  406: "The requested format is not available. ",
  410: "The requested resource has been permanently deleted and will no longer be available. ",
  422: "When creating an object, a validation error occurred. ",
  500: "An error occurred in the server, please check the server. ",
  502: "Gateway error. ",
  503: "The service is unavailable, the server is temporarily overloaded or maintained. ",
  504: "The gateway has timed out. ",
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then((content) => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(
  url,
  options = {
    expirys: isAntdPro(),
  }
) {
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */

  const defaultOptions = {
    credentials: "include",
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === "POST" ||
    newOptions.method === "PUT" ||
    newOptions.method === "DELETE"
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: "application/json",
        ...newOptions.headers,
      };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(cachedSave)
    .then((response) => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === "DELETE" || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch((e) => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: "login/logout",
        });
        return;
      }
      // environment should not be used
      if (status === 403) {
        Router.push("/exception/403");
        return;
      }
      if (status <= 504 && status >= 500) {
        Router.push("/exception/500");
        return;
      }
      if (status >= 404 && status < 422) {
        Router.push("/exception/404");
      }
    });
}
