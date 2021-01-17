import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { displayCurrency } from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  GetAuctionHistory,
  GetAuctionHistoryData,
  GetAuctionHistoryResetter,
  placeNewBid,
  PlaceNewBidData
} from '../stores/AuctionState';
import BiddingAuctionHistoryComponent from './BiddingAuctionHistoryComponent';
import BiddingAuctionHistoryAllComponent from './BiddingAuctionHistoryAllComponent';
import BiddingAuctionSubmitComponent from './BiddingAuctionSubmitComponent';
import SupplierAddNewBidComponent from './SupplierAddNewBidComponent';
const connectToRedux = connect(
  createStructuredSelector({
    placeBidData: PlaceNewBidData,
    auctionHistoryData: GetAuctionHistoryData
  }),
  (dispatch) => ({
    placeNewBid: ({ reverseAuctionId, bid }, callback) =>
      dispatch(placeNewBid({ reverseAuctionId, bid }, callback)),
    getAuctionHistory: (id) => dispatch(GetAuctionHistory(id)),
    resetHistory: () => dispatch(GetAuctionHistoryResetter)
  })
);

// const getLastedOwnerBid = (bidHistory = []) => {
//   let data = {};
//   const arrayOfOwner =
//     bidHistory && bidHistory.filter((bid = {}) => !!bid.supplier);
//   if (!!arrayOfOwner) {
//     data = arrayOfOwner[arrayOfOwner.length - 1];
//   }
//   return {
//     lastedPrice: (data || {}).price,
//     lastedBid: data,
//     isBided: !!data && data.price
//   };
// };

const BiddingAuctionComponent = ({
  auction,
  auctionHistoryData,
  isAggregator = false,
  // signalR,
  resetHistory
}) => {
  const [totalLot, setTotalLot] = useState(0);

  const [biddingHistory, setBiddingHistory] = useState([]);
  const [lowestBid, setLowestBid] = useState(0);

  useEffect(() => {
    return () => {
      resetHistory();
    };
  }, [resetHistory]);

  // Set history total lot at the first load
  useEffect(() => {
    if (auctionHistoryData && auction) {
      // set Total lot
      // const { lastedPrice } = getLastedOwnerBid(auctionHistoryData);
      const { quantity } = auction;
      // setTotalLot(Math.floor(quantity * lastedPrice));
      setBiddingHistory(auctionHistoryData);
    }
  }, [auctionHistoryData, auction]);

  useEffect(() => {
    if (biddingHistory && biddingHistory.length > 0) {
      setLowestBid(Math.floor(biddingHistory[biddingHistory.length - 1].price));
    }
  }, [biddingHistory]);

  if (!auction) {
    return null;
  }
  const { product = {}, quantity } = auction;

  const { unitOfMeasure = {} } = product;
  return (
    <div>
      <SupplierAddNewBidComponent />

      <Row gutter={16}></Row>
    </div>
  );
};
export default connectToRedux(BiddingAuctionComponent);
