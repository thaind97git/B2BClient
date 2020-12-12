import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Collapse,
  Descriptions,
  InputNumber,
  Row,
  Space,
  Statistic,
  List,
  Badge,
  Tag
} from 'antd';
import {
  CaretRightOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { DATE_TIME_FORMAT, displayCurrency } from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  GetAuctionHistory,
  GetAuctionHistoryData,
  placeNewBid,
  PlaceNewBidData
} from '../stores/AuctionState';
import { get } from 'lodash/fp';
import moment from 'moment';
import ScrollToBottom from 'react-scroll-to-bottom';
import BiddingAuctionHistoryComponent from './BiddingAuctionHistoryComponent';
const { Panel } = Collapse;
const connectToRedux = connect(
  createStructuredSelector({
    placeBidData: PlaceNewBidData,
    auctionHistoryData: GetAuctionHistoryData
  }),
  (dispatch) => ({
    placeNewBid: ({ reverseAuctionId, bid }, callback) =>
      dispatch(placeNewBid({ reverseAuctionId, bid }, callback)),
    getAuctionHistory: (id) => dispatch(GetAuctionHistory(id))
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

const getRecordHistory = ({ auctionData = [], isAggregator = false, unit }) => {
  return (
    (auctionData &&
      auctionData.map((auction) => {
        const isMe = get('supplier.description')(auction) === 'You';
        let result = `${moment
          .utc(auction.dateCreated)
          .local()
          .format(DATE_TIME_FORMAT)} - ${
          isAggregator
            ? get('supplier.description')(auction)
            : isMe
            ? 'You'
            : 'A Supplier'
        } ${isMe ? 'had' : 'has'} bid ${displayCurrency(
          auction.price
        )} per ${unit}`;
        if (isMe) {
          return <b>{result}</b>;
        }
        return <span>{result}</span>;
      })) ||
    []
  );
};

const BiddingAuctionComponent = ({
  auction,
  placeBidData,
  placeNewBid,
  getAuctionHistory,
  auctionHistoryData,
  isAggregator = false,
  signalR
}) => {
  const [isPlaceBid, setIsPlaceBid] = useState(false);
  const [bidTmp, setBidTmp] = useState(0);
  const [totalLot, setTotalLot] = useState(0);
  const [minimumChange, setMinimumChange] = useState(0);
  const [maximumChange, setMaximumChange] = useState(0);

  const [miniPercentageChange, setMiniPercentageChange] = useState(0);
  const [maxPercentageChange, setMaxPercentageChange] = useState(0);

  const [biddingHistory, setBiddingHistory] = useState([]);
  const [lowestBid, setLowestBid] = useState(0);
  const [firstTime, setFirstTime] = useState(true);
  const [yourLastedBid, setYourLastedBid] = useState(0);
  const [isYouBided, setIsYouBided] = useState(false);

  const [isFirstRank, setIsFirstRank] = useState(false);
  useEffect(() => {
    if (auction) {
      const { id, minimumBidChange, maximumBidChange } = auction;
      getAuctionHistory(id);
      setMiniPercentageChange(minimumBidChange);
      setMaxPercentageChange(maximumBidChange);
    }
  }, [auction, getAuctionHistory]);

  // Check is first rank
  useEffect(() => {
    if (lowestBid === yourLastedBid) {
      setIsFirstRank(true);
    } else {
      setIsFirstRank(false);
    }
  }, [yourLastedBid, lowestBid]);

  // Calculate lowest bid at first time load data
  useEffect(() => {
    if (auctionHistoryData && auctionHistoryData.length > 0 && firstTime) {
      const { lastedPrice, isBided } = getLastedOwnerBid(auctionHistoryData);
      setYourLastedBid(lastedPrice);
      setIsYouBided(isBided);
      setLowestBid(
        Math.floor(auctionHistoryData[auctionHistoryData.length - 1].price)
      );
      setFirstTime(false);
    }
  }, [auctionHistoryData, firstTime]);

  // Calculate minimumChange and maximumChange each lowest bid change
  useEffect(() => {
    if (miniPercentageChange && maxPercentageChange && auction) {
      setMinimumChange(
        (lowestBid || +auction.currentPrice) -
          (+maxPercentageChange * +auction.currentPrice) / 100 || 0
      );
      setMaximumChange(
        (lowestBid || +auction.currentPrice) -
          (+miniPercentageChange * +auction.currentPrice) / 100 || 0
      );
    }
  }, [lowestBid, miniPercentageChange.maxPercentageChange]);

  // Set history total lot at the first load
  useEffect(() => {
    if (auctionHistoryData && auction) {
      // set Total lot
      const { lastedPrice } = getLastedOwnerBid(auctionHistoryData);
      const { quantity } = auction;
      setTotalLot(Math.floor(quantity * lastedPrice));
      setBiddingHistory(auctionHistoryData);
    }
  }, [auctionHistoryData, auction, isAggregator]);

  useEffect(() => {
    if (biddingHistory && biddingHistory.length > 0 && !firstTime) {
      setLowestBid(Math.floor(biddingHistory[biddingHistory.length - 1].price));
      const { lastedPrice, isBided } = getLastedOwnerBid(biddingHistory);
      setYourLastedBid(lastedPrice);
      setIsYouBided(isBided);
    }
  }, [biddingHistory, firstTime]);

  useEffect(() => {
    signalR.onListen('NewBid', (history) => {
      if (
        history &&
        history.price &&
        biddingHistory &&
        biddingHistory.length > 0
      ) {
        if (
          biddingHistory[biddingHistory.length - 1].reverseAuctionHistoryId !==
            history.reverseAuctionHistoryId &&
          history.reverseAuctionId === auction.id
        ) {
          const cloneHistory = [...biddingHistory];
          cloneHistory.push(history);
          setBiddingHistory([...cloneHistory]);
        }
      }
    });
  }, [biddingHistory, auction.id]);

  if (!auction) {
    return null;
  }
  const { id: reverseAuctionId, auctionName, product = {}, quantity } = auction;

  const { productName, unitOfMeasure = {} } = product;
  return (
    <div>
      <Collapse
        bordered={false}
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        className="site-collapse-custom-collapse"
      >
        <Panel
          header="Live Reverse Auction Feed"
          key="1"
          className="site-collapse-custom-panel"
        >
          {auctionHistoryData && auctionHistoryData.length > 0 ? (
            <ScrollToBottom>
              <div style={{ height: 200 }}>
                <List
                  size="small"
                  dataSource={
                    getRecordHistory({
                      auctionData: biddingHistory,
                      isAggregator,
                      unit: unitOfMeasure.description
                    }) || []
                  }
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </div>
            </ScrollToBottom>
          ) : (
            <p>
              The Live Auction Feed will provide real-time notifications of
              messages and changes to the auction settings
            </p>
          )}
        </Panel>
      </Collapse>

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
                        // setCurrentBid(bidTemp);
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
                  disabled={lowestBid !== 0 && isFirstRank}
                  onClick={() => setIsPlaceBid(true)}
                >
                  Place Bid
                </Button>
              )}
            </Descriptions.Item>
          </Descriptions>
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
