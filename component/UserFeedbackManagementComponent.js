import { Button, Row, Typography, Select, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import ReactTableLayout from '../layouts/ReactTableLayout';
import { DATE_TIME_FORMAT, DEFAULT_DATE_RANGE, getUtcTime } from '../utils';
import Router from 'next/router';
import { connect } from 'react-redux';
import { F_CLOSED, F_OPEN } from '../enums/feedbackStatus';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';
import {
  getFeedbackPaging,
  GetFeedbackPagingData,
  GetFeedbackPagingError
} from '../stores/FeedbackState';
import { CurrentUserData } from '../stores/UserState';
//import AdminProductDetailsComponent from "./AdminProductDetailsComponent";
import FeedbackStatusComponent from './Utils/FeedbackStatusComponent';
import { get } from 'lodash/fp';
import Moment from 'react-moment';
import {F_ORDER,F_RFQ,F_AUCTION,F_SYSTEM} from '../enums/feedbackType'
const { Title } = Typography;
const { Option } = Select;

const connectToRedux = connect(
  createStructuredSelector({
    feedbackPagingData: GetFeedbackPagingData,
    feedbackPagingError: GetFeedbackPagingError,
    currentUser: CurrentUserData
  }),
  (dispatch) => ({
    getFeedback: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange,
      status,
      systemType
    ) => {
      dispatch(
        getFeedbackPaging({
          pageIndex,
          pageSize,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
          title: searchMessage,
          status,
          systemType
        })
      );
    }
  })
);

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: 'Date updated',
    dataIndex: 'dateUpdated',
    key: 'dateUpdated'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  },
  // {
  //   title: "Date Created",
  //   dataIndex: "dateCreated",
  //   key: "dateCreated",
  // },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions'
  }
];

const UserFeedbackManagementComponent = ({
  feedbackPagingData,
  getFeedback,
  feedbackPagingError,
  currentUser
}) => {
  const [searchMessage, setSearchMessage] = useState('');
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [status, setStatus] = useState(null);
  const [systemType, setSystemType] = useState(null);
  //zconst [openDetails, setOpenDetails] = useState(false);
  // const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     if (productPagingError || productPagingData) {
  //       setLoading(false);
  //     }
  //   }, [productPagingError, productPagingData]);

  function handleStatusChange(value) {
    setStatus(value);
  }

  function handleServiceChange(value) {
    setSystemType(value);
  }

  useEffect(() => {
    if (feedbackPagingError || feedbackPagingData) {
      //setLoading(false);
    }
  }, [feedbackPagingError, feedbackPagingData]);

  let feedbackData = [],
    totalCount = 0;
  if (!!feedbackPagingData && !feedbackPagingError) {
    feedbackData = feedbackPagingData.data;
    totalCount = feedbackPagingData.total;
  }

  const getFeedbackTable = (feedbackData = []) => {
    return (
      feedbackData &&
      feedbackData.length > 0 &&
      feedbackData.map((feedback = {}) => ({
        key: feedback.id,
        title: feedback.title,
        dateUpdated: getUtcTime(feedback.dateUpdated),
        status: (
          <FeedbackStatusComponent
            status={feedback.feedbackStatus.id}
          ></FeedbackStatusComponent>
        ),
        actions: (
          <Button
            onClick={() => {
              if (currentUser.role === 'Supplier') {
                Router.push(`/supplier/feedback/details?id=${feedback.id}`);
              } else if (currentUser.role === 'Buyer') {
                Router.push(`/buyer/feedback/details?id=${feedback.id}`);
              }
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
  return (
    <div>
      <Row justify="space-between">
        <Title level={4}>Feedback List</Title>
        <Button
          onClick={() => {
            if (currentUser.role === 'Supplier') {
              Router.push(`/supplier/feedback/create`);
            } else if (currentUser.role === 'Buyer') {
              Router.push(`/buyer/feedback/create`);
            }
          }}
          type="primary"
        >
          Create feedback
        </Button>
      </Row>
      <ReactTableLayout
        // loading={loading}
        dispatchAction={getFeedback}
        searchProps={{
          placeholder:
            currentUser.role === 'Supplier'
              ? 'Search by group name'
              : 'Search by product name',
          searchMessage,
          setSearchMessage,
          exElement: (
            <Space>
              <Select
                size="large"
                placeholder="Filter by status"
                style={{ width: 200 }}
                onChange={handleStatusChange}
                defaultValue=""
              >
                <Option value="">All Status</Option>
                <Option value={F_OPEN}>Opeing</Option>
                <Option value={F_CLOSED}>Closed</Option>
              </Select>
              <Select
                size="large"
                placeholder="Filter by service type"
                style={{ width: 200 }}
                onChange={handleServiceChange}
                defaultValue=""
              >
                <Option value="">All Service</Option>
                {currentUser.role === 'Supplier' ? (
                  <>
                    <Option value={F_ORDER}>Order</Option>
                    <Option value={F_AUCTION}>Auction</Option>
                  </>
                ) : (
                  <Option value={F_RFQ}>Order</Option>
                )}
                <Option value={F_SYSTEM}>System</Option>
              </Select>
            </Space>
          ),
          exCondition: [status, systemType]
        }}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
        data={getFeedbackTable(feedbackData || [])}
        columns={columns}
        totalCount={totalCount}
      />
    </div>
  );
};
export default connectToRedux(UserFeedbackManagementComponent);
