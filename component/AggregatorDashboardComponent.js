import { Card, Col, DatePicker, Empty, Row, Skeleton, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  GetAuctionStatisticData,
  getAuctionStatistic,
  GetAuctionStatisticError,
  GetAuctionStatisticResetter,
  GetGroupByAggregatorStatisticData,
  getGroupByAggregatorStatistic,
  GetGroupByAggregatorStatisticError,
  GetGroupByAggregatorStatisticResetter
} from '../stores/DashboardState';
import moment from 'moment';

let G2Plot;
if (process.browser) {
  G2Plot = require('@ant-design/charts');
}
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    auctionStatictic: GetAuctionStatisticData,
    auctionStaticticError: GetAuctionStatisticError,
    groupStatictic: GetGroupByAggregatorStatisticData,
    groupStaticticError: GetGroupByAggregatorStatisticError
  }),
  (dispatch) => ({
    getAuctionStatistic: (fromDate) => dispatch(getAuctionStatistic(fromDate)),
    resetDataAuction: () => {
      dispatch(GetAuctionStatisticResetter);
    },
    getGroupStatistic: (fromDate) =>
      dispatch(getGroupByAggregatorStatistic(fromDate)),
    resetDataGroup: () => {
      dispatch(GetGroupByAggregatorStatisticResetter);
    }
  })
);

const getAuctionStatisticDataPie = (dataAuction = []) => {
  return (
    dataAuction &&
    dataAuction.length > 0 &&
    dataAuction.map((status = {}) => ({
      type: status?.reverseAuctionStatus?.description,
      value: status?.total
    }))
  );
};

const getGroupStatisticDataPie = (dataGroup = []) => {
  return (
    dataGroup &&
    dataGroup.length > 0 &&
    dataGroup.map((status = {}) => ({
      type: status?.groupStatus?.description,
      value: status?.total
    }))
  );
};

const AggregatorDashBoardComponent = ({
  auctionStatictic,
  auctionStaticticError,
  getAuctionStatistic,
  resetDataAuction,
  groupStatictic,
  groupStaticticError,
  getGroupStatistic,
  resetDataGroup
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getGroupStatistic(
      moment(moment()).subtract(0, 'months').format('YYYY-MM-DD')
    );
    getAuctionStatistic(
      moment(moment()).subtract(0, 'months').format('YYYY-MM-DD')
    );
  }, [getGroupStatistic, getAuctionStatistic]);

  useEffect(() => {
    if (
      auctionStatictic ||
      auctionStaticticError ||
      groupStatictic ||
      groupStaticticError
    ) {
      setLoading(false);
    }
  }, [
    auctionStatictic,
    auctionStaticticError,
    groupStatictic,
    groupStaticticError
  ]);

  useEffect(() => {
    return () => {
      resetDataAuction();
      resetDataGroup();
    };
  }, [resetDataAuction, resetDataGroup]);

  if (loading) {
    return <Skeleton active />;
  }

  function onAuctionChange(date, dateString) {
    //resetData();
    getAuctionStatistic(dateString + '-01');
  }

  function onGroupChange(date, dateString) {
    //resetData();
    getGroupStatistic(dateString + '-01');
  }

  const configRequest = {
    width: 380,
    autoFit: false,
    appendPadding: 10,
    data: getGroupStatisticDataPie(groupStatictic),
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0,
    meta: {
      value: {
        formatter: (v) => (v > 1 ? `${v} Groups` : `${v} Group`)
      }
    },
    label: {
      type: 'inner',
      offset: '-50%',
      autoRotate: false,
      style: { textAlign: 'center' },
      formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`
    },
    statistic: {
      title: {
        offsetY: -8
      },
      content: {
        offsetY: -4
      }
    }
  };
  const configAuction = {
    width: 380,
    autoFit: false,
    appendPadding: 10,
    data: getAuctionStatisticDataPie(auctionStatictic),
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0,
    meta: {
      value: {
        formatter: (v) => (v > 1 ? `${v} Auctions` : `${v} Auction`)
      }
    },
    label: {
      type: 'inner',
      offset: '-50%',
      autoRotate: false,
      style: { textAlign: 'center' },
      formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`
    },
    statistic: {
      title: {
        offsetY: -8
      },
      content: {
        offsetY: -4
      }
    }
  };
  return (
    <Row justify="space-around">
      <Col md={24} lg={12}>
        <Card
          title={
            <Row justify="space-between">
              <Title level={4}>Group Statistic</Title>
              <DatePicker
                picker="month"
                onChange={onGroupChange}
                defaultValue={moment(moment(), 'YYYY-MM-DD').subtract(
                  0,
                  'months'
                )}
              />
            </Row>
          }
          style={{ width: '98%' }}
          bordered={false}
        >
          <Row justify="center">
            {groupStatictic ? (
              groupStatictic.length === 0 ? (
                <Empty description="No group created in this month"></Empty>
              ) : (
                G2Plot && <G2Plot.Pie {...configRequest} />
              )
            ) : (
              <Empty description="No group created in this month"></Empty>
            )}
          </Row>
        </Card>
      </Col>
      <Col md={24} lg={12}>
        <Card
          title={
            <Row justify="space-between">
              <Title level={4}>Reverse Auction Statistic</Title>
              <DatePicker
                picker="month"
                onChange={onAuctionChange}
                defaultValue={moment(moment(), 'YYYY-MM-DD').subtract(
                  0,
                  'months'
                )}
              />
            </Row>
          }
          style={{ width: '98%' }}
          bordered={false}
        >
          <Row justify="center">
            {auctionStatictic ? (
              auctionStatictic.length === 0 ? (
                <Empty description="No auction of this month"></Empty>
              ) : (
                G2Plot && <G2Plot.Pie {...configAuction} />
              )
            ) : (
              <Empty description="No auction of this month"></Empty>
            )}
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default connectToRedux(AggregatorDashBoardComponent);
