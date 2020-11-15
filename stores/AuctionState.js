import { makeFetchAction } from 'redux-api-call';

import { respondToSuccess } from '../middlewares/api-reaction';
import nfetch from '../libs/nfetch';
import { generateQuery, getResetter } from '../libs';

export const CREATE_REVERSE_AUCTION = 'CreateReverseAuctionAPI';
const AUCTION_FILTER = 'AuctionFilterAPI';
const GET_AUCTION_DETAILS = 'GetAuctionDetailsAPI';
export const CANCEL_AUCTION = 'CancelAuctionAPI';

const CreateReverseAuctionAPI = makeFetchAction(
  CREATE_REVERSE_AUCTION,
  (values) =>
    nfetch({
      endpoint: '/api/ReverseAuction'
    })(values)
);

export const createReverseAuction = (values) =>
  respondToSuccess(CreateReverseAuctionAPI.actionCreator(values));
export const CreateReverseAuctionData = CreateReverseAuctionAPI.dataSelector;
export const CreateReverseAuctionError = CreateReverseAuctionAPI.errorSelector;
export const CreateReverseAuctionResetter = getResetter(
  CreateReverseAuctionAPI
);

const AuctionFilterAPI = makeFetchAction(
  AUCTION_FILTER,
  ({
    name,
    categoryId,
    isInvitation,
    status,
    fromDate,
    toDate,
    pageIndex,
    pageSize
  }) =>
    nfetch({
      endpoint: `/api/ReverseAuction/Filter${generateQuery({
        name,
        categoryId,
        isInvitation,
        status,
        fromDate,
        toDate,
        pageIndex,
        pageSize
      })}`,
      method: 'GET'
    })()
);

export const auctionFilter = ({
  name,
  categoryId,
  isInvitation,
  status,
  fromDate,
  toDate,
  pageIndex,
  pageSize
}) =>
  respondToSuccess(
    AuctionFilterAPI.actionCreator({
      name,
      categoryId,
      isInvitation,
      status,
      fromDate,
      toDate,
      pageIndex,
      pageSize
    })
  );
export const AuctionFilterData = AuctionFilterAPI.dataSelector;
export const AuctionFilterError = AuctionFilterAPI.errorSelector;
export const AuctionFilterResetter = getResetter(AuctionFilterAPI);

// Get Auctions Details
const GetAuctionDetailsAPI = makeFetchAction(GET_AUCTION_DETAILS, (auctionId) =>
  nfetch({
    endpoint: `/api/ReverseAuction/${auctionId}`,
    method: 'GET'
  })()
);

export const getAuctionDetails = (auctionId) =>
  respondToSuccess(GetAuctionDetailsAPI.actionCreator(auctionId));
export const GetAuctionDetailsData = GetAuctionDetailsAPI.dataSelector;
export const GetAuctionDetailsError = GetAuctionDetailsAPI.errorSelector;
export const GetAuctionDetailsResetter = getResetter(GetAuctionDetailsAPI);

// Cancel Auctions
const CancelAuctionAPI = makeFetchAction(GET_AUCTION_DETAILS, (auctionId) =>
  nfetch({
    endpoint: `/api/ReverseAuction/${auctionId}`,
    method: 'DELETE'
  })()
);

export const cancelAuction = (auctionId, callback) =>
  respondToSuccess(CancelAuctionAPI.actionCreator(auctionId), () => {
    typeof callback === 'function' && callback();
  });
export const CancelAuctionData = CancelAuctionAPI.dataSelector;
export const CancelAuctionError = CancelAuctionAPI.errorSelector;
export const CancelAuctionResetter = getResetter(CancelAuctionAPI);
