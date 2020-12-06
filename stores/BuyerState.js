import { makeFetchAction } from 'redux-api-call';

import { respondToSuccess } from '../middlewares/api-reaction';
import nfetch from '../libs/nfetch';
import { generateQuery, getResetter } from '../libs';

const CREATE_REQUEST = 'CreateRequestAPI';
const GET_BUYER_PAGING = 'GetBuyerPagingAPI';
const GET_AGGREGATOR_PAGING = 'GetAggregatorPagingAPI';
// Get Sourcing Type
const CreateRequestAPI = makeFetchAction(CREATE_REQUEST, (object) =>
  nfetch({
    endpoint: '/api/Request'
  })(object)
);

export const createRequest = () =>
  respondToSuccess(CreateRequestAPI.actionCreator());

export const CreateRequestData = CreateRequestAPI.dataSelector;
export const CreateRequestError = CreateRequestAPI.errorSelector;
export const CreateRequestResetter = getResetter(CreateRequestAPI);

// Get Buyer Paging
const GetBuyerPagingAPI = makeFetchAction(
  GET_BUYER_PAGING,
  ({ pageIndex, pageSize, statusId, email }) =>
    nfetch({
      endpoint: `/api/Buyer/Filter${generateQuery({
        statusId,
        email,
        pageIndex,
        pageSize
      })}`,
      method: 'GET'
    })()
);

export const getBuyerPaging = ({
  statusId,
  email,
  pageIndex = 1,
  pageSize = 10
}) =>
  respondToSuccess(
    GetBuyerPagingAPI.actionCreator({ statusId, email, pageIndex, pageSize })
  );
export const GetBuyerPagingData = GetBuyerPagingAPI.dataSelector;
export const GetBuyerPagingError = GetBuyerPagingAPI.errorSelector;
export const GetBuyerPagingResetter = getResetter(GetBuyerPagingAPI);
// Get Aggregator Paging
const GetAggregatorPagingAPI = makeFetchAction(
  GET_AGGREGATOR_PAGING,
  ({ pageIndex, pageSize, statusId, email }) =>
    nfetch({
      endpoint: `/api/Aggregator/Filter${generateQuery({
        statusId,
        searchMessage: email,
        pageIndex,
        pageSize
      })}`,
      method: 'GET'
    })()
);

export const getAggregatorPaging = ({
  statusId,
  email,
  pageIndex = 1,
  pageSize = 10
}) =>
  respondToSuccess(
    GetAggregatorPagingAPI.actionCreator({
      statusId,
      email,
      pageIndex,
      pageSize
    })
  );
export const GetAggregatorPagingData = GetAggregatorPagingAPI.dataSelector;
export const GetAggregatorPagingError = GetAggregatorPagingAPI.errorSelector;
export const GetAggregatorPagingResetter = getResetter(GetAggregatorPagingAPI);
