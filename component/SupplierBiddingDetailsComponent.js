import React, { Fragment, useEffect, useState } from 'react';
import {
  Empty,
  Row,
  Statistic,
  Tabs,
  Tag,
  Typography,
  Modal,
  Button
} from 'antd';
import { ExclamationCircleOutlined, LeftOutlined } from '@ant-design/icons';
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
import {
  B_ACTIVE,
  B_CANCELED,
  B_CLOSED,
  B_DONE,
  B_FUTURE
} from '../enums/biddingStatus';
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
  const [minimumDuration, setMinimumDuration] = useState(null);
  const [deadline, setDeadLine] = useState(null);
  const router = useRouter();
  const [isAnimation, setIsAnimation] = useState(false);
  const { id: auctionId } = router.query;
  const [isEnd, setIsEnd] = useState(false);
  useEffect(() => {
    if (auctionId && firstTime) {
      getAuctionDetails(auctionId);
      setFirstTime(false);
    }
  }, [auctionId, firstTime, getAuctionDetails]);
  useEffect(() => {
    if (isAnimation === true) {
      setIsAnimation(false);
    }
  }, [isAnimation]);
  useEffect(() => {
    if (
      auctionDetailsData &&
      auctionDetailsData.actualDuration &&
      auctionDetailsData.auctionStartTime
    ) {
      setMinimumDuration(auctionDetailsData.minimumDuration);
      setDeadLine(
        new Date(getUtcTime(auctionDetailsData.auctionStartTime)).getTime() +
          1000 * 60 * auctionDetailsData.actualDuration
      );
    }
  }, [auctionDetailsData]);

  useEffect(() => {
    signalR.onListen('NewBid', (history) => {
      if (history.actualDuration) {
        setDeadLine(
          new Date(getUtcTime(auctionDetailsData.auctionStartTime)).getTime() +
            1000 * 60 * history?.actualDuration
        );
        if (minimumDuration !== history.actualDuration) {
          setIsAnimation(true);
        }
      }
    });
    return () => {
      signalR.stopConnection();
    };
  }, [auctionDetailsData, minimumDuration]);
  useEffect(() => {
    signalR.onListen('AuctionClosed', (id) => {
      if (id === auctionDetailsData?.id) {
        setIsEnd(true);
      }
    });
  }, [auctionDetailsData]);
  if (!auctionDetailsData) {
    return <Empty description="Can not find any event" />;
  }
  const { dynamicClosePeriod, isBeingRemoved, reverseAuctionStatus } =
    auctionDetailsData || {};
  if (isBeingRemoved || [B_CANCELED].includes(reverseAuctionStatus?.id)) {
    Router.push('/supplier/bidding');
  }
  if (isEnd) {
    Modal.info({
      keyboard: false,
      title: 'Reverse Auction has ended',
      icon: <ExclamationCircleOutlined />,
      content: 'You will be notified for Order if you won this bid.',
      okText: 'Go to bidding list',
      cancelText: false,
      onOk: () => {
        Router.push('/supplier/bidding');
      }
    });
  }
  return (
    <div>
      <Row justify="space-between">
        <div>
          <Button onClick={() => Router.push('/supplier/bidding')} type="link">
            <LeftOutlined /> Back to bidding list
          </Button>
        </div>
        {reverseAuctionStatus?.id === B_ACTIVE ? (
          <div style={{ position: 'relative' }}>
            {/* <Tag color="blue">
            {reverseAuctionStatus?.id === B_ACTIVE ? (
              <Fragment>
                <Row align="middle">
                  <Title style={{ fontWeight: 500, marginBottom: 0 }} level={5}>
                    Time Remaining:{' '}
                  </Title>
                  <span>&nbsp;</span>
                  {deadline && (
                    <Countdown title="" value={deadline} onFinish={onFinish} />
                  )}
                </Row>
                {isAnimation ? (
                  <AnimationTime time={dynamicClosePeriod} />
                ) : null}
              </Fragment>
            ) : reverseAuctionStatus?.id === B_FUTURE ? (
              <Title style={{ fontWeight: 500, marginBottom: 0 }} level={5}>
                Event has not started yet!
              </Title>
            ) : (
              [B_DONE, B_CLOSED].includes(reverseAuctionStatus?.id) && (
                <Title style={{ fontWeight: 500, marginBottom: 0 }} level={5}>
                  Event has been closed!
                </Title>
              )
            )}
          </Tag> */}
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
            {isAnimation ? <AnimationTime time={dynamicClosePeriod} /> : null}
          </div>
        ) : reverseAuctionStatus?.id === B_FUTURE ? (
          <Tag
            style={{ display: 'flex', alignItems: 'center' }}
            color="warning"
          >
            Event has not started yet!
          </Tag>
        ) : (
          [B_DONE, B_CLOSED].includes(reverseAuctionStatus?.id) && (
            <Tag style={{ display: 'flex', alignItems: 'center' }}>
              Event has been closed!
            </Tag>
          )
        )}
      </Row>
      <Tabs
        defaultActiveKey={reverseAuctionStatus?.id === B_FUTURE ? '1' : '3'}
      >
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
        <TabPane
          disabled={reverseAuctionStatus?.id === B_FUTURE ? true : false}
          tab={
            <div>
              {reverseAuctionStatus?.id === B_ACTIVE && (
                <Fragment>
                  <img src="/static/images/live.png" alt="live" width={20} />
                  <span>&nbsp;</span>
                </Fragment>
              )}
              <span>Reverse Auction</span>
            </div>
          }
          key="3"
        >
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
