import { Button, Modal, Row, Space, Tag } from 'antd';
import React, { useEffect } from 'react';
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
  GetSupplierInvitationData,
  removeSupplierAuction,
  RemoveSupplierAuctionResetter
} from '../stores/AuctionState';
import {
  B_ACTIVE,
  B_CANCELED,
  B_CLOSED,
  B_DONE,
  B_FAILED,
  B_FUTURE
} from '../enums/biddingStatus';
import { DEFAULT_PAGING_INFO } from '../utils';

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
      ),
    removeSupplier: (supplierId, reverseAuctionId, callback) =>
      dispatch(
        removeSupplierAuction({ supplierId, reverseAuctionId }, callback)
      ),
    resetRemoveSupplier: () => dispatch(RemoveSupplierAuctionResetter)
  })
);

const BiddingSupplierListComponent = ({
  getSupplierInvitation,
  supplierInvitationData,
  reverseAuctionId,
  removeSupplier,
  resetRemoveSupplier,
  reverseAuctionStatus
}) => {
  useEffect(() => {
    return () => {
      resetRemoveSupplier();
    };
  }, [resetRemoveSupplier]);
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
    }
  ];

  const getSupplierDataTable = (supplierData = []) => {
    return (
      supplierData &&
      supplierData.length > 0 &&
      supplierData.map((supplierItem) => {
        const { supplier = {}, isAccepted, isDeleted } = supplierItem || {};
        return {
          key: supplier.id,
          supplier: `${supplier.firstName} ${supplier.lastName}`,
          email: supplier.email,
          phone: supplier.phoneNumber,
          status: isDeleted ? (
            <Tag icon={<CloseCircleOutlined />} color="error">
              Removed
            </Tag>
          ) : isAccepted === null ? (
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
          actions: !isDeleted && (
            <Space>
              <Button
                onClick={() =>
                  Modal.confirm({
                    title: 'Are you sure you want to remove this supplier?',
                    okText: 'Yes',
                    cancelText: 'No',
                    onOk: () => {
                      removeSupplier(supplier?.id, reverseAuctionId, () => {
                        getSupplierInvitation(
                          DEFAULT_PAGING_INFO.page,
                          DEFAULT_PAGING_INFO.pageSize,
                          reverseAuctionId
                        );
                      });
                    }
                  })
                }
                size="small"
                danger
              >
                Remove
              </Button>
            </Space>
          )
        };
      })
    );
  };
  let supplierData = [],
    totalCount = 0;
  let isExistedNotDeleted = false;
  let isEnd = false;
  if (supplierInvitationData) {
    supplierData = supplierInvitationData.data;
    totalCount = supplierInvitationData.total;
    console.log({ reverseAuctionStatus });
    if (
      [B_CANCELED, B_CLOSED, B_DONE, B_FAILED].includes(
        reverseAuctionStatus?.id
      )
    ) {
      isEnd = true;
    } else {
      for (const supplier of supplierData) {
        if (supplier.isDeleted === false) {
          isExistedNotDeleted = true;
          break;
        }
      }
    }

    if (isExistedNotDeleted || !isEnd) {
      columns.push({
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions'
      });
    }
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
