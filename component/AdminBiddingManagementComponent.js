import { Button, Select, Space, Modal, Row, Typography } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { B_ACTIVE, B_CLOSED, B_DONE, B_FEATURE } from '../enums/biddingStatus';
import ReactTableLayout from '../layouts/ReactTableLayout';
import { createLink } from '../libs';
import {
  auctionFilter,
  AuctionFilterData,
  AuctionFilterError,
  cancelAuction,
  CancelAuctionData
} from '../stores/AuctionState';
import {
  DATE_TIME_FORMAT,
  DEFAULT_DATE_RANGE,
  DEFAULT_PAGING_INFO,
  timeConvert
} from '../utils';
import AllCategoryComponent from './AllCategoryComponent';
import BiddingStatusComponent from './Utils/BiddingStatusComponent';
const { Title } = Typography;
const { Option } = Select;

const connectToRedux = connect(
  createStructuredSelector({
    auctionData: AuctionFilterData,
    auctionError: AuctionFilterError,
    cancelAuctionData: CancelAuctionData
  }),
  (dispatch) => ({
    auctionFilter: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange = {},
      status,
      categoryId
    ) =>
      dispatch(
        auctionFilter({
          pageIndex,
          pageSize,
          name: searchMessage,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
          status,
          categoryId
        })
      ),
    cancelAuction: (id, callback) => dispatch(cancelAuction(id, callback))
  })
);

const AdminBiddingManagementComponent = ({
  auctionFilter,
  auctionData,
  auctionError,
  cancelAuction
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Link
          href={createLink([
            'aggregator',
            'bidding',
            `details?id=${record.key}`
          ])}
        >
          {text}
        </Link>
      )
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration'
    },
    {
      title: 'Date start',
      dataIndex: 'dateStart',
      key: 'dateStart'
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    }
  ];
  const [searchMessage, setSearchMessage] = useState('');
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState(null);

  function handleChange(value) {
    setStatus(value);
  }
  const getAuctionData = (auctionData = []) => {
    return (
      auctionData &&
      auctionData.length > 0 &&
      auctionData.map((auction) => {
        const {
          id,
          auctionName,
          auctionStartTime,
          minimumDuration,
          aggregator,
          reverseAuctionStatus = {}
        } = auction;
        return {
          key: id,
          name: auctionName,
          duration: timeConvert(minimumDuration),
          dateStart: (
            <Moment format={DATE_TIME_FORMAT}>{auctionStartTime}</Moment>
          ),
          createdBy: `${aggregator.firstName} ${aggregator.lastName}`,
          status: <BiddingStatusComponent status={reverseAuctionStatus.id} />,
          actions:
            +reverseAuctionStatus.id === B_FEATURE ? (
              <Button
                onClick={() => {
                  Modal.confirm({
                    title: 'Do you want cancel auction?',
                    okText: 'Yes',
                    cancelText: 'No',
                    onOk: () => {
                      cancelAuction(id, () => {
                        auctionFilter({
                          pageIndex: DEFAULT_PAGING_INFO.page,
                          pageSize: DEFAULT_PAGING_INFO.pageSize,
                          name: searchMessage,
                          fromDate: null,
                          toDate: null,
                          status,
                          categoryId: category
                        });
                      });
                    }
                  });
                }}
                size="small"
                danger
              >
                Cancel
              </Button>
            ) : null
        };
      })
    );
  };
  let isActions = false;
  let requestData = [],
    totalCount = 0;
  if (!!auctionData && !auctionError) {
    requestData = auctionData.data;
    isActions = requestData.some(
      (auction = {}) => (auction.reverseAuctionStatus || {}).id === B_FEATURE
    );
    totalCount = auctionData.total;
  }
  if (isActions) {
    columns.push({
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions'
    });
  }
  return (
    <div>
      <Row justify="start">
        <Title level={4}>Event management</Title>
      </Row>
      <ReactTableLayout
        dispatchAction={auctionFilter}
        searchProps={{
          placeholder: 'Search by event name',
          searchMessage,
          setSearchMessage,
          exElement: (
            <Space>
              <Select
                size="large"
                placeholder="Filter by status"
                style={{ width: 140 }}
                onChange={handleChange}
                defaultValue=""
              >
                <Option value="">All Status</Option>
                <Option value={B_FEATURE}>Waiting</Option>
                <Option value={B_DONE}>Donned</Option>
                <Option value={B_CLOSED}>Closed</Option>
                <Option value={B_ACTIVE}>Activating</Option>
              </Select>
              <AllCategoryComponent
                onGetLastValue={(value) => setCategory(value)}
                size="large"
                isSearchStyle={false}
              />
            </Space>
          ),
          exCondition: [status, category]
        }}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
        data={getAuctionData(requestData || [])}
        columns={columns}
        totalCount={totalCount}
      />
    </div>
  );
};

export default connectToRedux(AdminBiddingManagementComponent);
