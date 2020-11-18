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
export const CREATE_FEEDBACK_REPLY = 'CreateFeedbackReplyAPI';

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
    body:formData
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

export const createFeedback = (object,fileList) =>
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
  ({ status, title, fromDate, toDate, pageIndex, pageSize }) => {
    return nfetch({
      endpoint: `/api/Feedback/Filter${generateQuery({
        statusId: status,
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
  title,
  fromDate,
  toDate,
  pageIndex,
  pageSize
}) =>
  respondToSuccess(
    GetFeedbackPagingAPI.actionCreator({
      status,
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
export const GetFeedbackDetailsData =
  GetFeedbackDetailsAPI.dataSelector;
export const GetFeedbackDetailsError =
  GetFeedbackDetailsAPI.errorSelector;
export const GetFeedbackDetailsResetter = getResetter(GetFeedbackDetailsAPI);

//create feedback reply
const CreateFeedbackReplyAPI = makeFetchAction(CREATE_FEEDBACK_REPLY, (object) =>
  nfetch({
    endpoint: '/api/Feedback/Reply'
  })(object)
);

export const createFeedbackReply = (object) =>
  respondToSuccess(CreateFeedbackReplyAPI.actionCreator(object), (resp) => {
    
  });
export const CreateFeedbackReplyData = CreateFeedbackReplyAPI.dataSelector;
export const CreateFeedbackReplyError = CreateFeedbackReplyAPI.errorSelector;
export const CreateFeedbackReplyResetter = getResetter(CreateFeedbackReplyAPI);