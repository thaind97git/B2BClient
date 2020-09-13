import { makeFetchAction } from "redux-api-call";
import { respondToSuccess } from "../middlewares/api-reaction";
import nfetch from "../libs/nfetch";
const Get_CURRENT_USER = "GetCurrentUserAPI";

export const GetCurrentUserAPI = makeFetchAction(
  Get_CURRENT_USER,
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
