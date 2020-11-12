import { makeFetchAction } from 'redux-api-call';
import { get, flow } from 'lodash/fp';

import { respondToSuccess } from '../middlewares/api-reaction';
import { createErrorSelector, parseBoolean } from '../utils';
import nfetch from '../libs/nfetch';
import { generateQuery, getResetter } from '../libs';

const GET_AGGREGATOR_GROUP_CHAT = 'GetAggregatorGroupChatAPI';
const GET_SUPPLIER_GROUP_CHAT = 'GetSupplierGroupChatAPI';
const GET_SUPPLIER_CHAT_BY_GROUP = 'GetSupplierChatByGroupAPI';
const GET_MESSAGES = 'GetMessagesAPI';

// Get Aggregator Group Chat
const GetAggregatorGroupChatAPI = makeFetchAction(
  GET_AGGREGATOR_GROUP_CHAT,
  (isNegotiating) =>
    nfetch({
      endpoint: `/api/Conversation/Aggregator/Group?isNegotiating=${parseBoolean(
        isNegotiating
      )}`,
      method: 'GET'
    })()
);
export const getAggregatorGroupChat = (isNegotiating) =>
  respondToSuccess(GetAggregatorGroupChatAPI.actionCreator(isNegotiating));
export const GetAggregatorGroupChatData =
  GetAggregatorGroupChatAPI.dataSelector;
export const GetAggregatorGroupChatError = createErrorSelector(
  GetAggregatorGroupChatAPI
);
export const GetAggregatorGroupChatResetter = getResetter(
  GetAggregatorGroupChatAPI
);

// Get Supplier Group Chat
const GetSupplierGroupChatAPI = makeFetchAction(
  GET_SUPPLIER_CHAT_BY_GROUP,
  (isNegotiating) =>
    nfetch({
      endpoint: `/api/Conversation/Supplier?isNegotiating=${parseBoolean(
        isNegotiating
      )}`,
      method: 'GET'
    })()
);
export const getSupplierGroupChat = (isNegotiating) =>
  respondToSuccess(GetSupplierGroupChatAPI.actionCreator(isNegotiating));
export const GetSupplierGroupChatData = GetSupplierGroupChatAPI.dataSelector;
export const GetSupplierGroupChatError = createErrorSelector(
  GetSupplierGroupChatAPI
);
export const GetSupplierGroupChatResetter = getResetter(
  GetSupplierGroupChatAPI
);

// Get Supplier Chat By Group
const GetSupplierChatByGroupAPI = makeFetchAction(
  GET_SUPPLIER_CHAT_BY_GROUP,
  (groupId) =>
    nfetch({
      endpoint: `/api/Conversation/Aggregator/${groupId}`,
      method: 'GET'
    })()
);
export const getSupplierChatByGroup = (groupId) =>
  respondToSuccess(GetSupplierChatByGroupAPI.actionCreator(groupId));
export const GetSupplierChatByGroupData =
  GetSupplierChatByGroupAPI.dataSelector;
export const GetSupplierChatByGroupError = createErrorSelector(
  GetSupplierChatByGroupAPI
);
export const GetSupplierChatByGroupResetter = getResetter(
  GetSupplierChatByGroupAPI
);

// Get Message
const GetMessagesAPI = makeFetchAction(
  GET_MESSAGES,
  ({ conversationId, pageIndex, pageSize }) =>
    nfetch({
      endpoint: `/api/Message/${conversationId}${generateQuery({
        pageIndex,
        pageSize
      })}`,
      method: 'GET'
    })()
);
export const getMessages = ({ conversationId, pageIndex, pageSize = 20 }) =>
  respondToSuccess(
    GetMessagesAPI.actionCreator({ conversationId, pageIndex, pageSize })
  );
export const GetMessagesData = GetMessagesAPI.dataSelector;
export const GetMessagesError = createErrorSelector(GetMessagesAPI);
export const GetMessagesResetter = getResetter(GetMessagesAPI);
