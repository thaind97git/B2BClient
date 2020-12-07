import { makeFetchAction } from 'redux-api-call';

import { respondToSuccess } from '../middlewares/api-reaction';
import nfetch from '../libs/nfetch';
import { generateQuery, getResetter } from '../libs';
// import { getToken } from '../libs/localStorage';
// import { openNotification } from '../utils';
// import Router from 'next/router';

export const GET_SUPPLIER_TOP_PRODUCT = 'GetSupplierTopProductAPI';
export const GET_RFQ_STATISTIC = 'GetRFQStatisticAPI';
export const GET_GROUP_BY_AGGREGATOR_STATISTIC = 'GetGroupByAggregatorStatisticAPI';
export const GET_AUCTION_STATISTIC = 'GetAuctionStatisticAPI';
export const GET_TOP_PRODUCT = 'GetTopProductAPI';
export const GET_TOP_SUPPLIER = 'GetTopSupplierAPI';
export const GET_TOP_BUYER = 'GetTopBuyerAPI';
export const GET_TOP_AGGREGATOR = 'GetTopAggregatorAPI';

//get top product of supplier
const GetSupplierTopProductAPI = makeFetchAction(GET_SUPPLIER_TOP_PRODUCT, () =>
  nfetch({
    endpoint: `/api/Dashboard/TopProductOfSupplier`,
    method: 'GET'
  })()
);

export const getSupplierTopProduct = () =>
  respondToSuccess(
    GetSupplierTopProductAPI.actionCreator(),
    (resp, _, store) => {}
  );
export const GetSupplierTopProductData = GetSupplierTopProductAPI.dataSelector;
export const GetSupplierTopProductError = GetSupplierTopProductAPI.errorSelector;
export const GetSupplierTopProductResetter = getResetter(GetSupplierTopProductAPI);

//get top product of month by admin
const GetTopProductAPI = makeFetchAction(GET_TOP_PRODUCT, (fromDate) =>
  nfetch({
    endpoint: `/api/Dashboard/TopProductOfMonth${
      fromDate === null ? '' : `?fromDate=${fromDate}`
    }`,
    method: 'GET'
  })()
);

export const getTopProduct = (fromDate) =>
  respondToSuccess(
    GetTopProductAPI.actionCreator(fromDate),
    (resp, _, store) => {}
  );
export const GetTopProductData = GetTopProductAPI.dataSelector;
export const GetTopProductError = GetTopProductAPI.errorSelector;
export const GetTopProductResetter = getResetter(GetTopProductAPI);

//get top supplier of month by admin
const GetTopSupplierAPI = makeFetchAction(GET_TOP_SUPPLIER, (fromDate) =>
  nfetch({
    endpoint: `/api/Dashboard/TopSupplierOfMonth${
      fromDate === null ? '' : `?fromDate=${fromDate}`
    }`,
    method: 'GET'
  })()
);

export const getTopSupplier = (fromDate) =>
  respondToSuccess(
    GetTopSupplierAPI.actionCreator(fromDate),
    (resp, _, store) => {}
  );
export const GetTopSupplierData = GetTopSupplierAPI.dataSelector;
export const GetTopSupplierError = GetTopSupplierAPI.errorSelector;
export const GetTopSupplierResetter = getResetter(GetTopSupplierAPI);

//get top buyer of month by admin
const GetTopBuyerAPI = makeFetchAction(GET_TOP_BUYER, (fromDate) =>
  nfetch({
    endpoint: `/api/Dashboard/TopBuyerOfMonth${
      fromDate === null ? '' : `?fromDate=${fromDate}`
    }`,
    method: 'GET'
  })()
);

export const getTopBuyer = (fromDate) =>
  respondToSuccess(
    GetTopBuyerAPI.actionCreator(fromDate),
    (resp, _, store) => {}
  );
export const GetTopBuyerData = GetTopBuyerAPI.dataSelector;
export const GetTopBuyerError = GetTopBuyerAPI.errorSelector;
export const GetTopBuyerResetter = getResetter(GetTopBuyerAPI);

//get top aggregator of month by admin
const GetTopAggregatorAPI = makeFetchAction(GET_TOP_AGGREGATOR, (fromDate) =>
  nfetch({
    endpoint: `/api/Dashboard/TopAggregatorOfMonth${
      fromDate === null ? '' : `?fromDate=${fromDate}`
    }`,
    method: 'GET'
  })()
);

export const getTopAggregator = (fromDate) =>
  respondToSuccess(
    GetTopAggregatorAPI.actionCreator(fromDate),
    (resp, _, store) => {}
  );
export const GetTopAggregatorData = GetTopAggregatorAPI.dataSelector;
export const GetTopAggregatorError = GetTopAggregatorAPI.errorSelector;
export const GetTopAggregatorResetter = getResetter(GetTopAggregatorAPI);

//get RFQ status statistic
const GetRFQStatisticAPI = makeFetchAction(GET_RFQ_STATISTIC, (fromDate) =>
  nfetch({
    endpoint: `/api/Dashboard/RFQStatistic${fromDate===null?'':`?fromDate=${fromDate}`}`,
    method: 'GET'
  })()
);

export const getRFQStatistic = (fromDate) =>
  respondToSuccess(
    GetRFQStatisticAPI.actionCreator(fromDate),
    (resp, _, store) => {}
  );

export const GetRFQStatisticData = GetRFQStatisticAPI.dataSelector;
export const GetRFQStatisticError = GetRFQStatisticAPI.errorSelector;
export const GetRFQStatisticResetter = getResetter(GetRFQStatisticAPI);

//get auction status statistic
const GetAuctionStatisticAPI = makeFetchAction(GET_AUCTION_STATISTIC, (fromDate) =>
  nfetch({
    endpoint: `/api/Dashboard/AuctionStatistic${fromDate===null?'':`?fromDate=${fromDate}`}`,
    method: 'GET'
  })()
);

export const getAuctionStatistic = (fromDate) =>
  respondToSuccess(
    GetAuctionStatisticAPI.actionCreator(fromDate),
    (resp, _, store) => {}
  );

export const GetAuctionStatisticData = GetAuctionStatisticAPI.dataSelector;
export const GetAuctionStatisticError = GetAuctionStatisticAPI.errorSelector;
export const GetAuctionStatisticResetter = getResetter(GetAuctionStatisticAPI);

//get group status statistic
const GetGroupByAggregatorStatisticAPI = makeFetchAction(GET_GROUP_BY_AGGREGATOR_STATISTIC, (fromDate) =>
  nfetch({
    endpoint: `/api/Dashboard/GroupStatistic${fromDate===null?'':`?fromDate=${fromDate}`}`,
    method: 'GET'
  })()
);

export const getGroupByAggregatorStatistic = (fromDate) =>
  respondToSuccess(
    GetGroupByAggregatorStatisticAPI.actionCreator(fromDate),
    (resp, _, store) => {}
  );

export const GetGroupByAggregatorStatisticData = GetGroupByAggregatorStatisticAPI.dataSelector;
export const GetGroupByAggregatorStatisticError = GetGroupByAggregatorStatisticAPI.errorSelector;
export const GetGroupByAggregatorStatisticResetter = getResetter(GetGroupByAggregatorStatisticAPI);