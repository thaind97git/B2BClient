import { Skeleton, Table, Typography } from 'antd';
import { displayCurrency } from '../utils';
import {GetSupplierTopProductData , GetSupplierTopProductResetter, getSupplierTopProduct, GetSupplierTopProductError} from '../stores/DashboardState';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React, {  useEffect, useState} from 'react';

const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    topProductData: GetSupplierTopProductData,
    topProductDataError: GetSupplierTopProductError
  }),
  (dispatch) => ({
    getTopProduct: () => dispatch(getSupplierTopProduct()),
    resetData: () => {
      dispatch(GetSupplierTopProductResetter);
    }
  })
);

const columns = [
  {
    title: 'Product Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Total Quantity',
    dataIndex: 'totalQuantity',
    key: 'totalQuantity'
  },
  {
    title: 'Total Sales',
    dataIndex: 'totalPrice',
    key: 'totalPrice'
  }
];

const getTopProductTable = (topProductData = []) => {
  return (
    topProductData &&
    topProductData.length > 0 &&
    topProductData.map((product = {}) => ({
      key: product.id,
      name: product.productName,
      totalQuantity: product.totalQuantity,
      totalPrice : product.totalSales
    }))
  );
};

const LeaderboardProductSupplierComponent = ({ topProductData, getTopProduct, resetData ,topProductDataError}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      setLoading(true);
      getTopProduct();
  }, [getTopProduct]);

  useEffect(() => {
    if (topProductData || topProductDataError) {
      setLoading(false);
    }
  }, [topProductData, topProductDataError]);

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
      columns={columns}
      dataSource={getTopProductTable(topProductData)}
      pagination={false}
      dispatch
    />
  );
};

export default connectToRedux(LeaderboardProductSupplierComponent);