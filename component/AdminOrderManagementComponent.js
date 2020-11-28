import React, { useState } from 'react';
import { CurrentUserData } from '../stores/UserState';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
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
import { MODERATOR, SUPPLIER } from '../enums/accountRoles';

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
    title: 'Aggregator Name',
    dataIndex: 'aggregator',
    key: 'aggregator'
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

const getOrderTable = (
  orderData = [],
  setCurrentSupplier,
  setOpenDetails,
  setOpenDetailsAgg,
  setCurrentAggregator
) => {
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
          aggregator = {}
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
          aggregator: (
            <Button
              onClick={() => {
                setOpenDetailsAgg(true);
                setCurrentAggregator(aggregator);
              }}
              type="link"
            >
              {`${aggregator.firstName} ${aggregator.lastName}`}
            </Button>
          ),
          status: <OrderStatusComponent status={orderStatus.id} />,
          actions: (
            <Button
              onClick={() => {
                Router.push(`/admin/order/details?id=${id}`);
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
const AdminOrderManagementComponent = ({ orderPagingData, getOrderPaging }) => {
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [searchMessage, setSearchMessage] = useState('');
  const [status, setStatus] = useState('all');
  const [openDetails, setOpenDetails] = useState(false);
  const [openDetailsAgg, setOpenDetailsAgg] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState({});
  const [currentAggregator, setCurrentAggregator] = useState({});

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
              role={SUPPLIER}
              isAdmin
              isDrawer
              userId={(currentSupplier || {}).id}
            />
          ) : null}
        </Drawer>
        <Drawer
          width={640}
          title="Aggregator Details"
          placement={'right'}
          closable={true}
          onClose={() => setOpenDetailsAgg(false)}
          visible={openDetailsAgg}
          key={'aggregator-drawer'}
        >
          {openDetailsAgg ? (
            <UserProfileComponent
              isDrawer
              userId={(currentAggregator || {}).id}
              isAdmin
              role={MODERATOR}
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
          setOpenDetails,
          setOpenDetailsAgg,
          setCurrentAggregator
        )}
        columns={columns}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
      />
    </div>
  );
};

export default connectToRedux(AdminOrderManagementComponent);
