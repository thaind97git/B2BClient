import { Button, Row, Typography, Select, Space, Drawer } from 'antd';
import React, { useState, useEffect } from 'react';
import ReactTableLayout from '../layouts/ReactTableLayout';
import { DEFAULT_DATE_RANGE, getUtcTime } from '../utils';
import Router from 'next/router';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getFeedbackPaging,
  GetFeedbackPagingData,
  GetFeedbackPagingError
} from '../stores/FeedbackState';
import { F_AUCTION, F_ORDER, F_RFQ } from '../enums/feedbackType';
import DisplayStarComponent from './Utils/DisplayStarComponent';
import FeedbackDetailsComponent from './FeedbackDetailsComponent';
import {
  ASCENDING,
  DESCENDING,
  HIGHEST_RATING,
  LOWEST_RATING
} from '../enums/sortFeedback';
const { Title } = Typography;
const { Option } = Select;

const connectToRedux = connect(
  createStructuredSelector({
    feedbackPagingData: GetFeedbackPagingData,
    feedbackPagingError: GetFeedbackPagingError
  }),
  (dispatch) => ({
    getFeedback: (pageIndex, pageSize, searchMessage, dateRange, sortBy) => {
      dispatch(
        getFeedbackPaging({
          pageIndex,
          pageSize,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
          searchMessage,
          sortBy
        })
      );
    }
  })
);

const columns = [
  {
    title: 'Feedback from',
    dataIndex: 'from',
    key: 'from'
  },
  {
    title: 'Date Created',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: 'Average Rating',
    dataIndex: 'averageRating',
    key: 'averageRating'
  },
  {
    title: 'Details',
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
  const [sortBy, setSortBy] = useState(DESCENDING);
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [loading, setLoading] = useState(true);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentFeedbackSelected, setCurrentFeedbackSelected] = useState({});

  useEffect(() => {
    if (feedbackPagingError || feedbackPagingData) {
      setLoading(false);
    }
  }, [feedbackPagingError, feedbackPagingData]);

  let feedbackData = [],
    totalCount = 0;
  if (!!feedbackPagingData && !feedbackPagingError) {
    feedbackData = feedbackPagingData.data;
    totalCount = feedbackPagingData.total;
  }

  const getFeedbackTable = (
    feedbackData = [],
    setCurrentFeedbackSelected,
    setOpenDetails
  ) => {
    return (
      feedbackData &&
      feedbackData.length > 0 &&
      feedbackData.map((feedback = {}) => {
        const { averageRating, buyer = {}, dateCreated, id } = feedback || {};
        return {
          key: id,
          createdAt: getUtcTime(dateCreated),
          from: buyer.email,
          averageRating: <DisplayStarComponent star={averageRating} />,
          actions: (
            <Button
              onClick={() => {
                setCurrentFeedbackSelected(feedback);
                setOpenDetails(true);
              }}
              size="small"
              type="link"
            >
              View
            </Button>
          )
        };
      })
    );
  };

  return (
    <div>
      <Drawer
        width={640}
        title="Feedback Details"
        placement={'right'}
        closable={true}
        onClose={() => setOpenDetails(false)}
        visible={openDetails}
        key={'right'}
      >
        {openDetails ? (
          <FeedbackDetailsComponent
            feedbackId={(currentFeedbackSelected || {}).id}
          />
        ) : null}
      </Drawer>
      <Row justify="space-between">
        <Title level={4}>Feedback List</Title>
      </Row>
      <ReactTableLayout
        loading={loading}
        dispatchAction={getFeedback}
        searchProps={{
          placeholder: 'Search by name or email of buyer',
          searchMessage,
          setSearchMessage,
          exElement: (
            <Space>
              <Select
                size="large"
                placeholder="Sort"
                style={{ width: 200 }}
                onChange={(value) => setSortBy(value)}
                defaultValue={DESCENDING}
              >
                <Option value={DESCENDING}>Date recently</Option>
                <Option value={ASCENDING}>Date oldest</Option>
                <Option value={LOWEST_RATING}>Lowest rating</Option>
                <Option value={HIGHEST_RATING}>Highest rating</Option>
              </Select>
            </Space>
          ),
          exCondition: [sortBy]
        }}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
        data={getFeedbackTable(
          feedbackData || [],
          setCurrentFeedbackSelected,
          setOpenDetails
        )}
        columns={columns}
        totalCount={totalCount}
      />
    </div>
  );
};
export default connectToRedux(AdminFeedbackManagementComponent);
