import React, { useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Button, Row, Typography, Popover, Select, Drawer } from 'antd';
import { DEFAULT_DATE_RANGE, displayCurrency, getShortContent } from '../utils';
import ReactTableLayout from '../layouts/ReactTableLayout';
import Router from 'next/router';
import {
  getOrderPaging,
  GetOrderPagingData,
  GetOrderPagingError
} from '../stores/OrderState';
import UserProfileComponent from './UserProfileComponent';
import RequestStatusComponent from './Utils/RequestStatusComponent';
import { R_DONE, R_ORDERED } from '../enums/requestStatus';

const { Title } = Typography;
const { Option } = Select;

const connectToRedux = connect(
  createStructuredSelector({
    orderPagingData: GetOrderPagingData,
    orderPagingError: GetOrderPagingError
  }),
  (dispatch) => ({
    getOrderPaging: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange = {},
      status
    ) => {
      dispatch(
        getOrderPaging({
          status,
          groupName: searchMessage,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
          pageIndex,
          pageSize
        })
      );
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
    title: 'Supplier Company',
    dataIndex: 'contact',
    key: 'contact'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Details',
    dataIndex: 'actions',
    key: 'actions'
  }
];

const getOrderTable = (orderData = [], setCurrentSupplier, setOpenDetails) => {
  return orderData
    ? orderData.map((order = {}) => {
        const {
          id,
          group = {},
          quantity,
          unitPrice,
          product = {},
          supplier = {},
          orderStatus = {},
          requestStatus = {}
        } = order || {};
        const { unitOfMeasure = {}, productName } = product;
        return {
          key: id,
          price: displayCurrency(unitPrice),
          name: (
            <Popover content={productName}>
              <a
                target="_blank"
                rel="noreferrer"
                href={`/product-details?id=${product.id}`}
              >
                {getShortContent(productName, 100)}
              </a>
            </Popover>
          ),
          quantity: `${quantity} ${unitOfMeasure.description}`,
          contact: (
            <Button
              onClick={() => {
                setOpenDetails(true);
                setCurrentSupplier(supplier);
              }}
              type="link"
            >
              {`${supplier.companyName}`}
            </Button>
          ),
          status: <RequestStatusComponent status={requestStatus.id} />,
          actions: (
            <Button
              onClick={() => {
                Router.push(`/buyer/order/details?id=${id}`);
              }}
              size="small"
              type="link"
            >
              View
            </Button>
          )
        };
      })
    : [];
};
const BuyerOrderManagementComponent = ({
  getOrderPaging,
  orderPagingData,
  orderPagingError
}) => {
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [searchMessage, setSearchMessage] = useState('');
  const [status, setStatus] = useState('all');
  const [openDetails, setOpenDetails] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState({});

  let orderData = [],
    totalCount = 0;
  if (orderPagingData) {
    orderData = orderPagingData.data;
    totalCount = orderPagingData.total;
  }
  return (
    <div>
      <Drawer
        width={640}
        title="Supplier Details"
        placement={'right'}
        closable={true}
        onClose={() => setOpenDetails(false)}
        visible={openDetails}
        key={'right'}
      >
        {openDetails ? (
          <UserProfileComponent isDrawer userId={(currentSupplier || {}).id} />
        ) : null}
      </Drawer>
      <Row justify="space-between">
        <Title level={4}>Your Order</Title>
      </Row>
      <ReactTableLayout
        totalCount={totalCount}
        dispatchAction={getOrderPaging}
        searchProps={{
          placeholder: 'Search by product name',
          searchMessage,
          setSearchMessage,
          exElement: (
            <Select
              size="large"
              placeholder="Filter by status"
              style={{ width: 140 }}
              onChange={(value) => setStatus(value)}
              defaultValue=""
            >
              <Option value="">All Status</Option>
              <Option value={R_DONE}>Done</Option>
              <Option value={R_ORDERED}>Ordered</Option>
            </Select>
          ),
          exCondition: [status]
        }}
        data={getOrderTable(
          orderData || [],
          setCurrentSupplier,
          setOpenDetails
        )}
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

export default connectToRedux(BuyerOrderManagementComponent);
