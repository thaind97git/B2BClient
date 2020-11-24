import React, { useState } from 'react';
import { CurrentUserData } from '../stores/UserState';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { get } from 'lodash/fp';
import { Button, Row, Typography, Popover, Select, Drawer } from 'antd';
import { DEFAULT_DATE_RANGE, displayCurrency, getShortContent } from '../utils';
import ReactTableLayout from '../layouts/ReactTableLayout';
import Router from 'next/router';
import OrderStatusComponent from './Utils/OrderStatusComponent';
import {
  getOrderPaging,
  GetOrderPagingData,
  GetOrderPagingError
} from '../stores/OrderState';
import { O_DONE, O_ORDERED } from '../enums/orderStatus';
import UserProfileComponent from './UserProfileComponent';

const { Title } = Typography;
const { Option } = Select;

const connectToRedux = connect(
  createStructuredSelector({
    orderPagingData: GetOrderPagingData,
    orderPagingError: GetOrderPagingError,
    currentUser: CurrentUserData
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
    title: 'Group Name',
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
    title: 'Supplier Name',
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
          orderStatus = {}
        } = order || {};
        const { unitOfMeasure = {} } = product;
        return {
          key: id,
          price: displayCurrency(unitPrice),
          name: (
            <Popover content={group.description}>
              <a
                target="_blank"
                rel="noreferrer"
                href={`/aggregator/group/details?id=${group.id}`}
              >
                {getShortContent(group.description, 100)}
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
              {`${supplier.firstName} ${supplier.lastName}`}
            </Button>
          ),
          status: <OrderStatusComponent status={orderStatus.id} />,
          actions: (
            <Button
              onClick={() => {
                Router.push(`/aggregator/order/details?id=${id}`);
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
const AggregatorOrderManagementComponent = ({
  orderPagingData,
  getOrderPaging
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
      <Row justify="space-between">
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
            <UserProfileComponent
              isDrawer
              userId={(currentSupplier || {}).id}
            />
          ) : null}
        </Drawer>
        <Title level={4}>Order Management</Title>
      </Row>
      <ReactTableLayout
        totalCount={totalCount}
        dispatchAction={getOrderPaging}
        searchProps={{
          placeholder: 'Search by group name',
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
              <Option value={O_DONE}>Done</Option>
              <Option value={O_ORDERED}>Ordered</Option>
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

export default connectToRedux(AggregatorOrderManagementComponent);
