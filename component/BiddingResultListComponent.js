import { Collapse, Row, Table, Typography, List, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import { displayCurrency } from '../utils';
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
            {percentageSaving.toFixed(2)} %
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

const dataSrc = [
  {
    currentValue: 850000,
    noBids: 8,
    bestBid: 740000,
    leadSupplier: 'Supplier Rank 1',
    active: 3
  }
];
const getRecordHistory = ({ auctionData = [] }) => {
  return (
    (auctionData &&
      auctionData.map((auction) => {
        let result = `${moment
          .utc(auction.dateCreated)
          .local()
          .format('hh:mm:ss')} ${get('supplier.description')(
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
  auction
}) => {
  const [biddingHistory, setBiddingHistory] = useState([]);

  useEffect(() => {
    if (auction) {
      const { id } = auction;
      getAuctionHistory(id);
    }
  }, [auction, getAuctionHistory]);

  // Set history total lot at the first load
  useEffect(() => {
    if (auctionHistoryData && auction) {
      console.log({ auctionHistoryData });
      // set Total lot
      // setTotalLot(Math.floor(quantity * lastedPrice));
      setBiddingHistory(auctionHistoryData);
    }
  }, [auctionHistoryData, auction]);

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
          history.reverseAuctionHistoryId
        ) {
          const cloneHistory = [...biddingHistory];
          cloneHistory.push(history);
          setBiddingHistory([...cloneHistory]);
        }
      }
    });
  }, [biddingHistory]);
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
        dataSource={dataSrc}
      />
      <Row justify="start" style={{ marginTop: 32 }}>
        <Button
          type="primary"
          onClick={() => {
            Router.push(`/aggregator/order/confirmation?groupId=${1}`);
          }}
        >
          Closing Deal
        </Button>
      </Row>
    </Row>
  );
};

export default connectToRedux(BiddingResultListComponent);
