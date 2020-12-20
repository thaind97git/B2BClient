import { Collapse, List } from 'antd';
import React from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import ScrollToBottom from 'react-scroll-to-bottom';
import { DATE_TIME_FORMAT, displayCurrency } from '../utils';
import { get } from 'lodash/fp';
import moment from 'moment';
const { Panel } = Collapse;

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

const BiddingAuctionHistoryAllComponent = ({
  isAggregator,
  biddingHistory = [],
  unitOfMeasure = {}
}) => {
  return (
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
        {biddingHistory && biddingHistory.length > 0 ? (
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
  );
};
export default BiddingAuctionHistoryAllComponent;
