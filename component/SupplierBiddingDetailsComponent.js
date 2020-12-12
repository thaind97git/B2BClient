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
import Router, { useRouter } from 'next/router';
import { getUtcTime } from '../utils';
import SignalR from '../libs/signalR';
import { B_CANCELED, B_FEATURE } from '../enums/biddingStatus';
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
const signalR = new SignalR({
  hubDomain: 'reverseAuctionHub'
});
signalR.startConnection();

const AnimationTime = ({ time }) => {
  return (
    <div style={{ position: 'absolute', top: 0, left: -46 }}>
      <div style={{ position: 'relative' }}>
        <span
          style={{ color: 'green', fontSize: 28, position: 'relative' }}
          className="flash"
        >
          + {time}
        </span>
      </div>
      <style jsx>{`
        .flash {
          -webkit-animation: flash linear 1.5s;
          animation: flash linear 1.5s;
          animation-fill-mode: forwards;
        }
        @-webkit-keyframes flash {
          0% {
            opacity: 0;
            bottom: 0px;
          }
          50% {
            opacity: 0.5;
            bottom: 10px;
          }
          90% {
            opacity: 1;
            bottom: 25px;
          }
          100% {
            opacity: 0;
            bottom: 25px;
          }
        }
        @keyframes flash {
          0% {
            opacity: 0;
            bottom: 0px;
          }
          50% {
            opacity: 0.5;
            bottom: 10px;
          }
          90% {
            opacity: 1;
            bottom: 25px;
          }
          100% {
            opacity: 0;
            bottom: 25px;
          }
        }
      `}</style>
    </div>
  );
};

const SupplierBiddingDetailsComponent = ({
  role = SUPPLIER,
  auctionDetailsData,
  getAuctionDetails
}) => {
  const [firstTime, setFirstTime] = useState(true);
  const [duration, setDuration] = useState(null);
  const [deadline, setDeadLine] = useState(null);
  const router = useRouter();
  const { id: auctionId } = router.query;
  useEffect(() => {
    if (auctionId && firstTime) {
      getAuctionDetails(auctionId);
      setFirstTime(false);
    }
  }, [auctionId, firstTime, getAuctionDetails]);

  useEffect(() => {
    if (
      auctionDetailsData &&
      auctionDetailsData.actualDuration &&
      auctionDetailsData.auctionStartTime
    ) {
      // setDuration(auctionDetailsData.actualDuration)
      setDeadLine(
        new Date(getUtcTime(auctionDetailsData.auctionStartTime)).getTime() +
          1000 * 60 * auctionDetailsData.actualDuration
      );
    }
  }, [auctionDetailsData]);

  useEffect(() => {
    signalR.onListen('NewBid', (history) => {});
    return () => {
      signalR.stopConnection();
    };
  }, []);
  if (!auctionDetailsData) {
    return <Empty description="Can not find any event" />;
  }
  const { dynamicClosePeriod, isBeingRemoved, reverseAuctionStatus } =
    auctionDetailsData || {};
  if (
    isBeingRemoved ||
    [B_FEATURE, B_CANCELED].includes(reverseAuctionStatus?.id)
  ) {
    Router.push('/supplier/bidding');
  }
  return (
    <div>
      <Row justify="space-between">
        <div></div>
        <div style={{ position: 'relative' }}>
          <Tag color="blue">
            <Row align="middle">
              <Title style={{ fontWeight: 500, marginBottom: 0 }} level={5}>
                Time Remaining:{' '}
              </Title>
              <span>&nbsp;</span>
              {deadline && (
                <Countdown title="" value={deadline} onFinish={onFinish} />
              )}
            </Row>
          </Tag>
          <AnimationTime time={dynamicClosePeriod} />
        </div>
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
          <BiddingAuctionComponent
            signalR={signalR}
            auction={auctionDetailsData}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default connectToRedux(SupplierBiddingDetailsComponent);
