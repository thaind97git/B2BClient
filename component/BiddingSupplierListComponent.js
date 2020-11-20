import { Button, Row, Space, Tag } from 'antd';
import React from 'react';
import ReactTableLayout from '../layouts/ReactTableLayout';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getSupplierInvitation,
  GetSupplierInvitationData
} from '../stores/AuctionState';

const connectToRedux = connect(
  createStructuredSelector({
    supplierInvitationData: GetSupplierInvitationData
  }),
  (dispatch) => ({
    getSupplierInvitation: (page, pageSize, reverseAuctionId) =>
      dispatch(
        getSupplierInvitation({
          reverseAuctionId,
          pageIndex: page,
          pageSize
        })
      )
  })
);

const columns = [
  {
    title: 'Supplier',
    dataIndex: 'supplier',
    key: 'supplier'
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone'
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

const getSupplierDataTable = (supplierData = []) => {
  return (
    supplierData &&
    supplierData.length > 0 &&
    supplierData.map((supplierItem) => {
      const { supplier = {}, isAccepted } = supplierItem || {};
      return {
        key: supplier.id,
        supplier: `${supplier.firstName} ${supplier.lastName}`,
        email: supplier.email,
        phone: supplier.phoneNumber,
        status:
          isAccepted === null ? (
            <Tag icon={<ClockCircleOutlined />} color="warning">
              Pending
            </Tag>
          ) : isAccepted ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Registered
            </Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} color="error">
              Not accepted invitation
            </Tag>
          ),
        actions: (
          <Space>
            <Button size="small" danger>
              Remove
            </Button>
          </Space>
        )
      };
    })
  );
};
const BiddingSupplierListComponent = ({
  getSupplierInvitation,
  supplierInvitationData,
  reverseAuctionId
}) => {
  let supplierData = [],
    totalCount = 0;
  if (supplierInvitationData) {
    supplierData = supplierInvitationData.data;
    totalCount = supplierInvitationData.total;
  }
  return (
    <Row>
      <ReactTableLayout
        totalCount={totalCount}
        searchProps={{
          exCondition: [reverseAuctionId]
        }}
        hasAction={false}
        dispatchAction={getSupplierInvitation}
        data={getSupplierDataTable(supplierData) || []}
        columns={columns}
      />
    </Row>
  );
};

export default connectToRedux(BiddingSupplierListComponent);
