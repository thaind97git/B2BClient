import { makeFetchAction } from 'redux-api-call';
import { respondToSuccess } from '../middlewares/api-reaction';
import nfetch from '../libs/nfetch';
import { getResetter, generateQuery } from '../libs';
import Router from 'next/router';
import { R_PENDING } from '../enums/requestStatus';
import { openNotification } from '../utils';

const CREATE_REQUEST = 'CreateRequestAPI';
const GET_REQUEST_PAGING = 'GetRequestPagingAPI';
const GET_REQUEST_PAGING_BY_PRODUCT = 'GetRequestPagingByProductAPI';
const GET_REQUEST_DETAILS = 'GetRequestDetailsAPI';
export const CANCEL_REQUEST = 'CancelRequestAPI';
export const REJECT_REQUEST = 'RejectRequestAPI';
const UPDATE_REQUEST = 'UpdateRequestAPI';
const GET_REQUEST_BY_GROUP_ID = 'GetRequestByGroupIdAPI';
const GET_REQUEST_SUGGEST_BY_PRODUCT_ID = 'GetRequestSuggestByProductIdAPI';
const GET_REQUEST_GROUP_BY = 'GetRequestGroupByAPI';
const GET_REQUEST_CANCELED_BY_USER = 'GetRequestCanceledByUserAPI';
const CHECK_DUPLICATE = 'CheckDuplicateAPI';

// Create new Request
const CreateRequestAPI = makeFetchAction(CREATE_REQUEST, (object) =>
  nfetch({
    endpoint: '/api/Request'
  })(object)
);

export const createRequest = (object) =>
  respondToSuccess(CreateRequestAPI.actionCreator(object), (resp) => {
    if (resp) {
      Router.push('/buyer/rfq');
    }
  });
export const CreateRequestData = CreateRequestAPI.dataSelector;
export const CreateRequestError = CreateRequestAPI.errorSelector;
export const CreateRequestResetter = getResetter(CreateRequestAPI);

// Check Duplicate RFQ
const CheckDuplicateAPI = makeFetchAction(CHECK_DUPLICATE, (productId) =>
  nfetch({
    endpoint: `/api/Request/CheckDuplicateRequest?productId=${productId}`,
    method: 'GET'
  })()
);

export const checkDuplicate = (productId) =>
  respondToSuccess(CheckDuplicateAPI.actionCreator(productId));
export const CheckDuplicateData = CheckDuplicateAPI.dataSelector;
export const CheckDuplicateError = CheckDuplicateAPI.errorSelector;
export const CheckDuplicateResetter = getResetter(CheckDuplicateAPI);

// Get Request Paging
const GetRequestPagingAPI = makeFetchAction(
  GET_REQUEST_PAGING,
  ({
    status = [],
    productTitle,
    fromDate,
    toDate,
    pageIndex,
    pageSize,
    category,
    productId
  }) => {
    return nfetch({
      endpoint: `/api/Request/Filter${generateQuery({
        statuses: status,
        productName: productTitle,
        fromDate,
        toDate,
        pageIndex,
        pageSize,
        dateDescending: true,
        categoryId: category,
        productId
      })}`,
      method: 'GET'
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
  category,
  productId
}) =>
  respondToSuccess(
    GetRequestPagingAPI.actionCreator({
      status,
      productTitle,
      fromDate,
      toDate,
      pageIndex,
      pageSize,
      category,
      productId
    }),
    () => {}
  );

export const GetRequestPagingData = GetRequestPagingAPI.dataSelector;
export const GetRequestPagingError = GetRequestPagingAPI.errorSelector;
export const GetRequestPagingResetter = getResetter(GetRequestPagingAPI);

// Get Request Paging By Product
const GetRequestPagingByProductAPI = makeFetchAction(
  GET_REQUEST_PAGING_BY_PRODUCT,
  ({
    status = [],
    productTitle,
    fromDate,
    toDate,
    pageIndex,
    pageSize,
    category,
    productId
  }) => {
    return nfetch({
      endpoint: `/api/Request/Filter${generateQuery({
        statuses: status,
        productName: productTitle,
        fromDate,
        toDate,
        pageIndex,
        pageSize,
        dateDescending: true,
        categoryId: category,
        productId
      })}`,
      method: 'GET'
    })();
  }
);

export const getRequestPagingByProduct = ({
  status = [],
  productTitle,
  fromDate,
  toDate,
  pageIndex,
  pageSize,
  category,
  productId
}) =>
  respondToSuccess(
    GetRequestPagingByProductAPI.actionCreator({
      status,
      productTitle,
      fromDate,
      toDate,
      pageIndex,
      pageSize,
      category,
      productId
    }),
    () => {}
  );

export const GetRequestPagingByProductData =
  GetRequestPagingByProductAPI.dataSelector;
export const GetRequestPagingByProductError =
  GetRequestPagingByProductAPI.errorSelector;
export const GetRequestPagingByProductResetter = getResetter(
  GetRequestPagingByProductAPI
);

// Get Request Canceled By User
const GetRequestCanceledByUserAPI = makeFetchAction(
  GET_REQUEST_CANCELED_BY_USER,
  ({ pageIndex, pageSize, buyerId }) => {
    return nfetch({
      endpoint: `/api/Request/FilterByCancelRequest${generateQuery({
        pageIndex,
        pageSize,
        buyerId
      })}`,
      method: 'GET'
    })();
  }
);

export const getRequestCanceledByUser = ({ pageIndex, pageSize, buyerId }) =>
  respondToSuccess(
    GetRequestCanceledByUserAPI.actionCreator({
      pageIndex,
      pageSize,
      buyerId
    }),
    () => {}
  );

export const GetRequestCanceledByUserData =
  GetRequestCanceledByUserAPI.dataSelector;
export const GetRequestCanceledByUserError =
  GetRequestCanceledByUserAPI.errorSelector;
export const GetRequestCanceledByUserResetter = getResetter(
  GetRequestCanceledByUserAPI
);

// Get Request Group By
const GetRequestGroupByAPI = makeFetchAction(
  GET_REQUEST_GROUP_BY,
  ({
    status = [],
    productTitle,
    fromDate,
    toDate,
    pageIndex,
    pageSize,
    category
  }) => {
    return nfetch({
      endpoint: `/api/Request/FilterByProductGroup${generateQuery({
        statuses: status,
        productName: productTitle,
        fromDate,
        toDate,
        pageIndex,
        pageSize,
        dateDescending: true,
        categoryId: category
      })}`,
      method: 'GET'
    })();
  }
);

export const getRequestGroupBy = ({
  status = [],
  productTitle,
  fromDate,
  toDate,
  pageIndex,
  pageSize,
  category
}) =>
  respondToSuccess(
    GetRequestGroupByAPI.actionCreator({
      status,
      productTitle,
      fromDate,
      toDate,
      pageIndex,
      pageSize,
      category
    }),
    () => {}
  );

export const GetRequestGroupByData = GetRequestGroupByAPI.dataSelector;
export const GetRequestGroupByError = GetRequestGroupByAPI.errorSelector;
export const GetRequestGroupByResetter = getResetter(GetRequestGroupByAPI);

// Get Request Details
const GetRequestDetailsAPI = makeFetchAction(GET_REQUEST_DETAILS, (requestId) =>
  nfetch({
    endpoint: `/api/Request/${requestId}`,
    method: 'GET'
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
    method: 'DELETE'
  })({
    id,
    description: desc
  })
);

export const cancelRequest = (id, desc) =>
  respondToSuccess(
    CancelRequestAPI.actionCreator(id, desc),
    (resp, _, store) => {
      store.dispatch(
        getRequestPaging({
          status: '',
          productTitle: '',
          pageIndex: 1,
          pageSize: 10
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
    method: 'DELETE'
  })({
    id,
    description: desc
  })
);

export const rejectRequest = (id, desc) =>
  respondToSuccess(
    RejectRequestAPI.actionCreator(id, desc),
    (resp, _, store) => {
      store.dispatch(
        getRequestPaging({
          status: [R_PENDING],
          productTitle: '',
          pageIndex: 1,
          pageSize: 10
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
    endpoint: '/api/Request',
    method: 'PUT'
  })(object)
);

export const updateRequest = (object) =>
  respondToSuccess(UpdateRequestAPI.actionCreator(object), (resp) => {
    if (resp) {
      openNotification('success', { message: 'Update request success!' });
      Router.push('/buyer/rfq');
    }
  });
export const UpdateRequestData = UpdateRequestAPI.dataSelector;
export const UpdateRequestError = UpdateRequestAPI.errorSelector;
export const UpdateRequestResetter = getResetter(UpdateRequestAPI);

// Get Request By Group Id
const GetRequestByGroupIdAPI = makeFetchAction(
  GET_REQUEST_BY_GROUP_ID,
  ({ pageIndex, pageSize, groupId }) =>
    nfetch({
      endpoint: `/api/Group/Requests${generateQuery({
        groupId,
        pageIndex,
        pageSize
      })}`,
      method: 'GET'
    })()
);

export const getRequestByGroupId = ({ pageIndex, pageSize, groupId }) =>
  respondToSuccess(
    GetRequestByGroupIdAPI.actionCreator({ pageIndex, pageSize, groupId })
  );
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
        pageSize
      })}`,
      method: 'GET'
    })()
);

export const getRequestSuggestByProductId = ({
  productId,
  pageIndex,
  pageSize
}) =>
  respondToSuccess(
    GetRequestSuggestByProductIdAPI.actionCreator({
      productId,
      pageIndex,
      pageSize
    })
  );
export const getRequestSuggestByProductIdData =
  GetRequestSuggestByProductIdAPI.dataSelector;
export const getRequestSuggestByProductIdError =
  GetRequestSuggestByProductIdAPI.errorSelector;
export const getRequestSuggestByProductIdResetter = getResetter(
  GetRequestSuggestByProductIdAPI
);
