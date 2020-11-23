import { Button, Drawer, Popover, Row, Select, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactTableLayout from '../layouts/ReactTableLayout';
import {
  DATE_TIME_FORMAT,
  DEFAULT_DATE_RANGE,
  displayCurrency,
  getUtcTime
} from '../utils';
import RequestStatusComponent from './Utils/RequestStatusComponent';
import {
  R_BIDDING,
  R_CANCELED,
  R_DONE,
  R_GROUPED,
  R_NEGOTIATING,
  R_ORDERED,
  R_PENDING,
  R_REJECTED,
  R_WAIT_FOR_AUCTION
} from '../enums/requestStatus';
import RequestDetailsComponent from './RequestDetailsComponent';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getRequestPaging,
  GetRequestPagingData,
  GetRequestPagingError
} from '../stores/RequestState';
import Moment from 'react-moment';
import { get } from 'lodash/fp';
import moment from 'moment';
const { Option } = Select;
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    requestPagingData: GetRequestPagingData,
    requestPagingError: GetRequestPagingError
  }),
  (dispatch) => ({
    getRequest: (pageIndex, pageSize, searchMessage, dateRange, status) => {
      dispatch(
        getRequestPaging({
          pageSize,
          pageIndex,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
          productTitle: searchMessage,
          status: [status]
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
    title: 'Preferred Unit Price',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    key: 'dueDate'
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

const displayProductName = (name) =>
  name ? (name.length > 100 ? name.slice(0, 80) + ' ...' : name) : '';

const BuyerRequestManagement = ({
  getRequest,
  requestPagingData,
  requestPagingError
}) => {
  const [searchMessage, setSearchMessage] = useState('');
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentRequestSelected, setCurrentRequestSelected] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestPagingError || requestPagingData) {
      setLoading(false);
    }
  }, [requestPagingError, requestPagingData]);

  function handleChange(value) {
    setStatus(value);
  }
  const getRequestTable = (requestData = []) => {
    return requestData
      ? requestData.map((request = {}) => ({
          key: request.id,
          price: displayCurrency(+request.preferredUnitPrice),
          name: (
            <Popover content={request.product.description}>
              <a
                target="_blank"
                rel="noreferrer"
                href={`/product-details?id=${get('product.id')(request)}`}
              >
                {displayProductName(request.product.description)}
              </a>
            </Popover>
          ),
          quantity:
            (+request.quantity || 0) + ' ' + get('product.unitType')(request),
          dueDate: (
            <Moment format={DATE_TIME_FORMAT}>
              {getUtcTime(request.dueDate)}
            </Moment>
          ),
          status: <RequestStatusComponent status={request.requestStatus.id} />,
          actions: (
            <Button
              onClick={() => {
                setCurrentRequestSelected(request);
                setOpenDetails(true);
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

  let requestData = [],
    totalCount = 0;
  if (!!requestPagingData && !requestPagingError) {
    requestData = requestPagingData.data;
    totalCount = requestPagingData.total;
  }
  return (
    <div>
      <Row justify="space-between">
        <Drawer
          width={640}
          title="RFQ details"
          placement={'right'}
          closable={true}
          onClose={() => setOpenDetails(false)}
          visible={openDetails}
          key={'right'}
        >
          {openDetails ? (
            <RequestDetailsComponent
              setOpenDetails={setOpenDetails}
              requestId={currentRequestSelected.id}
            />
          ) : null}
        </Drawer>
        <Title level={4}>Your Request for Quotation</Title>
        <Button onClick={() => {}} type="primary">
          <a href="/" target="_blank">
            Submit Other RFQ
          </a>
        </Button>
      </Row>
      <ReactTableLayout
        totalCount={totalCount}
        loading={loading}
        dispatchAction={getRequest}
        searchProps={{
          placeholder: 'Search by product name',
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
              <Option value={R_PENDING}>Pending</Option>
              <Option value={R_DONE}>Done</Option>
              <Option value={R_REJECTED}>Rejected</Option>
              <Option value={R_CANCELED}>Canceled</Option>
              <Option value={R_ORDERED}>Ordered</Option>
              <Option value={R_BIDDING}>Bidding</Option>
              <Option value={R_WAIT_FOR_AUCTION}>Wait for Auction</Option>
              <Option value={R_GROUPED}>Grouping</Option>
              <Option value={R_NEGOTIATING}>Negotiating</Option>
            </Select>
          ),
          exCondition: [status]
        }}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
        data={getRequestTable(requestData || [])}
        columns={columns}
      />
    </div>
  );
};

export default connectToRedux(BuyerRequestManagement);
