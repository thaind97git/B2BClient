import { Button, Drawer, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { R_PENDING } from '../enums/requestStatus';
import ReactTableLayout from '../layouts/ReactTableLayout';
import { DEFAULT_DATE_RANGE } from '../utils';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getRequestGroupBy,
  GetRequestGroupByData,
  GetRequestGroupByError,
  GetRequestGroupByResetter
} from '../stores/RequestState';
import { get } from 'lodash/fp';
import AdminRequestPendingDrawerComponent from './AdminRequestPendingDrawerComponent';

const { Title } = Typography;
const connectToRedux = connect(
  createStructuredSelector({
    requestPagingData: GetRequestGroupByData,
    requestPagingError: GetRequestGroupByError
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
        getRequestGroupBy({
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

    resetData: () => {
      dispatch(GetRequestGroupByResetter);
    }
  })
);

const columns2 = [
  {
    title: 'Product Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Total RFQ',
    dataIndex: 'totalRfq',
    key: 'totalRfq'
  },
  {
    title: 'Total Quantity',
    dataIndex: 'totalQuantity',
    key: 'totalQuantity'
  },
  {
    title: 'View RFQ list',
    dataIndex: 'listRfq',
    key: 'listRfq'
  }
];

const statusFilter = [R_PENDING];

const AdminRequestGroupManagement = ({
  requestPagingData,
  requestPagingError,
  getRequest,
  resetData
}) => {
  const [searchMessage, setSearchMessage] = useState('');
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [openRequestList, setOpenRequestList] = useState(false);

  const [currentProductIdSelected, setCurrentProductIdSelected] = useState(
    null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestPagingError || requestPagingData) {
      setLoading(false);
    }
  }, [requestPagingError, requestPagingData]);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  const getRequestTable = (requestGroupByData = []) => {
    return (
      requestGroupByData &&
      requestGroupByData.length > 0 &&
      requestGroupByData.map((group = {}) => {
        const requests = group.requests || [];
        const totalQuantity = requests.reduce((prev, current) => {
          return prev + +current.quantity;
        }, 0);
        return {
          productId: get('product.id')(group),
          key: group.id,
          name: get('product.productName')(group),
          totalQuantity: `${totalQuantity} ${get(
            'product.unitOfMeasure.description'
          )(group)}`,
          totalRfq: requests.length,
          listRfq: (
            <Button
              onClick={() => {
                setOpenRequestList(true);
                setCurrentProductIdSelected((group.product || {}).id);
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

  let requestGroupByData = [],
    totalCount = 0;
  if (requestPagingData) {
    requestGroupByData = requestPagingData.data;
    totalCount = requestPagingData.total;
  }
  // if (loading) {
  //   return <Skeleton  active/>
  // }
  return (
    <div>
      <ReactTableLayout
        title={() => <Title level={5}>List Product existing RFQ</Title>}
        dispatchAction={getRequest}
        searchProps={{
          placeholder: 'Search by product name',
          searchMessage,
          setSearchMessage,
          // exElement: (
          //   <AllCategoryComponent
          //     onGetLastValue={(value) => setCategory(value)}
          //     size="large"
          //     isSearchStyle={false}
          //   />
          // ),
          exCondition: [statusFilter]
        }}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
        data={getRequestTable(requestGroupByData || [])}
        columns={columns2}
        totalCount={totalCount}
      />
      <Drawer
        width={'65vw'}
        title="List RFQ"
        placement={'left'}
        closable={true}
        onClose={() => setOpenRequestList(false)}
        visible={openRequestList}
        key={'left'}
      >
        {openRequestList ? (
          <AdminRequestPendingDrawerComponent
            productId={currentProductIdSelected}
          />
        ) : null}
      </Drawer>
    </div>
  );
};

export default connectToRedux(AdminRequestGroupManagement);
