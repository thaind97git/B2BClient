import { makeFetchAction } from 'redux-api-call';

import { respondToSuccess } from '../middlewares/api-reaction';
import nfetch from '../libs/nfetch';
import { generateQuery, getResetter } from '../libs';

const GET_NOTIFICATION = 'GetNotificationAPI';
const GET_NOTIFICATION_COUNT = 'GetNotificationCountAPI';
const SEEN_NOTIFICATION = 'SeenNotificationAPI';

// Get List Notification
const GetNotificationAPI = makeFetchAction(
  GET_NOTIFICATION,
  ({ pageIndex, pageSize }) =>
    nfetch({
      endpoint: `/api/Notification?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      method: 'GET'
    })()
);

export const getNotification = ({ pageIndex = 1, pageSize = 50 }) =>
  respondToSuccess(GetNotificationAPI.actionCreator({ pageIndex, pageSize }));
export const GetNotificationData = GetNotificationAPI.dataSelector;
export const GetNotificationError = GetNotificationAPI.errorSelector;
export const GetNotificationResetter = getResetter(GetNotificationAPI);

// Get Notification Count
const GetNotificationCountAPI = makeFetchAction(GET_NOTIFICATION_COUNT, () =>
  nfetch({
    endpoint: `/api/Notification/UnSeenNumber`,
    method: 'GET'
  })()
);

export const getNotificationCount = () =>
  respondToSuccess(GetNotificationCountAPI.actionCreator());
export const GetNotificationCountData = GetNotificationCountAPI.dataSelector;
export const GetNotificationCountError = GetNotificationCountAPI.errorSelector;
export const GetNotificationCountResetter = getResetter(
  GetNotificationCountAPI
);

// Seen Notification
const SeenNotificationAPI = makeFetchAction(SEEN_NOTIFICATION, () =>
  nfetch({
    endpoint: `/api/Notification/Seen`,
    method: 'PUT'
  })()
);

export const seenNotification = () =>
  respondToSuccess(SeenNotificationAPI.actionCreator());
export const SeenNotificationData = SeenNotificationAPI.dataSelector;
export const SeenNotificationError = SeenNotificationAPI.errorSelector;
export const SeenNotificationResetter = getResetter(SeenNotificationAPI);

export default {};
