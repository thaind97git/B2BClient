import { makeFetchAction } from 'redux-api-call';

import { respondToSuccess } from '../middlewares/api-reaction';
import nfetch from '../libs/nfetch';
import { generateQuery, getResetter } from '../libs';

export const CREATE_REVERSE_AUCTION = 'CreateReverseAuctionAPI';
const AUCTION_FILTER = 'AuctionFilterAPI';
const GET_AUCTION_DETAILS = 'GetAuctionDetailsAPI';
export const CANCEL_AUCTION = 'CancelAuctionAPI';
export const RESPONSE_AUCTION_INVITATION = 'ResponseAuctionInvitationAPI';
export const PLACE_NEW_BID = 'PlaceNewBidAPI';
const GET_HISTORY_AUCTION = 'GetHistoryAuctionAPI';
const GET_SUPPLIER_INVITATION = 'GetSupplierInvitationAPI';
export const REMOVE_SUPPLIER_AUCTION = 'RemoveSupplierAuctionAPI';

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
    pageSize,
    orderByDateDescending
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
        pageSize,
        orderByDateDescending
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
  pageSize,
  orderByDateDescending
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
      pageSize,
      orderByDateDescending
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

// Response Auction Invitation
const ResponseAuctionInvitationAPI = makeFetchAction(
  RESPONSE_AUCTION_INVITATION,
  (reverseAuctionId, isAccept) =>
    nfetch({
      endpoint: `/api/Invitation/Response`,
      method: 'PUT'
    })({
      reverseAuctionId,
      isAccept
    })
);

export const responseAuctionInvitation = (
  reverseAuctionId,
  isAccept,
  callback
) =>
  respondToSuccess(
    ResponseAuctionInvitationAPI.actionCreator(reverseAuctionId, isAccept),
    () => {
      typeof callback === 'function' && callback();
    }
  );
export const ResponseAuctionInvitationData =
  ResponseAuctionInvitationAPI.dataSelector;
export const ResponseAuctionInvitationError =
  ResponseAuctionInvitationAPI.errorSelector;
export const ResponseAuctionInvitationResetter = getResetter(
  ResponseAuctionInvitationAPI
);

// Cancel Auctions
const PlaceNewBidAPI = makeFetchAction(
  PLACE_NEW_BID,
  ({ reverseAuctionId, bid }) =>
    nfetch({
      endpoint: `/api/ReverseAuction/PlaceBid`,
      method: 'POST'
    })({ reverseAuctionId, bid })
);

export const placeNewBid = ({ reverseAuctionId, bid }, callback) =>
  respondToSuccess(
    PlaceNewBidAPI.actionCreator({ reverseAuctionId, bid }),
    () => {
      typeof callback === 'function' && callback();
    }
  );
export const PlaceNewBidData = PlaceNewBidAPI.dataSelector;
export const PlaceNewBidError = PlaceNewBidAPI.errorSelector;
export const PlaceNewBidResetter = getResetter(PlaceNewBidAPI);

// Get Auctions History
const GetAuctionHistoryAPI = makeFetchAction(GET_HISTORY_AUCTION, (auctionId) =>
  nfetch({
    endpoint: `/api/ReverseAuction/History/${auctionId}`,
    method: 'GET'
  })()
);

export const GetAuctionHistory = (auctionId) =>
  respondToSuccess(GetAuctionHistoryAPI.actionCreator(auctionId));
export const GetAuctionHistoryData = GetAuctionHistoryAPI.dataSelector;
export const GetAuctionHistoryError = GetAuctionHistoryAPI.errorSelector;
export const GetAuctionHistoryResetter = getResetter(GetAuctionHistoryAPI);

// Get Supplier Invitation
const GetSupplierInvitationAPI = makeFetchAction(
  GET_SUPPLIER_INVITATION,
  ({ reverseAuctionId, pageIndex, pageSize }) =>
    nfetch({
      endpoint: `/api/ReverseAuction/AllSupplier${generateQuery({
        reverseAuctionId,
        pageIndex,
        pageSize
      })}`,
      method: 'GET'
    })()
);

export const getSupplierInvitation = ({
  reverseAuctionId,
  pageIndex,
  pageSize
}) =>
  respondToSuccess(
    GetSupplierInvitationAPI.actionCreator({
      reverseAuctionId,
      pageIndex,
      pageSize
    })
  );
export const GetSupplierInvitationData = GetSupplierInvitationAPI.dataSelector;
export const GetSupplierInvitationError =
  GetSupplierInvitationAPI.errorSelector;
export const GetSupplierInvitationResetter = getResetter(
  GetSupplierInvitationAPI
);

// Cancel Auctions
const RemoveSupplierAuctionAPI = makeFetchAction(
  REMOVE_SUPPLIER_AUCTION,
  ({ supplierId, reverseAuctionId }) =>
    nfetch({
      endpoint: `/api/ReverseAuction/RemoveSupplier`,
      method: 'PUT'
    })({ supplierId, reverseAuctionId })
);

export const removeSupplierAuction = (
  { supplierId, reverseAuctionId },
  callback
) =>
  respondToSuccess(
    RemoveSupplierAuctionAPI.actionCreator({ supplierId, reverseAuctionId }),
    () => {
      typeof callback === 'function' && callback();
    }
  );
export const RemoveSupplierAuctionData = RemoveSupplierAuctionAPI.dataSelector;
export const RemoveSupplierAuctionError =
  RemoveSupplierAuctionAPI.errorSelector;
export const RemoveSupplierAuctionResetter = getResetter(
  RemoveSupplierAuctionAPI
);
