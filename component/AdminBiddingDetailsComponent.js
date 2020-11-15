import { Card, Col, Divider, Empty, Row, Typography } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import TabsLayout from '../layouts/TabsLayout';
import BiddingSupplierListComponent from './BiddingSupplierListComponent';
import BiddingStatusComponent from './Utils/BiddingStatusComponent';
import BiddingOverviewComponent from './BiddingOverviewComponent';
import BiddingResultListComponent from './BiddingResultListComponent';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getAuctionDetails,
  GetAuctionDetailsData
} from '../stores/AuctionState';
import { useRouter } from 'next/router';
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    auctionDetailsData: GetAuctionDetailsData
  }),
  (dispatch) => ({
    getAuctionDetails: (id) => dispatch(getAuctionDetails(id))
  })
);
const AdminBiddingDetailsComponent = ({
  auctionDetailsData,
  getAuctionDetails
}) => {
  const [defaultTab, setDefaultTab] = useState('0');
  const [firstTime, setFirstTime] = useState(true);
  const router = useRouter();
  const { id: auctionId } = router.query;
  useEffect(() => {
    if (auctionId && firstTime) {
      getAuctionDetails(auctionId);
      setFirstTime(false);
    }
  }, [auctionId, firstTime, getAuctionDetails]);
  if (!auctionId || !auctionDetailsData) {
    return <Empty description="Can not find any event" />;
  }

  const {
    reverseAuctionStatus = {},
    aggregator = {},
    group = {}
  } = auctionDetailsData;
  const { firstName, lastName } = aggregator;
  const BIDDING = [
    {
      title: 'Overview',
      key: '0',
      content: (
        <BiddingOverviewComponent
          auction={auctionDetailsData}
          isSupplier={false}
        />
      )
    },
    {
      title: 'Suppliers',
      key: '1',
      content: <BiddingSupplierListComponent />
    },
    {
      title: 'Reverse Auction',
      key: '2',
      content: <BiddingResultListComponent />
    }
  ];
  return (
    <Fragment>
      <Card
        style={{ width: '100%', boxShadow: '0 2px 6px rgba(28,35,43,0.06)' }}
      >
        <Row justify="space-between">
          <Col span={14}>
            <Title level={4}>Group Name: {group.description}</Title>
          </Col>
          <Col span={8}>
            <Row align="middle" justify="end">
              <div>
                Auction Status:{' '}
                <BiddingStatusComponent status={reverseAuctionStatus.id} />
              </div>
              <Divider type="vertical" />
              <div>
                Host: <b>{`${firstName} ${lastName}`}</b>
              </div>
            </Row>
          </Col>
        </Row>
      </Card>
      <TabsLayout
        tabs={BIDDING}
        defaultTab={defaultTab}
        setDefaultTab={setDefaultTab}
      />
    </Fragment>
  );
};

export default connectToRedux(AdminBiddingDetailsComponent);
