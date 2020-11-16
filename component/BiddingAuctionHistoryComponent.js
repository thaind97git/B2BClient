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
  Table,
  List
} from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { DEFAULT_PAGING_INFO, displayCurrency } from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { placeNewBid, PlaceNewBidData } from '../stores/AuctionState';

const { Panel } = Collapse;
const connectToRedux = connect(
  createStructuredSelector({
    placeBidData: PlaceNewBidData
  }),
  (dispatch) => ({
    placeNewBid: ({ reverseAuctionId, bid }, callback) =>
      dispatch(placeNewBid({ reverseAuctionId, bid }, callback))
  })
);
const columns = [
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no'
  },
  {
    title: 'Bid Per UOM',
    dataIndex: 'bid',
    key: 'bid',
    render: (text, record) => ` ${record.bid}`
  },
  {
    title: 'Total Lot',
    dataIndex: 'total',
    key: 'total',
    render: (text, record) => `${record.total}`
  }
  // {
  //   title: "Rank",
  //   key: "rank",
  //   render: (text, record) => <Rank rank={record.rank} />,
  // },
];

const data2 = [
  '12:40:00 A Supplier has bid 800,000 đ per product',
  '12:40:30 A Supplier has bid 790,000 đ per product',
  <b>12:41:10 You have bid 780,000 đ per product</b>,
  '12:41:30 A Supplier has bid 772,000 đ per product',
  <b>12:41:50 You have bid 765,000 đ per product</b>,
  '12:43:40 A Supplier has bid 764,000 đ per product',
  '12:45:10 A Supplier has bid 760,000 đ per product',
  <b>12:46:05 You have bid 740,000 đ per product</b>
];

const data = [
  {
    no: 1,
    bid: displayCurrency(780000),
    total: displayCurrency(171600000)
  },
  {
    no: 2,
    bid: displayCurrency(765000),
    total: displayCurrency(168300000)
  },
  {
    no: 3,
    bid: displayCurrency(740000),
    total: displayCurrency(162800000)
  }
];

const unit = 220;
const BiddingAuctionComponent = ({ auctionId }) => {
  const [page, setPage] = useState(DEFAULT_PAGING_INFO.page);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGING_INFO.pageSize);

  return (
    <div>
      <Collapse defaultActiveKey="1">
        <Panel header="Your Bidding History" key="1">
          {/* <Empty /> */}
          <Table columns={columns} dataSource={data} />
        </Panel>
      </Collapse>
    </div>
  );
};
export default connectToRedux(BiddingAuctionComponent);
