import {
  Badge,
  Button,
  Descriptions,
  InputNumber,
  Row,
  Space,
  Tag
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { useState } from 'react';
import { B_ACTIVE } from '../enums/biddingStatus';
import { displayCurrency } from '../utils';
import { connect } from 'react-redux';
import { placeNewBid, PlaceNewBidData } from '../stores/AuctionState';
import { createStructuredSelector } from 'reselect';
import { useEffect } from 'react';
const connectToRedux = connect(
  createStructuredSelector({
    placeBidData: PlaceNewBidData
  }),
  (dispatch) => ({
    placeNewBid: ({ reverseAuctionId, bid }, callback) =>
      dispatch(placeNewBid({ reverseAuctionId, bid }, callback))
  })
);
const Rank = ({ rank }) => {
  let color;
  switch (rank) {
    case 1:
      color = '#52c41a';
      break;
    case 2:
      color = '#faad14';
      break;
    case 3:
      color = '#f5222d';
      break;
    default:
      color = 'black';
      break;
  }
  return <Badge count={rank} style={{ backgroundColor: color }} />;
};

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

const BiddingAuctionSubmitComponent = ({
  auction = {},
  placeNewBid,
  setTotalLot,
  totalLot,
  auctionHistory,
  lowestBid
}) => {
  const [isPlaceBid, setIsPlaceBid] = useState(false);
  const [bidTmp, setBidTmp] = useState(0);
  const [yourLastedBid, setYourLastedBid] = useState(0);
  const [isYouBided, setIsYouBided] = useState(false);

  const [minimumChange, setMinimumChange] = useState(0);
  const [maximumChange, setMaximumChange] = useState(0);

  const [isFirstRank, setIsFirstRank] = useState(false);

  useEffect(() => {
    if (!!auction) {
      const {
        minimumBidChange: miniPercentageChange,
        maximumBidChange: maxPercentageChange
      } = auction;
      setMinimumChange(
        (lowestBid || +auction.currentPrice) -
          (+maxPercentageChange * +auction.currentPrice) / 100 || 0
      );
      if (auctionHistory && auctionHistory.length === 0) {
        // Empty bid
        setMaximumChange(auction?.currentPrice);
      } else {
        setMaximumChange(
          (lowestBid || +auction.currentPrice) -
            (+miniPercentageChange * +auction.currentPrice) / 100 || 0
        );
      }
    }
  }, [auction, lowestBid, auctionHistory]);

  useEffect(() => {
    if (auctionHistory && auctionHistory?.length > 0) {
      const { lastedPrice, isBided } = getLastedOwnerBid(auctionHistory);
      setIsYouBided(isBided);
      setYourLastedBid(lastedPrice);
    }
  }, [auctionHistory]);

  // Check is first rank
  useEffect(() => {
    if (lowestBid === yourLastedBid) {
      setIsFirstRank(true);
    } else {
      setIsFirstRank(false);
    }
  }, [yourLastedBid, lowestBid]);

  const { id: reverseAuctionId, auctionName, product = {}, quantity } = auction;
  const { productName, unitOfMeasure = {} } = product;
  return (
    <Descriptions title="Reverse Auction Information" bordered>
      <Descriptions.Item label="REVERSE AUCTION NAME" span={3}>
        {auctionName}
      </Descriptions.Item>
      <Descriptions.Item label="PRODUCT NAME" span={3}>
        {productName}
      </Descriptions.Item>
      <Descriptions.Item label="QUANTITY x UNIT MEASURE (UOM)" span={3}>
        {quantity} x {unitOfMeasure.description}
      </Descriptions.Item>
      <Descriptions.Item label="BID RANGE" span={3}>
        {displayCurrency(Math.floor(minimumChange))} -{' '}
        {displayCurrency(Math.floor(maximumChange))}
      </Descriptions.Item>
      <Descriptions.Item label="YOUR BID PER UOM" span={3}>
        {isPlaceBid ? (
          <InputNumber
            style={{ minWidth: 200 }}
            min={Math.floor(minimumChange)}
            max={Math.floor(maximumChange)}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/,*/g, '')}
            onChange={(value) => {
              setBidTmp(value);
              setTotalLot(Math.floor(value * quantity));
            }}
          />
        ) : !isYouBided ? (
          '-'
        ) : (
          <b>{displayCurrency(Math.floor(yourLastedBid))} </b>
        )}
      </Descriptions.Item>
      <Descriptions.Item label="YOUR RANK" span={3}>
        {lowestBid !== 0 && isFirstRank ? (
          <Rank rank={1} />
        ) : (
          <Tag icon={<ExclamationCircleOutlined />} color="warning">
            You are not rank 1
          </Tag>
        )}
      </Descriptions.Item>
      <Descriptions.Item label="TOTAL LOT VALUE PLACED" span={3}>
        {`${displayCurrency(totalLot)}`}
      </Descriptions.Item>
      <Descriptions.Item label="ENTER NEW BID" span={3}>
        {isPlaceBid ? (
          <Row>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  placeNewBid({ reverseAuctionId, bid: bidTmp });
                  setIsPlaceBid(false);
                }}
              >
                Submit
              </Button>
              <Button
                danger
                onClick={() => {
                  setTotalLot(Math.floor(quantity * yourLastedBid));
                  setIsPlaceBid(false);
                }}
              >
                Cancel
              </Button>
            </Space>
          </Row>
        ) : (
          <Button
            disabled={
              (lowestBid !== 0 && isFirstRank) ||
              auction?.reverseAuctionStatus?.id !== B_ACTIVE
            }
            onClick={() => setIsPlaceBid(true)}
          >
            Place Bid
          </Button>
        )}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default connectToRedux(BiddingAuctionSubmitComponent);
