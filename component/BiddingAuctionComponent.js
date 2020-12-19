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

const getLastedOwnerBid = (bidHistory = []) => {
  let data = {};
  const arrayOfOwner =
    bidHistory && bidHistory.filter((bid = {}) => !!bid.supplier);
  if (!!arrayOfOwner) {
    data = arrayOfOwner[arrayOfOwner.length - 1];
  }
  return {
    lastedPrice: (data || {}).price,
    lastedBid: data,
    isBided: !!data && data.price
  };
};

const BiddingAuctionComponent = ({
  auction,
  getAuctionHistory,
  auctionHistoryData,
  isAggregator = false,
  signalR,
  resetHistory
}) => {
  const [totalLot, setTotalLot] = useState(0);

  const [biddingHistory, setBiddingHistory] = useState([]);
  const [lowestBid, setLowestBid] = useState(0);
  const [isFirstTime, setIsFirstTime] = useState(true);

  const [newHistory, setNewHistory] = useState(null);

  useEffect(() => {
    return () => {
      resetHistory();
    };
  }, [resetHistory]);

  useEffect(() => {
    if (auction) {
      const { id } = auction;
      getAuctionHistory(id);
    }
  }, [auction, getAuctionHistory]);

  // Set history total lot at the first load
  useEffect(() => {
    if (auctionHistoryData && auction) {
      // set Total lot
      const { lastedPrice } = getLastedOwnerBid(auctionHistoryData);
      const { quantity } = auction;
      setTotalLot(Math.floor(quantity * lastedPrice));
      setBiddingHistory(auctionHistoryData);
    }
  }, [auctionHistoryData, auction]);

  useEffect(() => {
    if (biddingHistory && biddingHistory.length > 0) {
      setLowestBid(Math.floor(biddingHistory[biddingHistory.length - 1].price));
    }
  }, [biddingHistory]);

  useEffect(() => {
    if (!!newHistory) {
      console.log('Have new history ');
      const lastHistory = !!biddingHistory
        ? biddingHistory?.[biddingHistory?.length - 1]
        : null;
      if (!lastHistory) {
        console.log('Empty history');
        setBiddingHistory([newHistory]);
      } else if (
        lastHistory.reverseAuctionHistoryId !==
          newHistory.reverseAuctionHistoryId &&
        newHistory.reverseAuctionId === auction.id
      ) {
        const cloneHistory = [...biddingHistory];
        setBiddingHistory([...cloneHistory, newHistory]);
      }

      setNewHistory(null);
    }
  }, [newHistory]);

  useEffect(() => {
    signalR.onListen('NewBid', (history) => {
      if (!!history?.price) {
        console.log('Have new price: ', history.price);
        setNewHistory(history);
      }
    });
  }, [signalR]);

  if (!auction) {
    return null;
  }
  const { product = {}, quantity } = auction;

  const { unitOfMeasure = {} } = product;
  return (
    <div>
      <BiddingAuctionHistoryAllComponent
        isAggregator={isAggregator}
        biddingHistory={biddingHistory}
        unitOfMeasure={unitOfMeasure}
      />

      <Row justify="center">
        <Card bordered={false} style={{ textAlign: 'center' }}>
          <Statistic
            title="Lowest Bid"
            value={lowestBid ? displayCurrency(lowestBid) : '---'}
            precision={0}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Row>

      <Row gutter={16}>
        <Col md={12} sm={24}>
          <BiddingAuctionSubmitComponent
            auction={auction}
            totalLot={totalLot}
            setTotalLot={setTotalLot}
            lowestBid={lowestBid}
            auctionHistory={biddingHistory}
          />
        </Col>
        <Col md={12} sm={24}>
          <BiddingAuctionHistoryComponent
            auctionHistory={biddingHistory}
            totalQuantity={quantity}
          />
        </Col>
      </Row>
    </div>
  );
};
export default connectToRedux(BiddingAuctionComponent);
