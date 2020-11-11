import React, { useState } from 'react';
import { CurrentUserData } from '../stores/UserState';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { get } from 'lodash/fp';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
  Form,
  Empty,
  Popover
} from 'antd';
import { DEFAULT_DATE_RANGE, displayCurrency } from '../utils';
import ReactTableLayout from '../layouts/ReactTableLayout';
import Router from 'next/router';

const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    // productPagingData: GetProductPagingData,
    // productPagingError: GetProductPagingError,
    currentUser: CurrentUserData
  })
  //   (dispatch) => ({
  //     getProduct: (pageIndex, pageSize, searchMessage, dateRange, category) => {
  //       dispatch(
  //         getProductPaging({
  //           pageIndex,
  //           pageSize,
  //           categoryID: category,
  //           productName: searchMessage,
  //         })
  //       );
  //     },
);

const columns = [
  {
    title: 'Product Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Price Per Unit',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  {
    title: 'Supplier Contact',
    dataIndex: 'contact',
    key: 'contact'
  },
  {
    title: 'Details',
    dataIndex: 'actions',
    key: 'actions'
  }
];

const data = [
  {
    product: {
      id: 'f6ae608f-2010-4e2d-4d3d-08d88552484d',
      description:
        'Wholesale Stock Tactical Combat Men Army Trousers Military Suit Camouflage Uniform',
      unitType: 'Boxes'
    },
    price: 10000,
    quantity: 100,
    supplierName: 'rko@gmail.com'
  }
];

const displayProductName = (name) =>
  name ? (name.length > 100 ? name.slice(0, 80) + ' ...' : name) : '';

const getAggregatorTable = (orderData = []) => {
  return orderData
    ? orderData.map((order = {}) => ({
        key: order.id,
        price: displayCurrency(+order.price),
        name: (
          <Popover content={order.product.description}>
            <a
              target="_blank"
              rel="noreferrer"
              href={`/product-details?id=${get('product.id')(order)}`}
            >
              {displayProductName(order.product.description)}
            </a>
          </Popover>
        ),
        quantity: (+order.quantity || 0) + ' ' + get('product.unitType')(order),
        contact: order.supplierName,
        actions: (
          <Button
            onClick={() => {
              Router.push(
                `/aggregator/order/details?id=${get('product.id')(order)}`
              );
            }}
            size="small"
            type="link"
          >
            View
          </Button>
        )
      }))
    : [];
};
const AggregatorOrderManagementComponent = ({ currentUser }) => {
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  // switch (currentUser.role) {
  //   case 'Aggregator':
  //     return (
  //       <div>
  //         <Row justify="space-between">
  //           <Title level={4}>Your Order</Title>
  //         </Row>
  //         <AggregatorOrder />
  //       </div>
  //     );
  //   case 'Buyer':
  return (
    <div>
      <Row justify="space-between">
        <Title level={4}>Aggregator Management Order</Title>
      </Row>
      <ReactTableLayout
        totalCount={data.length}
        // loading={loading}
        // dispatchAction={getRequest}
        searchProps={{
          placeholder: 'Search by product name'
          //   searchMessage,
          //   setSearchMessage,
        }}
        data={getAggregatorTable(data || [])}
        columns={columns}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
      />
    </div>
  );
  //   case 'Supplier':
  //     return <SupplierOrder />;
  //   default:
  //     return <Empty description="Can not find any order!" />;
  // }
};

export default connectToRedux(AggregatorOrderManagementComponent);
