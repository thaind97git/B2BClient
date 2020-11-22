import { Button, Row, Typography, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import ReactTableLayout from '../layouts/ReactTableLayout';
import { DATE_TIME_FORMAT, DEFAULT_DATE_RANGE } from '../utils';
import Router from 'next/router';
import { connect } from 'react-redux';
import { F_CLOSED, F_OPEN } from '../enums/feedbackStatus';
import { createStructuredSelector } from 'reselect';
import {
  getFeedbackPaging,
  GetFeedbackPagingData,
  GetFeedbackPagingError
} from '../stores/FeedbackState';
//import AdminProductDetailsComponent from "./AdminProductDetailsComponent";
import FeedbackStatusComponent from './Utils/FeedbackStatusComponent';
import { get } from 'lodash/fp';
import Moment from 'react-moment';
const { Title } = Typography;
const { Option } = Select;

const connectToRedux = connect(
  createStructuredSelector({
    feedbackPagingData: GetFeedbackPagingData,
    feedbackPagingError: GetFeedbackPagingError
  }),
  (dispatch) => ({
    getFeedback: (pageIndex, pageSize, searchMessage, dateRange, status) => {
      dispatch(
        getFeedbackPaging({
          pageIndex,
          pageSize,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
          title: searchMessage,
          status
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
    title: 'User',
    dataIndex: 'user',
    key: 'user'
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
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions'
  }
];

const AdminFeedbackManagementComponent = ({
  feedbackPagingData,
  getFeedback,
  feedbackPagingError
}) => {
  const [searchMessage, setSearchMessage] = useState('');
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [status, setStatus] = useState(null);
  //zconst [openDetails, setOpenDetails] = useState(false);
  // const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     if (productPagingError || productPagingData) {
  //       setLoading(false);
  //     }
  //   }, [productPagingError, productPagingData]);

  function handleChange(value) {
    setStatus(value);
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
        dateUpdated: (
          <Moment format={DATE_TIME_FORMAT}>
            {new Date(feedback.dateUpdated)}
          </Moment>
        ),
        user: feedback.user.email,
        status: (
          <FeedbackStatusComponent
            status={feedback.feedbackStatus.id}
          ></FeedbackStatusComponent>
        ),
        actions: (
          <Button
            onClick={() => {
              Router.push(`/admin/feedback/details?id=${feedback.id}`);
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
      </Row>
      <ReactTableLayout
        // loading={loading}
        dispatchAction={getFeedback}
        searchProps={{
          placeholder: 'Search by title',
          searchMessage,
          setSearchMessage,
          exElement: (
            <Select
              size="large"
              placeholder="Filter by status"
              style={{ width: 200 }}
              onChange={handleChange}
              defaultValue=""
            >
              <Option value="">All Status</Option>
              <Option value={F_OPEN}>Opeing</Option>
              <Option value={F_CLOSED}>Closed</Option>
            </Select>
          ),
          exCondition: [status]
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
export default connectToRedux(AdminFeedbackManagementComponent);
