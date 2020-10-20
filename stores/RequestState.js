import { makeFetchAction } from "redux-api-call";
import { respondToSuccess } from "../middlewares/api-reaction";
import nfetch from "../libs/nfetch";
import { getResetter } from "../libs";
import Router from "next/router";

const CREATE_REQUEST = "CreateRequestAPI";
const GET_REQUEST_PAGING = "GetRequestPagingAPI";
const GET_REQUEST_DETAILS = "GetRequestDetailsAPI";
const CANCEL_REQUEST = "CancelRequestAPI";

// Create new Request
const CreateRequestAPI = makeFetchAction(CREATE_REQUEST, (object) =>
  nfetch({
    endpoint: "/api/Request",
  })(object)
);

export const createRequest = (object) =>
  respondToSuccess(CreateRequestAPI.actionCreator(object), (resp) => {
    if (resp) {
      console.log("xxxx");
      Router.push("/buyer/rfq");
    }
  });
export const CreateRequestData = CreateRequestAPI.dataSelector;
export const CreateRequestError = CreateRequestAPI.errorSelector;
export const CreateRequestResetter = getResetter(CreateRequestAPI);

// Get Request Paging
const GetRequestPagingAPI = makeFetchAction(
  GET_REQUEST_PAGING,
  ({ status, productTitle, fromDate, toDate, pageIndex, pageSize }) => {
    return nfetch({
      endpoint: `/api/Request/Filter?${
        status ? "statusId=" + status + "&" : ""
      }${productTitle && "productTitle=" + productTitle + "&"}${
        fromDate ? "fromDate=" + fromDate + "&" : ""
      }${
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

// Cancel Request

const CancelRequestAPI = makeFetchAction(CANCEL_REQUEST, (id, desc) =>
  nfetch({
    endpoint: `/api/Request/Cancel`,
    method: "DELETE",
  })({
    id,
    description: desc,
  })
);

export const cancelRequest = (id, desc) =>
  respondToSuccess(
    CancelRequestAPI.actionCreator(id, desc),
    (resp, _, store) => {
      store.dispatch(
        getRequestPaging({
          status: "",
          productTitle: "",
          pageIndex: 1,
          pageSize: 10,
        })
      );
    }
  );
export const CancelRequestData = CancelRequestAPI.dataSelector;
export const CancelRequestError = CancelRequestAPI.errorSelector;

export const CancelRequestResetter = getResetter(CancelRequestAPI);
