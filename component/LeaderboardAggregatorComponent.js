import { Skeleton, Table } from 'antd';
import {displayCurrency} from '../utils'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React, { useEffect, useState } from 'react';
import {
  GetTopAggregatorData,
  GetTopAggregatorResetter,
  getTopAggregator,
  GetTopAggregatorError
} from '../stores/DashboardState';

const connectToRedux = connect(
  createStructuredSelector({
    topAggregatorData: GetTopAggregatorData,
    topAggregatorDataError: GetTopAggregatorError
  }),
  (dispatch) => ({
    getTopAggregator: (fromDate) => dispatch(getTopAggregator(fromDate)),
    resetData: () => {
      dispatch(GetTopAggregatorResetter);
    }
  })
);

const columns = [
  {
    title: 'Aggregator Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Total RFQ',
    dataIndex: 'totalRfq',
    key: 'totalRfq'
  },
  {
    title: 'Total Group',
    dataIndex: 'totalGroup',
    key: 'totalGroup'
  },
  {
    title: 'Total Sales',
    dataIndex: 'totalSales',
    key: 'totalSales'
  }
];

const getTopAggregatorTable = (topAggregatorData = []) => {
  return (
    topAggregatorData &&
    topAggregatorData.length > 0 &&
    topAggregatorData.map((aggregator = {}) => {
      return {
        key: aggregator.id,
        name: aggregator.firstName + ' ' + aggregator.lastName,
        totalRfq: aggregator?.totalRFQ,
        totalGroup: aggregator?.totalGroup,
        totalSales: displayCurrency(aggregator?.totalSale)
      };
    })
  );
};

const LeaderboardAggregatorComponent = ({
  topAggregatorData,
  getTopAggregator,
  resetData,
  topAggregatorDataError,
  date
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTopAggregator(date);
  }, [date, getTopAggregator]);

  useEffect(() => {
    if (topAggregatorData || topAggregatorDataError) {
      setLoading(false);
    }
  }, [topAggregatorData, topAggregatorDataError]);

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
      dataSource={ getTopAggregatorTable(topAggregatorData) || []}
    />
  );
};

export default connectToRedux(LeaderboardAggregatorComponent);
