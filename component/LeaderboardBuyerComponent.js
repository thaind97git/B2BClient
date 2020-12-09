import { Skeleton, Table } from 'antd';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React, { useEffect, useState } from 'react';
import {
  GetTopBuyerData,
  GetTopBuyerResetter,
  getTopBuyer,
  GetTopBuyerError
} from '../stores/DashboardState';

const connectToRedux = connect(
  createStructuredSelector({
    topBuyerData: GetTopBuyerData,
    topBuyerDataError: GetTopBuyerError
  }),
  (dispatch) => ({
    getTopBuyer: (fromDate) => dispatch(getTopBuyer(fromDate)),
    resetData: () => {
      dispatch(GetTopBuyerResetter);
    }
  })
);

const columns = [
  {
    title: 'Buyer Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Total RFQ',
    dataIndex: 'totalRfq',
    key: 'totalRfq'
  }
];

const getTopBuyerTable = (topBuyerData = []) => {
  return (
    topBuyerData &&
    topBuyerData.length > 0 &&
    topBuyerData.map((buyer = {}) => ({
      key: buyer?.id,
      name: buyer?.firstName + ' ' + buyer?.lastName,
      totalRfq: buyer?.totalRFQ
    }))
  );
};

const LeaderboardBuyerComponent = ({
  topBuyerData,
  getTopBuyer,
  resetData,
  topBuyerDataError,
  date
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTopBuyer(date);
  }, [date, getTopBuyer]);

  useEffect(() => {
    if (topBuyerData || topBuyerDataError) {
      setLoading(false);
    }
  }, [topBuyerData, topBuyerDataError]);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  if (loading) {
    return <Skeleton active />;
  }
  return (
    <Table
      pagination={false}
      bordered
      columns={columns}
      dataSource={topBuyerData ? getTopBuyerTable(topBuyerData) : []}
    />
  );
};

export default connectToRedux(LeaderboardBuyerComponent);
