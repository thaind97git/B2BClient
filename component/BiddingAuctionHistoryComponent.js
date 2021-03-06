import React from 'react';
import { Table, Typography } from 'antd';
import { DATE_TIME_FORMAT, displayCurrency, getUtcTime } from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { placeNewBid, PlaceNewBidData } from '../stores/AuctionState';
import Moment from 'react-moment';

const { Title } = Typography;
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

const BiddingAuctionHistoryComponent = ({
  auctionHistory = [],
  totalQuantity = 0
}) => {
  const getOwnerBid = (bidHistory = []) => {
    const arrayOfOwner =
      (bidHistory && bidHistory.filter((bid = {}) => !!bid.supplier)) || [];
    return {
      data: arrayOfOwner.sort(
        (a, b) =>
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      ),
      totalCount: arrayOfOwner.length
    };
  };

  const { totalCount, data = [] } = getOwnerBid(auctionHistory);

  return (
    <div style={{ marginTop: 46 }}>
      <Table
        title={() => <b>Your Bidding History</b>}
        bordered
        columns={columns}
        dataSource={data.map((item, index) => {
          return {
            time: (
              <Moment format={DATE_TIME_FORMAT}>
                {getUtcTime(item.dateCreated)}
              </Moment>
            ),
            bid: displayCurrency(item.price),
            total: displayCurrency(totalQuantity * item.price),
            key: index
          };
        })}
        pagination={{ total: totalCount, defaultPageSize: 5 }}
      />
    </div>
  );
};
export default connectToRedux(BiddingAuctionHistoryComponent);
