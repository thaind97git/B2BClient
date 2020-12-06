import { Skeleton, Table } from 'antd';
import { displayCurrency } from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React, { useEffect, useState } from 'react';
import {
  GetTopSupplierData,
  GetTopSupplierResetter,
  getTopSupplier,
  GetTopSupplierError
} from '../stores/DashboardState';

const connectToRedux = connect(
  createStructuredSelector({
    topSupplierData: GetTopSupplierData,
    topSupplierDataError: GetTopSupplierError
  }),
  (dispatch) => ({
    getTopSupplier: (fromDate) => dispatch(getTopSupplier(fromDate)),
    resetData: () => {
      dispatch(GetTopSupplierResetter);
    }
  })
);

const columns = [
  {
    title: 'Supplier Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Total Order',
    dataIndex: 'totalOrder',
    key: 'totalOrder'
  },
  {
    title: 'Total Sales',
    dataIndex: 'totalSales',
    key: 'totalSales'
  }
];

const getTopSupplierTable = (topSupplierData = []) => {
  return (
    topSupplierData &&
    topSupplierData.length > 0 &&
    topSupplierData.map((supplier = {}) => ({
      key: supplier?.id,
      name: supplier?.firstName+' '+supplier?.lastName,
      totalOrder: supplier?.totalOrder,
      totalSales: displayCurrency(supplier?.totalSales)
    }))
  );
};


const LeaderboardSupplierComponent = ({
  topSupplierData,
  getTopSupplier,
  resetData,
  topSupplierDataError,
  date
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTopSupplier(date);
  }, [date, getTopSupplier]);

  useEffect(() => {
    if (topSupplierData || topSupplierDataError) {
      setLoading(false);
    }
  }, [topSupplierData, topSupplierDataError]);

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
      bordered
      pagination={false}
      columns={columns}
      dataSource={topSupplierData ? getTopSupplierTable(topSupplierData) : []}
    />
  );
};

export default connectToRedux(LeaderboardSupplierComponent);
