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
  GetAuctionDetailsData,
  GetAuctionDetailsResetter
} from '../stores/AuctionState';
import Router, { useRouter } from 'next/router';
import { getUtcTime } from '../utils';
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

const connectToRedux = connect(
  createStructuredSelector({
    auctionDetailsData: GetAuctionDetailsData
  }),
  (dispatch) => ({
    getAuctionDetails: (id) => dispatch(getAuctionDetails(id)),
    resetAuctionDetails: () => dispatch(GetAuctionDetailsResetter)
  })
);

const SupplierBiddingDetailsComponent = ({
  role = SUPPLIER,
  auctionDetailsData,
  getAuctionDetails,
  resetAuctionDetails
}) => {
  const [deadline, setDeadLine] = useState(null);
  const router = useRouter();
  const [isAnimation, setIsAnimation] = useState(false);
  const { id: auctionId } = router.query;

  const [newHistory, setNewHistory] = useState(null);

  function onFinish() {
    console.log('finished!');
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
  useEffect(() => {
    if (auctionId) {
      getAuctionDetails(auctionId);
    }
  }, [auctionId, getAuctionDetails]);
  useEffect(() => {
    if (isAnimation === true) {
      setIsAnimation(false);
    }
  }, [isAnimation]);
  useEffect(() => {
    if (auctionDetailsData && auctionDetailsData.auctionStartTime) {
      setDeadLine(
        new Date(getUtcTime(auctionDetailsData.auctionStartTime)).getTime() +
          1000 * 60 * auctionDetailsData.minimumDuration
      );
    }
  }, [auctionDetailsData]);

  if (!auctionDetailsData) {
    return <Empty description="Can not find any event" />;
  }
  const { isBeingRemoved, reverseAuctionStatus } = auctionDetailsData || {};
  if (isBeingRemoved || [B_CANCELED].includes(reverseAuctionStatus?.id)) {
    Router.push('/supplier/bidding');
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
            newHistory={newHistory}
            // signalR={signalR}
            auction={auctionDetailsData}
            setNewHistory={setNewHistory}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default connectToRedux(SupplierBiddingDetailsComponent);
