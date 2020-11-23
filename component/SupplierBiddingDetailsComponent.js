import React, { useEffect, useState } from 'react';
import { Empty, Row, Statistic, Tabs, Tag, Typography } from 'antd';
import { ADMIN, SUPPLIER } from '../enums/accountRoles';
import BiddingOverviewComponent from './BiddingOverviewComponent';
import BiddingAuctionComponent from './BiddingAuctionComponent';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getAuctionDetails,
  GetAuctionDetailsData
} from '../stores/AuctionState';
import { useRouter } from 'next/router';
import moment from 'moment';
import { getUtcTime } from '../utils';
const { TabPane } = Tabs;
const { Countdown } = Statistic;
const { Title } = Typography;
function onFinish() {
  console.log('finished!');
}

const connectToRedux = connect(
  createStructuredSelector({
    auctionDetailsData: GetAuctionDetailsData
  }),
  (dispatch) => ({
    getAuctionDetails: (id) => dispatch(getAuctionDetails(id))
  })
);
const SupplierBiddingDetailsComponent = ({
  role = SUPPLIER,
  auctionDetailsData,
  getAuctionDetails
}) => {
  const [firstTime, setFirstTime] = useState(true);
  const router = useRouter();
  const { id: auctionId } = router.query;
  useEffect(() => {
    if (auctionId && firstTime) {
      getAuctionDetails(auctionId);
      setFirstTime(false);
    }
  }, [auctionId, firstTime, getAuctionDetails]);
  if (!auctionDetailsData) {
    return <Empty description="Can not find any event" />;
  }
  const { auctionStartTime, minimumDuration } = auctionDetailsData || {};
  const deadline =
    new Date(getUtcTime(auctionStartTime)).getTime() +
    1000 * 60 * minimumDuration;
  return (
    <div>
      <Row justify="space-between">
        <div></div>
        <Tag color="blue">
          <Row align="middle">
            <Title style={{ fontWeight: 500, marginBottom: 0 }} level={5}>
              Time Remaining:{' '}
            </Title>
            <span>&nbsp;</span>
            <Countdown title="" value={deadline} onFinish={onFinish} />
          </Row>
        </Tag>
      </Row>
      <Tabs defaultActiveKey="1">
        <TabPane
          className="bidding-over-view"
          tab={<span>Overview</span>}
          key="1"
        >
          <BiddingOverviewComponent auction={auctionDetailsData} />
        </TabPane>
        {role === ADMIN && (
          <TabPane tab={<span>Participants</span>} key="2">
            Participants
          </TabPane>
        )}
        <TabPane tab={<span>Reverse Auction</span>} key="5">
          <BiddingAuctionComponent auction={auctionDetailsData} />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default connectToRedux(SupplierBiddingDetailsComponent);
