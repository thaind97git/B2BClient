import { Button, Drawer } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import ReactTableLayout from '../layouts/ReactTableLayout';
import {
  DATE_TIME_FORMAT,
  DEFAULT_DATE_RANGE,
  displayCurrency,
  getUtcTime
} from '../utils';
import RequestStatusComponent from './Utils/RequestStatusComponent';
import {
  R_CANCELED,
  R_DONE,
  R_ORDERED,
  R_REJECTED
} from '../enums/requestStatus';
import RequestDetailsComponent from './RequestDetailsComponent';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getRequestPaging,
  GetRequestPagingData,
  GetRequestPagingError,
  GetRequestPagingResetter
} from '../stores/RequestState';
import Moment from 'react-moment';
import { get } from 'lodash/fp';
import AllCategoryComponent from './AllCategoryComponent';

const connectToRedux = connect(
  createStructuredSelector({
    requestPagingData: GetRequestPagingData,
    requestPagingError: GetRequestPagingError
  }),
  (dispatch) => ({
    getRequest: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange,
      status,
      category
    ) => {
      dispatch(
        getRequestPaging({
          pageSize,
          pageIndex,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
          productTitle: searchMessage,
          status,
          category
        })
      );
    },
    resetData: () => dispatch(GetRequestPagingResetter)
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

const statusFilter = [R_CANCELED, R_DONE, R_REJECTED, R_ORDERED];

const AdminRequestProcessedComponent = ({
  getRequest,
  requestPagingData,
  resetData
}) => {
  const [searchMessage, setSearchMessage] = useState('');
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentRequestSelected, setCurrentRequestSelected] = useState({});
  const [category, setCategory] = useState('all');

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  const getRequestTable = (requestData = []) => {
    return (
      requestData &&
      requestData.length > 0 &&
      requestData.map((request = {}) => ({
        key: request.id,
        price: displayCurrency(+request.preferredUnitPrice),
        name: request.product.description,
        quantity:
          +request.quantity || 0 + ' ' + get('product.unitType')(request),
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
    );
  };

  let requestData = [],
    totalCount = 0;
  if (requestPagingData) {
    requestData = requestPagingData.data;
    totalCount = requestPagingData.total;
  }
  return (
    <div>
      <ReactTableLayout
        dispatchAction={getRequest}
        searchProps={{
          placeholder: 'Search by product name',
          searchMessage,
          setSearchMessage,
          exElement: (
            <Fragment>
              <AllCategoryComponent
                onGetLastValue={(value) => {
                  setCategory(value);
                }}
                size="large"
                isSearchStyle={false}
              />
            </Fragment>
          ),
          exCondition: [statusFilter, category]
        }}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
        data={getRequestTable(requestData || [])}
        columns={columns}
        totalCount={totalCount}
      />
      <Drawer
        width={640}
        title="RFQ details"
        placement={'right'}
        closable={true}
        onClose={() => setOpenDetails(false)}
        visible={openDetails}
        key={'right'}
      >
        <RequestDetailsComponent
          isSupplier={false}
          requestId={(currentRequestSelected || {}).id}
        />
      </Drawer>
    </div>
  );
};

export default connectToRedux(AdminRequestProcessedComponent);
