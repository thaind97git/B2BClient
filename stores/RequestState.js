import { makeFetchAction } from "redux-api-call";
import { respondToSuccess } from "../middlewares/api-reaction";
import nfetch from "../libs/nfetch";
import { getResetter, generateQuery } from "../libs";
import Router from "next/router";
import { R_PENDING } from "../enums/requestStatus";
import { openNotification } from "../utils";

const CREATE_REQUEST = "CreateRequestAPI";
const GET_REQUEST_PAGING = "GetRequestPagingAPI";
const GET_REQUEST_DETAILS = "GetRequestDetailsAPI";
export const CANCEL_REQUEST = "CancelRequestAPI";
export const REJECT_REQUEST = "RejectRequestAPI";
const UPDATE_REQUEST = "UpdateRequestAPI";
const GET_REQUEST_BY_GROUP_ID = "GetRequestByGroupIdAPI";
const GET_REQUEST_SUGGEST_BY_PRODUCT_ID = "GetRequestSuggestByProductIdAPI";

// Create new Request
const CreateRequestAPI = makeFetchAction(CREATE_REQUEST, (object) =>
  nfetch({
    endpoint: "/api/Request",
  })(object)
);

export const createRequest = (object) =>
  respondToSuccess(CreateRequestAPI.actionCreator(object), (resp) => {
    if (resp) {
      Router.push("/buyer/rfq");
    }
  });
export const CreateRequestData = CreateRequestAPI.dataSelector;
export const CreateRequestError = CreateRequestAPI.errorSelector;
export const CreateRequestResetter = getResetter(CreateRequestAPI);

// Get Request Paging
const GetRequestPagingAPI = makeFetchAction(
  GET_REQUEST_PAGING,
  ({ status = [], productTitle, fromDate, toDate, pageIndex, pageSize }) => {
    return nfetch({
      endpoint: `/api/Request/Filter?${
        status && status.length > 0 ? "statuses=" + status.join(",") + "&" : ""
      }${productTitle && "productName=" + productTitle + "&"}${
        fromDate ? "fromDate=" + fromDate + "&" : ""
      }${
        toDate ? "toDate=" + toDate + "&" : ""
      }pageIndex=${pageIndex}&pageSize=${pageSize}&dateDescending=true`,
      method: "GET",
    })();
  }
);

export const getRequestPaging = ({
  status = [],
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

// Cancel Request
const RejectRequestAPI = makeFetchAction(REJECT_REQUEST, (id, desc) =>
  nfetch({
    endpoint: `/api/Request/Reject`,
    method: "DELETE",
  })({
    id,
    description: desc,
  })
);

export const rejectRequest = (id, desc) =>
  respondToSuccess(
    RejectRequestAPI.actionCreator(id, desc),
    (resp, _, store) => {
      store.dispatch(
        getRequestPaging({
          status: [R_PENDING],
          productTitle: "",
          pageIndex: 1,
          pageSize: 10,
        })
      );
    }
  );
export const RejectRequestData = RejectRequestAPI.dataSelector;
export const RejectRequestError = RejectRequestAPI.errorSelector;

export const RejectRequestResetter = getResetter(RejectRequestAPI);

// Update Request
const UpdateRequestAPI = makeFetchAction(UPDATE_REQUEST, (object) =>
  nfetch({
    endpoint: "/api/Request",
    method: "PUT",
  })(object)
);

export const updateRequest = (object) =>
  respondToSuccess(UpdateRequestAPI.actionCreator(object), (resp) => {
    if (resp) {
      openNotification("success", { message: "Update request success!" });
      Router.push("/buyer/rfq");
    }
  });
export const UpdateRequestData = UpdateRequestAPI.dataSelector;
export const UpdateRequestError = UpdateRequestAPI.errorSelector;
export const UpdateRequestResetter = getResetter(UpdateRequestAPI);

// Get Request By Group Id
const GetRequestByGroupIdAPI = makeFetchAction(
  GET_REQUEST_BY_GROUP_ID,
  (groupId) =>
    nfetch({
      endpoint: `/api/Group/Requests?groupId=${groupId}`,
      method: "GET",
    })()
);

export const getRequestByGroupId = (groupId) =>
  respondToSuccess(GetRequestByGroupIdAPI.actionCreator(groupId));
export const getRequestByGroupIdData = GetRequestByGroupIdAPI.dataSelector;
export const getRequestByGroupIdError = GetRequestByGroupIdAPI.errorSelector;
export const getRequestByGroupIdResetter = getResetter(GetRequestByGroupIdAPI);

// Get Request By Product Id
const GetRequestSuggestByProductIdAPI = makeFetchAction(
  GET_REQUEST_SUGGEST_BY_PRODUCT_ID,
  ({ statuses = [R_PENDING], productId, pageIndex, pageSize }) =>
    nfetch({
      endpoint: `/api/Request/Filter${generateQuery({
        statuses,
        productId,
        pageIndex,
        pageSize,
      })}`,
      method: "GET",
    })()
);

export const getRequestSuggestByProductId = ({
  productId,
  pageIndex,
  pageSize,
}) =>
  respondToSuccess(
    GetRequestSuggestByProductIdAPI.actionCreator({
      productId,
      pageIndex,
      pageSize,
    })
  );
export const getRequestSuggestByProductIdData =
  GetRequestSuggestByProductIdAPI.dataSelector;
export const getRequestSuggestByProductIdError =
  GetRequestSuggestByProductIdAPI.errorSelector;
export const getRequestSuggestByProductIdResetter = getResetter(
  GetRequestSuggestByProductIdAPI
);
