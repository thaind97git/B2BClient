import { Skeleton, Table, Typography } from 'antd';
import { displayCurrency } from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React, { useEffect, useState } from 'react';
import {
  GetTopProductData,
  GetTopProductResetter,
  getTopProduct,
  GetTopProductError
} from '../stores/DashboardState';

const { Title } = Typography;

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
    dataIndex: 'totalSales',
    key: 'totalSales'
  }
];

const connectToRedux = connect(
  createStructuredSelector({
    topProductData: GetTopProductData,
    topProductDataError: GetTopProductError
  }),
  (dispatch) => ({
    getTopProduct: (fromDate) => dispatch(getTopProduct(fromDate)),
    resetData: () => {
      dispatch(GetTopProductResetter);
    }
  })
);

const getTopProductTable = (topProductData = []) => {
  return (
    topProductData &&
    topProductData.length > 0 &&
    topProductData.map((product = {}) => ({
      key: product.id,
      name: product.productName,
      totalQuantity: product.totalQuantity+' '+product.unitOfMeasure.description,
      totalSales: displayCurrency(product.totalSales)
    }))
  );
};

const LeaderboardProductComponent = ({
  topProductData,
  getTopProduct,
  resetData,
  topProductDataError,
  date
}) => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTopProduct(date);
  }, [date,getTopProduct]);

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
      dataSource={topProductData?getTopProductTable(topProductData):[]}
      pagination={false}
    />
  );
};

export default connectToRedux(LeaderboardProductComponent);
