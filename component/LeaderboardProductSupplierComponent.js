import { Button, Drawer, Row, Skeleton, Table, Typography } from 'antd';
import { displayCurrency, getRangeDateLabel } from '../utils';
import {
  GetSupplierTopProductData,
  GetSupplierTopProductResetter,
  getSupplierTopProduct,
  GetSupplierTopProductError
} from '../stores/DashboardState';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React, { Fragment, useEffect, useState } from 'react';
import AdminProductDetailsComponent from './AdminProductDetailsComponent';

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

const getTopProductTable = (
  topProductData = [],
  setCurrentProductSelected,
  setOpenDetails
) => {
  return (
    topProductData &&
    topProductData.length > 0 &&
    topProductData.map((product = {}) => ({
      key: product.id,
      name: (
        <Button
          onClick={() => {
            setOpenDetails(true);
            setCurrentProductSelected(product);
          }}
          type="link"
        >
          {product.productName}
        </Button>
      ),
      totalQuantity:
        product.totalQuantity + ' ' + product.unitOfMeasure.description,
      totalPrice: displayCurrency(product.totalSales)
    }))
  );
};

const LeaderboardProductSupplierComponent = ({
  topProductData,
  getTopProduct,
  resetData,
  topProductDataError
}) => {
  const [loading, setLoading] = useState(true);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentProductSelected, setCurrentProductSelected] = useState({});
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
    <Fragment>
      <Drawer
        width={640}
        title="Product Details"
        placement={'right'}
        closable={true}
        onClose={() => setOpenDetails(false)}
        visible={openDetails}
        key={'product-details'}
      >
        <AdminProductDetailsComponent
          isSupplier
          productID={(currentProductSelected || {}).id}
        />
      </Drawer>
      <Table
        title={() => (
          <Row justify="space-between">
            <b>Top 10 Products in last 30 days</b>
            <span>{getRangeDateLabel()}</span>
          </Row>
        )}
        bordered
        columns={columns}
        dataSource={getTopProductTable(
          topProductData,
          setCurrentProductSelected,
          setOpenDetails
        )}
        pagination={false}
        dispatch
      />
    </Fragment>
  );
};

export default connectToRedux(LeaderboardProductSupplierComponent);
