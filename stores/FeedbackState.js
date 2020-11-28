import { makeFetchAction } from 'redux-api-call';

import { respondToSuccess } from '../middlewares/api-reaction';
import nfetch from '../libs/nfetch';
import { generateQuery, getResetter } from '../libs';
import { getToken } from '../libs/localStorage';
import { openNotification } from '../utils';
import Router from 'next/router';

export const CREATE_FEEDBACK = 'CreateFeedbackAPI';
export const GET_FEEDBACK_PAGING = 'GetFeedbackPagingAPI';
export const GET_FEEDBACK_DETAILS = 'GetFeedbackDetailsAPI';
export const GET_FEEDBACK_FILE = 'GetFeedbackFileAPI';
export const CREATE_FEEDBACK_REPLY = 'CreateFeedbackReplyAPI';
export const UPDATE_FEEDBACK_RATE = 'UpdateFeedbackRateAPI';
export const GET_REQUEST_PAGING_FOR_FEEDBACK = 'GetRequestPagingForFeedbackAPI';
const GET_FEEDBACK_REPORTED_FOR_SUPPLIER = 'GetFeedbackReportedForSupplierAPI';

//create feedback
const onUploadFile = (feedbackId, fileList) => {
  const listFileOrigin = fileList.map((file) => file.originFileObj);
  const formData = new FormData();
  for (let file of listFileOrigin) {
    formData.append('files', file);
  }

  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${getToken()}`);
  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: formData
  };

  fetch(
    `${process.env.API_SERVER_URL}/api/Feedback/FeedbackFile/${feedbackId}`,
    requestOptions
  );
};

const CreateFeedbackAPI = makeFetchAction(CREATE_FEEDBACK, (object) =>
  nfetch({
    endpoint: '/api/Feedback'
  })(object)
);

export const createFeedback = (object, fileList) =>
  respondToSuccess(CreateFeedbackAPI.actionCreator(object), (resp) => {
    if (resp) {
      openNotification('success', {
        message: 'Create new feedback success !'
      });
      onUploadFile(resp, fileList);
      //Router.push('/buyer');
    }
  });
export const CreateFeedbackData = CreateFeedbackAPI.dataSelector;
export const CreateFeedbackError = CreateFeedbackAPI.errorSelector;
export const CreateFeedbackResetter = getResetter(CreateFeedbackAPI);

//get feedback paging
const GetFeedbackPagingAPI = makeFetchAction(
  GET_FEEDBACK_PAGING,
  ({ status, systemType, title, fromDate, toDate, pageIndex, pageSize }) => {
    return nfetch({
      endpoint: `/api/Feedback/Filter${generateQuery({
        statusId: status,
        systemType,
        title,
        fromDate,
        toDate,
        pageIndex,
        pageSize,
        dateDescending: true
      })}`,
      method: 'GET'
    })();
  }
);

export const getFeedbackPaging = ({
  status,
  systemType,
  title,
  fromDate,
  toDate,
  pageIndex,
  pageSize
}) =>
  respondToSuccess(
    GetFeedbackPagingAPI.actionCreator({
      status,
      systemType,
      title,
      fromDate,
      toDate,
      pageIndex,
      pageSize
    }),
    () => {}
  );

export const GetFeedbackPagingData = GetFeedbackPagingAPI.dataSelector;
export const GetFeedbackPagingError = GetFeedbackPagingAPI.errorSelector;
export const GetFeedbackPagingResetter = getResetter(GetFeedbackPagingAPI);

//get feedback detail
const GetFeedbackDetailsAPI = makeFetchAction(
  GET_FEEDBACK_DETAILS,
  (feedbackId) =>
    nfetch({
      endpoint: `/api/Feedback/${feedbackId}`,
      method: 'GET'
    })()
);

export const getFeedbackDetails = (feedbackId) =>
  respondToSuccess(
    GetFeedbackDetailsAPI.actionCreator(feedbackId),
    (resp, _, store) => {}
  );
export const GetFeedbackDetailsData = GetFeedbackDetailsAPI.dataSelector;
export const GetFeedbackDetailsError = GetFeedbackDetailsAPI.errorSelector;
export const GetFeedbackDetailsResetter = getResetter(GetFeedbackDetailsAPI);

//get feedback reported for supplier
const GetFeedbackReportedForSupplierAPI = makeFetchAction(
  GET_FEEDBACK_REPORTED_FOR_SUPPLIER,
  ({ supplierId, pageIndex, pageSize }) =>
    nfetch({
      endpoint: `/api/Feedback/FeedbackSupplier${generateQuery({
        userId: supplierId,
        pageIndex,
        pageSize
      })}`,
      method: 'GET'
    })()
);

export const getFeedbackReportedForSupplier = ({
  supplierId,
  pageIndex,
  pageSize
}) =>
  respondToSuccess(
    GetFeedbackReportedForSupplierAPI.actionCreator({
      supplierId,
      pageIndex,
      pageSize
    })
  );
export const GetFeedbackReportedForSupplierData =
  GetFeedbackReportedForSupplierAPI.dataSelector;
export const GetFeedbackReportedForSupplierError =
  GetFeedbackReportedForSupplierAPI.errorSelector;
export const GetFeedbackReportedForSupplierResetter = getResetter(
  GetFeedbackReportedForSupplierAPI
);

//create feedback reply
const CreateFeedbackReplyAPI = makeFetchAction(
  CREATE_FEEDBACK_REPLY,
  (object) =>
    nfetch({
      endpoint: '/api/Feedback/Reply'
    })(object)
);

export const createFeedbackReply = (object) =>
  respondToSuccess(CreateFeedbackReplyAPI.actionCreator(object), (resp) => {});
export const CreateFeedbackReplyData = CreateFeedbackReplyAPI.dataSelector;
export const CreateFeedbackReplyError = CreateFeedbackReplyAPI.errorSelector;
export const CreateFeedbackReplyResetter = getResetter(CreateFeedbackReplyAPI);

//create feedback rate
const UpdateFeedbackRateAPI = makeFetchAction(
  UPDATE_FEEDBACK_RATE,
  ({ feedbackReplyId, isHappy }) =>
    nfetch({
      endpoint: `/api/Feedback/Rate`,
      method: 'PUT'
    })({ feedbackReplyId, isHappy })
);

export const updateFeedbackRate = ({ feedbackReplyId, isHappy }) =>
  respondToSuccess(
    UpdateFeedbackRateAPI.actionCreator({ feedbackReplyId, isHappy }),
    (resp) => {}
  );
export const UpdateFeedbackRateData = UpdateFeedbackRateAPI.dataSelector;
export const UpdateFeedbackRateError = UpdateFeedbackRateAPI.errorSelector;
export const UpdateFeedbackRateResetter = getResetter(UpdateFeedbackRateAPI);

//get feedback file
const GetFeedbackFileAPI = makeFetchAction(GET_FEEDBACK_FILE, (fileId) =>
  nfetch({
    endpoint: `/api/Feedback/FeedbackFile/${fileId}`,
    method: 'GET'
  })()
);

export const getFeedbackFile = (fileId) =>
  respondToSuccess(
    GetFeedbackFileAPI.actionCreator(fileId),
    (resp, _, store) => {
      //console.log(resp.headers.get('Content - Disposition'));
    }
  );
export const GetFeedbackFileData = GetFeedbackFileAPI.dataSelector;
export const GetFeedbackFileError = GetFeedbackFileAPI.errorSelector;
export const GetFeedbackFileResetter = getResetter(GetFeedbackFileAPI);

// Get Request Paging to feedback
const GetRequestPagingForFeedbackAPI = makeFetchAction(
  GET_REQUEST_PAGING_FOR_FEEDBACK,
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
      endpoint: `/api/Feedback/Request${generateQuery({
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

export const getRequestPagingForFeedback = ({
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
    GetRequestPagingForFeedbackAPI.actionCreator({
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

export const GetRequestPagingForFeedbackData =
  GetRequestPagingForFeedbackAPI.dataSelector;
export const GetRequestPagingForFeedbackError =
  GetRequestPagingForFeedbackAPI.errorSelector;
export const GetRequestPagingForFeedbackResetter = getResetter(
  GetRequestPagingForFeedbackAPI
);
