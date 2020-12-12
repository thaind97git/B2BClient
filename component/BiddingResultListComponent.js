import { Collapse, Row, Table, Typography, List, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import { DATE_TIME_FORMAT, displayCurrency } from '../utils';
import Router from 'next/router';
import SignalR from '../libs/signalR';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  GetAuctionHistoryData,
  GetAuctionHistory
} from '../stores/AuctionState';
import { get } from 'lodash/fp';
import moment from 'moment';
import ScrollToBottom from 'react-scroll-to-bottom';
import { B_CLOSED } from '../enums/biddingStatus';
const { Panel } = Collapse;
const { Link } = Typography;

const signalR = new SignalR({
  hubDomain: 'reverseAuctionHub'
});
signalR.startConnection();

const connectToRedux = connect(
  createStructuredSelector({
    auctionHistoryData: GetAuctionHistoryData
  }),
  (dispatch) => ({
    getAuctionHistory: (id) => dispatch(GetAuctionHistory(id))
  })
);

const columns = [
  {
    title: <b>CURRENT VALUE</b>,
    dataIndex: 'currentValue',
    key: 'currentValue',
    render: (text) => displayCurrency(text)
  },
  {
    title: <b># BIDS</b>,
    dataIndex: 'noBids',
    key: 'noBids'
  },
  {
    title: <b>BEST BID VALUE</b>,
    dataIndex: 'bestBid',
    key: 'bestBid',
    render: (text) => <Link>{displayCurrency(text)}</Link>
  },
  {
    title: <b>LEAD SUPPLIER</b>,
    dataIndex: 'leadSupplier',
    key: 'leadSupplier'
  },
  {
    title: <b>SAVING OFFERED</b>,
    dataIndex: 'savingOffered',
    key: 'savingOffered',
    render: (text, row) => {
      const saving = row.currentValue - row.bestBid;
      const percentageSaving = (saving / row.currentValue) * 100;
      return (
        <span>
          {displayCurrency(saving)} (
          <span style={{ color: 'green' }}>
            {percentageSaving ? percentageSaving.toFixed(2) : 0} %
          </span>
          )
        </span>
      );
    }
  },
  {
    title: <b># ACTIVE SUPPLIER</b>,
    dataIndex: 'active',
    key: 'active'
  }
];

const getActiveSupplier = ({ biddingHistory = [] }) => {
  let suppliers = [];
  biddingHistory.forEach((bid = {}) => {
    const supId = (bid.supplier || {}).id;
    if (!suppliers.includes(supId)) {
      suppliers.push(supId);
    }
  });
  return suppliers.length;
};
const getRecordHistory = ({ auctionData = [] }) => {
  return (
    (auctionData &&
      auctionData.map((auction) => {
        let result = `${moment
          .utc(auction.dateCreated)
          .local()
          .format(DATE_TIME_FORMAT)} - ${get('supplier.description')(
          auction
        )} placed a bid of ${displayCurrency(auction.price)}.`;
        return result;
      })) ||
    []
  );
};

const BiddingResultListComponent = ({
  getAuctionHistory,
  auctionHistoryData,
  auction,
  reverseAuctionId
}) => {
  const [biddingHistory, setBiddingHistory] = useState([]);
  const [result, setResult] = useState({});
  const [firstTime, setFirstTime] = useState(true);
  console.log({ auction });
  useEffect(() => {
    if (auction && firstTime) {
      const { id } = auction;
      getAuctionHistory(id);
      setFirstTime(false);
    }
  }, [auction, getAuctionHistory, firstTime]);

  // Set history at the first load
  useEffect(() => {
    if (auctionHistoryData && auction) {
      setBiddingHistory(auctionHistoryData);
      const lastBid = auctionHistoryData[auctionHistoryData.length - 1] || {};
      const src = {
        currentValue: auction.currentPrice,
        noBids: auctionHistoryData.length,
        bestBid: Math.floor(lastBid.price),
        leadSupplier: (lastBid.supplier || {}).description,
        active: getActiveSupplier({ biddingHistory: auctionHistoryData })
      };
      setResult(src);
    }
  }, [auctionHistoryData, auction]);

  useEffect(() => {
    if (biddingHistory && biddingHistory.length > 0 && !firstTime) {
      const lastBid = biddingHistory[biddingHistory.length - 1] || {};
      const src = {
        currentValue: auction.currentPrice,
        noBids: biddingHistory.length,
        bestBid: Math.floor(lastBid.price),
        leadSupplier: (lastBid.supplier || {}).description,
        active: getActiveSupplier({ biddingHistory })
      };
      setResult(src);
    }
  }, [biddingHistory, firstTime, auction.currentPrice]);

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
  return (
    <Row style={{ width: '100%' }}>
      <Collapse
        style={{ width: '100%', marginBottom: 40 }}
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
          <ScrollToBottom>
            <div style={{ height: 200 }}>
              <List
                size="small"
                dataSource={getRecordHistory({
                  auctionData: biddingHistory || []
                })}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </div>
          </ScrollToBottom>
        </Panel>
      </Collapse>
      <Table
        pagination={false}
        style={{ width: '100%' }}
        columns={columns}
        dataSource={[result]}
      />
      <Row justify="start" style={{ marginTop: 32 }}>
        <Button
          disabled={
            get('reverseAuctionStatus.id')(auction) === B_CLOSED ? false : true
          }
          type="primary"
          onClick={() => {
            Router.push(
              `/aggregator/order/confirmation?reverseAuctionId=${reverseAuctionId}`
            );
          }}
        >
          Create Order
        </Button>
      </Row>
    </Row>
  );
};

export default connectToRedux(BiddingResultListComponent);
