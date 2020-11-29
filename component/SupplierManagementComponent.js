import { Button, Drawer, Row, Select, Space, Typography } from 'antd';
import { StarFilled } from '@ant-design/icons';
import React, { Fragment, useEffect, useState } from 'react';
import ReactTableLayout from '../layouts/ReactTableLayout';
import { DEFAULT_DATE_RANGE } from '../utils';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { get } from 'lodash/fp';
import {
  banUser,
  getSupplierPaging,
  GetSupplierPagingData,
  GetSupplierPagingError,
  unBanUser
} from '../stores/SupplierState';
import UserStatusComponent from './Utils/UserStatusComponent';
import {
  U_ACTIVE,
  U_BANNED,
  U_PENDING,
  U_REJECT
} from '../enums/accountStatus';

import UserProfileComponent from './UserProfileComponent';
import ListReportSupplierComponent from './ListReportSupplierComponent';
import DisplayStarComponent from './Utils/DisplayStarComponent';
const { Option } = Select;
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    supplierPagingData: GetSupplierPagingData,
    supplierPagingError: GetSupplierPagingError
  }),
  (dispatch) => ({
    getSupplierPaging: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange,
      status
    ) => {
      dispatch(
        getSupplierPaging({
          pageSize,
          pageIndex,
          email: searchMessage,
          statusId: status,
          rateFrom: dateRange.fromDate,
          rateTo: dateRange.toDate
        })
      );
    }
  })
);

const columns = [
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Full Name',
    dataIndex: 'fullName',
    key: 'fullName'
  },
  {
    title: 'Company Name',
    dataIndex: 'companyName',
    key: 'companyName'
  },
  // {
  //   title: 'Phone Number',
  //   dataIndex: 'phoneNumber',
  //   key: 'phoneNumber'
  // },
  {
    title: (
      <div>
        Average Rating
        <br />
        <small>(Calculated by feedback)</small>
      </div>
    ),
    dataIndex: 'averageRating',
    key: 'averageRating'
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

const SupplierManagementComponent = ({
  getSupplierPaging,
  supplierPagingData,
  supplierPagingError
}) => {
  const [searchMessage, setSearchMessage] = useState('');
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentSupplierSelected, setCurrentSupplierSelected] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supplierPagingError || supplierPagingData) {
      setLoading(false);
    }
  }, [supplierPagingError, supplierPagingData]);

  function handleChange(value) {
    setStatus(value);
  }
  const getSupplierTable = (supplierData = []) => {
    return supplierData
      ? supplierData.map((supplier = {}) => {
          const supplierStatus = +get('userStatus.id')(supplier);
          return {
            key: supplier.id,
            email: supplier.email,
            fullName: `${supplier.firstName} ${supplier.lastName}`,
            companyName: supplier.companyName,
            phoneNumber: supplier.phoneNumber,
            status: <UserStatusComponent status={supplierStatus} />,
            averageRating: (
              <DisplayStarComponent
                isDisplay={supplier.totalFeedback > 0}
                star={supplier.averageRating}
              />
            ),
            actions: (
              <Button
                onClick={() => {
                  setCurrentSupplierSelected(supplier);
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
      : [];
  };

  let supplierData = [],
    totalCount = 0;
  if (!!supplierPagingData && !supplierPagingError) {
    supplierData = supplierPagingData.data;
    totalCount = supplierPagingData.total;
  }
  return (
    <div>
      <Row justify="space-between">
        <Drawer
          width={840}
          title="Supplier Details"
          placement={'right'}
          closable={true}
          onClose={() => setOpenDetails(false)}
          visible={openDetails}
          key={'right'}
        >
          {openDetails ? (
            <Fragment>
              <UserProfileComponent
                isAdmin={true}
                isDrawer
                userId={(currentSupplierSelected || {}).id}
              />
              <ListReportSupplierComponent
                supplierId={(currentSupplierSelected || {}).id}
              />
            </Fragment>
          ) : null}
        </Drawer>
        <Title level={4}>Supplier Management</Title>
      </Row>
      <ReactTableLayout
        totalCount={totalCount}
        loading={loading}
        dispatchAction={getSupplierPaging}
        searchProps={{
          placeholder: 'Search by email',
          placeholderDateRange: ['Rating from', 'To'],
          searchMessage,
          setSearchMessage,
          exElement: (
            <Select
              size="large"
              placeholder="Filter by status"
              style={{ width: 200 }}
              onChange={handleChange}
              defaultValue="all"
            >
              <Option value="all">All Status</Option>
              <Option value={U_PENDING}>Pending</Option>
              <Option value={U_ACTIVE}>Activating</Option>
              <Option value={U_BANNED}>Banned</Option>
              <Option value={U_REJECT}>Rejected</Option>
            </Select>
          ),
          exCondition: [status]
        }}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
        data={getSupplierTable(supplierData || [])}
        columns={columns}
      />
    </div>
  );
};

export default connectToRedux(SupplierManagementComponent);
