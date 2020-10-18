import { makeFetchAction } from "redux-api-call";

import { respondToSuccess } from "../middlewares/api-reaction";
import nfetch from "../libs/nfetch";
import { getResetter } from "../libs";

const CREATE_REQUEST = "CreateRequestAPI";
const GET_REQUEST_PAGING = "GetRequestPagingAPI";

// Get Sourcing Type
const CreateRequestAPI = makeFetchAction(CREATE_REQUEST, (object) =>
  nfetch({
    endpoint: "/api/Request",
  })(object)
);

export const createRequest = () =>
  respondToSuccess(CreateRequestAPI.actionCreator());

export const CreateRequestData = CreateRequestAPI.dataSelector;
export const CreateRequestError = CreateRequestAPI.errorSelector;
export const CreateRequestResetter = getResetter(CreateRequestAPI);

// Get Sourcing Type
// const GetRequestPagingAPI = makeFetchAction(CREATE_REQUEST, ({pageIndex, pageSize, }) =>
//   nfetch({
//     endpoint: "/api/Request",
//   })(object)
// );

// export const getRequestPaging = () =>
//   respondToSuccess(GetRequestPagingAPI.actionCreator());

// export const GetRequestPagingData = GetRequestPagingAPI.dataSelector;
// export const GetRequestPagingError = GetRequestPagingAPI.errorSelector;
// export const GetRequestPagingResetter = getResetter(GetRequestPagingAPI);
