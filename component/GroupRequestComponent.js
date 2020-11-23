import React, { useState } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { compose } from 'redux';
import { Button, Typography, Row, Space, Select } from 'antd';
import ReactTableLayout from '../layouts/ReactTableLayout';
import { DATE_TIME_FORMAT, DEFAULT_DATE_RANGE, getUtcTime } from '../utils';
import GroupStatusComponent from './Utils/GroupStatusComponent';
import { createLink } from '../libs';
import { createStructuredSelector } from 'reselect';
import { getGroupPaging, GetGroupPagingData } from '../stores/GroupState';
import AllCategoryComponent from './AllCategoryComponent';
import Moment from 'react-moment';
import {
  G_BIDDING,
  G_DONE,
  G_FAILED,
  G_NEGOTIATING,
  G_ORDERED,
  G_PENDING,
  G_WAIT_FOR_AUCTION
} from '../enums/groupStatus';

const { Title } = Typography;
const { Option } = Select;

const connectToRedux = connect(
  createStructuredSelector({
    groupPagingData: GetGroupPagingData
  }),
  (dispatch) => ({
    getGroupPaging: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange,
      categoryId,
      status
    ) =>
      dispatch(
        getGroupPaging({
          categoryId,
          productName: searchMessage,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
          pageIndex,
          pageSize,
          status
        })
      )
  })
);

const enhance = compose(connectToRedux);

const columns = [
  {
    title: 'Group Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Product Name',
    dataIndex: 'product',
    key: 'product'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Date Created',
    dataIndex: 'dateCreated',
    key: 'dateCreated'
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions'
  }
];

const GroupRequestComponent = ({ getGroupPaging, groupPagingData }) => {
  const [searchMessage, setSearchMessage] = useState('');
  const [category, setCategory] = useState('all');
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [status, setStatus] = useState('all');

  const getGroupTable = (groupData = []) => {
    return (
      groupData &&
      groupData.length > 0 &&
      groupData.map((group = {}) => ({
        key: group.id,
        name: group.groupName,
        product: group.product.description,
        dateCreated: (
          <Moment format={DATE_TIME_FORMAT}>
            {getUtcTime(group.dateCreated)}
          </Moment>
        ),
        status: <GroupStatusComponent status={group.groupStatus.id} />,
        actions: (
          <Button
            onClick={() => {
              Router.push(
                createLink(['aggregator', 'group', `details?id=${group.id}`])
              );
            }}
            size="small"
            type="link"
          >
            View
          </Button>
        )
      }))
    );
  };
  let groupData = [],
    total = 0;
  if (groupPagingData) {
    groupData = groupPagingData.data;
    total = groupPagingData.total;
  }
  return (
    <div>
      <Row justify="space-between" align="middle">
        <Title level={3}>Group Management</Title>
      </Row>
      <ReactTableLayout
        dispatchAction={getGroupPaging}
        searchProps={{
          placeholder: 'Search By Group Name or Group Name',
          searchMessage,
          setSearchMessage,
          exElement: (
            <Space>
              <Select
                size="large"
                placeholder="Filter by status"
                style={{ width: 140 }}
                onChange={(value) => setStatus(value)}
                defaultValue=""
              >
                <Option value="">All Status</Option>
                <Option value={G_PENDING}>Pending</Option>
                <Option value={G_BIDDING}>Bidding</Option>
                <Option value={G_NEGOTIATING}>Negotiating</Option>
                <Option value={G_WAIT_FOR_AUCTION}>Wait for auction</Option>
                <Option value={G_DONE}>Done</Option>
                <Option value={G_ORDERED}>Ordered</Option>
                <Option value={G_FAILED}>Failed</Option>
              </Select>
              <AllCategoryComponent
                onGetLastValue={(value) => {
                  setCategory(value);
                }}
                size="large"
                isSearchStyle={false}
              />
            </Space>
          ),
          exCondition: [category, status]
        }}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
        data={getGroupTable(groupData || [])}
        totalCount={total}
        columns={columns}
      />
    </div>
  );
};
export default enhance(GroupRequestComponent);
