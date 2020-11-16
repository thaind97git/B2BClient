import React from 'react';
import {
  Collapse,
  Table,
} from 'antd';
import { DATE_TIME_FORMAT, displayCurrency } from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { placeNewBid, PlaceNewBidData } from '../stores/AuctionState';
import Moment from 'react-moment';

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
    title: 'Time',
    dataIndex: 'time',
    key: 'time'
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
];

const BiddingAuctionHistoryComponent = ({ auctionHistory = [], totalQuantity = 0 }) => {
  const getOwnerBid = (bidHistory = []) => {
    const arrayOfOwner =
      bidHistory && bidHistory.filter((bid = {}) => !!bid.supplier) || [];
    return {
      data: arrayOfOwner,
      totalCount: arrayOfOwner.length
    };
  };

  const {totalCount, data = []} = getOwnerBid(auctionHistory)

  return (
    <div style={{marginTop: 40}}>
      <Collapse defaultActiveKey="1">
        <Panel header="Your Bidding History" key="1">
          <Table columns={columns} dataSource={data.map(item => {
            return {
            time: <Moment format={DATE_TIME_FORMAT}>{item.dateCreated}</Moment>,
              bid: displayCurrency(item.price) ,
              total:  displayCurrency(totalQuantity * item.price)
            }
          })} pagination={{total: totalCount, defaultPageSize: 5}} />
        </Panel>
      </Collapse>
    </div>
  );
};
export default connectToRedux(BiddingAuctionHistoryComponent);
