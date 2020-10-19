import { makeFetchAction } from "redux-api-call";
import {
  respondToFailure,
  respondToSuccess,
} from "../middlewares/api-reaction";
import nfetch from "../libs/nfetch";
import { getResetter } from "../libs";
import { openNotification } from "../utils";

const CREATE_REQUEST = "CreateRequestAPI";
const GET_REQUEST_PAGING = "GetRequestPagingAPI";
const GET_REQUEST_DETAILS = "GetRequestDetailsAPI";

// Create new Request
const CreateRequestAPI = makeFetchAction(CREATE_REQUEST, (object) =>
  nfetch({
    endpoint: "/api/Request",
  })(object)
);

export const createRequest = (object) =>
  respondToFailure(CreateRequestAPI.actionCreator(object), (resp) => {
    // if (resp) {
    //   Router.push("buyer/rfq");
    // }
    openNotification("error", { message: "Create new request fail" });
  });
export const CreateRequestData = CreateRequestAPI.dataSelector;
export const CreateRequestError = CreateRequestAPI.errorSelector;
export const CreateRequestResetter = getResetter(CreateRequestAPI);

// Get Request Paging
const GetRequestPagingAPI = makeFetchAction(
  GET_REQUEST_PAGING,
  ({ status, productTitle, fromDate, toDate, pageIndex, pageSize }) => {
    return nfetch({
      endpoint: `/api/Request/Filter?${status ? "status=" + status + "&" : ""}${
        productTitle && "productTitle=" + productTitle + "&"
      }${fromDate ? "fromDate=" + fromDate + "&" : ""}${
        toDate ? "toDate=" + toDate + "&" : ""
      }pageIndex=${pageIndex}&pageSize=${pageSize}&dateDescending=true`,
      method: "GET",
    })();
  }
);

export const getRequestPaging = ({
  status,
  productTitle,
  fromDate,
  toDate,
  pageIndex,
  pageSize,
}) =>
  respondToSuccess(
    GetRequestPagingAPI.actionCreator({
      status,
      productTitle,
      fromDate,
      toDate,
      pageIndex,
      pageSize,
    }),
    () => {}
  );

export const GetRequestPagingData = GetRequestPagingAPI.dataSelector;
export const GetRequestPagingError = GetRequestPagingAPI.errorSelector;
export const GetRequestPagingResetter = getResetter(GetRequestPagingAPI);

// Get Request Details
const GetRequestDetailsAPI = makeFetchAction(GET_REQUEST_DETAILS, (requestId) =>
  nfetch({
    endpoint: `/api/Request/${requestId}`,
    method: "GET",
  })()
);

export const getRequestDetails = (requestId) =>
  respondToSuccess(
    GetRequestDetailsAPI.actionCreator(requestId),
    (resp, _, store) => {}
  );
export const GetRequestDetailsDataSelector = GetRequestDetailsAPI.dataSelector;
export const GetRequestDetailsErrorSelector =
  GetRequestDetailsAPI.errorSelector;

export const getRequestDetailsResetter = getResetter(GetRequestDetailsAPI);
