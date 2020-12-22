import { Button, Col, Row, Drawer, Empty } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useEffect, useState } from 'react';
import { R_PENDING } from '../enums/requestStatus';
import ReactTableLayout from '../layouts/ReactTableLayout';
import {
  DATE_TIME_FORMAT,
  DEFAULT_DATE_RANGE,
  DEFAULT_PAGING_INFO,
  displayCurrency,
  getUtcTime
} from '../utils';
import GroupCreateComponent from './GroupCreateComponent';
import RequestStatusComponent from './Utils/RequestStatusComponent';
import RequestDetailsComponent from './RequestDetailsComponent';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getRequestGroupBy,
  getRequestPagingByProduct,
  GetRequestPagingByProductData,
  GetRequestPagingByProductError,
  GetRequestPagingResetter
} from '../stores/RequestState';
import Moment from 'react-moment';
import { get } from 'lodash/fp';
import ListingGroupByProductComponent from './ListingGroupByProductComponent';
import {
  addRequestToGroup,
  AddRequestToGroupData,
  AddRequestToGroupError,
  AddRequestToGroupResetter,
  CreateNewGroupData,
  CreateNewGroupResetter
} from '../stores/GroupState';
import { CreateNewProductError } from '../stores/ProductState';
const connectToRedux = connect(
  createStructuredSelector({
    requestPagingData: GetRequestPagingByProductData,
    requestPagingError: GetRequestPagingByProductError,
    addRequestData: AddRequestToGroupData,
    addRequestError: AddRequestToGroupError,
    createNewGroupData: CreateNewGroupData,
    createNewGroupError: CreateNewProductError
  }),
  (dispatch) => ({
    getRequestByProduct: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange,
      status,
      category,
      productId
    ) => {
      if (!productId) {
        return;
      }
      dispatch(
        getRequestPagingByProduct({
          pageSize,
          pageIndex,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
          productTitle: searchMessage,
          status,
          category,
          productId
        })
      );
    },
    getRequestByGroup: (
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

    addRequest: (groupId, requestIds) =>
      dispatch(addRequestToGroup({ groupId, requestIds })),
    resetData: () => {
      dispatch(GetRequestPagingResetter);
    },
    resetAddRequestToGroup: () => dispatch(AddRequestToGroupResetter),
    resetCreateNewGroup: () => dispatch(CreateNewGroupResetter)
  })
);

const columns = [
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
    title: 'Details',
    dataIndex: 'actions',
    key: 'actions'
  }
];

const statusFilter = [R_PENDING];

const AdminRequestDrawerManagement = ({
  requestPagingData,
  requestPagingError,
  getRequestByProduct,
  addRequest,
  addRequestData,
  createNewGroupData,
  resetData,
  productId,
  getRequestByGroup,
  resetAddRequestToGroup,
  resetCreateNewGroup
}) => {
  const [searchMessage, setSearchMessage] = useState('');
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [recordSelected, setRecordSelected] = useState([]);
  const [requestIdSelected, setRequestIdSelected] = useState([]);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [openListGroup, setOpenListGroup] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentRequestSelected, setCurrentRequestSelected] = useState({});

  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const [currentGroupId, setCurrentGroupId] = useState(null);

  useEffect(() => {
    if (addRequestData) {
      setOpenListGroup(false);
      setRecordSelected([]);
      getRequestByProduct(
        DEFAULT_PAGING_INFO.page,
        DEFAULT_PAGING_INFO.pageSize,
        searchMessage,
        {},
        statusFilter,
        category,
        productId
      );
      getRequestByGroup(
        DEFAULT_PAGING_INFO.page,
        DEFAULT_PAGING_INFO.pageSize,
        searchMessage,
        {},
        statusFilter,
        category
      );
      resetAddRequestToGroup();
    }
  }, [addRequestData]);

  useEffect(() => {
    if (createNewGroupData) {
      setOpenCreateGroup(false);
      setOpenListGroup(false);
      setRecordSelected([]);
      getRequestByProduct(
        DEFAULT_PAGING_INFO.page,
        DEFAULT_PAGING_INFO.pageSize,
        searchMessage,
        {},
        statusFilter,
        category,
        productId
      );
      getRequestByGroup(
        DEFAULT_PAGING_INFO.page,
        DEFAULT_PAGING_INFO.pageSize,
        searchMessage,
        {},
        statusFilter,
        category
      );
      resetCreateNewGroup();
    }
  }, [createNewGroupData]);

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

  if (!productId) {
    return <Empty description="Invalid Product" />;
  }

  const getRequestTable = (requestData = []) => {
    return (
      requestData &&
      requestData.length > 0 &&
      requestData.map((request = {}) => ({
        productId: get('product.id')(request),
        key: request.id,
        price: displayCurrency(+request.preferredUnitPrice),
        name: get('product.description')(request),
        quantity:
          +request.quantity || 0 + ' ' + get('product.unitType')(request),
        dueDate: (
          <Moment format={DATE_TIME_FORMAT}>
            {getUtcTime(request.dueDate)}
          </Moment>
        ),
        status: (
          <RequestStatusComponent status={(request.requestStatus || {}).id} />
        ),
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

  const isAllInOne = (requestData || []).every(
    (request) =>
      get('product.id')(request) === get('[0].product.id')(requestData)
  );
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRecordSelected(selectedRows);
      const requestIds = selectedRows.map((row) => row.key);
      setRequestIdSelected(requestIds);
      setCurrentProductId((selectedRows[0] || {}).productId);
    },
    getCheckboxProps: (record) => ({
      disabled:
        recordSelected.length !== 0
          ? record.productId !== get('[0].productId')(recordSelected)
          : false,
      name: record.name
    }),
    hideSelectAll: isAllInOne ? false : true
  };
  return (
    <div>
      <Modal
        width={1000}
        title="Create New Group"
        visible={openCreateGroup}
        onOk={() => setOpenCreateGroup(false)}
        onCancel={() => setOpenCreateGroup(false)}
        footer={[
          <Button key="back" onClick={() => setOpenCreateGroup(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            form="group-create"
            htmlType="submit"
          >
            Submit
          </Button>
        ]}
      >
        {openCreateGroup ? (
          <GroupCreateComponent
            requestIds={requestIdSelected}
            productId={currentProductId}
          />
        ) : null}
      </Modal>
      <Modal
        closable
        width={1000}
        title={`Listing Group inside ${(recordSelected[0] || {}).name}`}
        visible={openListGroup}
        onOk={() => setOpenListGroup(false)}
        onCancel={() => setOpenListGroup(false)}
        footer={[
          <Row justify="space-between">
            <Col>
              <Button type="primary" onClick={() => setOpenCreateGroup(true)}>
                Create new group
              </Button>
            </Col>
            <Col>
              <Button key="back" onClick={() => setOpenListGroup(false)}>
                Cancel
              </Button>
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  addRequest(currentGroupId, requestIdSelected);
                }}
              >
                Submit
              </Button>
            </Col>
          </Row>
        ]}
      >
        {openListGroup ? (
          <ListingGroupByProductComponent
            setCurrentGroupId={setCurrentGroupId}
            productId={currentProductId}
          />
        ) : null}
      </Modal>
      <Row justify="end">
        <Button
          onClick={() => setOpenListGroup(true)}
          type="primary"
          disabled={recordSelected.length > 0 ? false : true}
        >
          Choose Group to Add
        </Button>
      </Row>
      <ReactTableLayout
        dispatchAction={getRequestByProduct}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        searchProps={{
          placeholder: 'Search by product name',
          searchMessage,
          setSearchMessage,
          exCondition: [statusFilter, category, productId],
          isSearch: false
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
        {openDetails ? (
          <RequestDetailsComponent
            setOpenDetails={setOpenDetails}
            requestId={(currentRequestSelected || {}).id}
            isSupplier={false}
            isAggregator={true}
          />
        ) : null}
      </Drawer>
    </div>
  );
};

export default connectToRedux(AdminRequestDrawerManagement);
