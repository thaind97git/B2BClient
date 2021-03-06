import { Button, Card, Drawer, Space, Typography } from 'antd';
import {
  CloseCircleOutlined,
  CommentOutlined,
  FileProtectOutlined
} from '@ant-design/icons';
import Router from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import UserProfileComponent from './UserProfileComponent';
import { DEFAULT_PAGING_INFO } from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  addSupplierToGroup,
  AddSupplierToGroupData,
  AddSupplierToGroupError
} from '../stores/GroupState';
import {
  getSupplierByGroupId,
  GetSupplierByGroupIdData,
  GetSupplierByGroupIdError
} from '../stores/SupplierState';
import ReactTableLayout from '../layouts/ReactTableLayout';
import { createLink } from '../libs';

const { Title } = Typography;

const SUPPLIER_CONTACT = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  { title: 'Is Ignore', dataIndex: 'isIgnore', key: 'isIgnore' },
  { title: 'Actions', dataIndex: 'actions', key: 'actions' }
];

const connectToRedux = connect(
  createStructuredSelector({
    supplierByGroupIdData: GetSupplierByGroupIdData,
    supplierByGroupIdError: GetSupplierByGroupIdError,
    addSupplierToGroupData: AddSupplierToGroupData,
    addSupplierToGroupError: AddSupplierToGroupError
  }),
  (dispatch) => ({
    getSupplierByGroupId: (pageIndex, pageSize, groupId) =>
      dispatch(getSupplierByGroupId({ groupId, pageIndex, pageSize })),
    addSupplierToGroup: ({ groupId, supplierIds, callback }) =>
      dispatch(addSupplierToGroup({ groupId, supplierIds, callback }))
  })
);

const getSupplierTable = ({
  supplierData = [],
  setOpenSupplierDetail,
  groupId
}) =>
  supplierData &&
  supplierData.length > 0 &&
  supplierData.map((supplier = {}) => ({
    key: supplier.id,
    name: (
      <Button
        type="link"
        onClick={() => {
          setOpenSupplierDetail(true);
        }}
      >
        {supplier.firstName + supplier.lastName}
      </Button>
    ),
    phone: supplier.phoneNumber,
    email: supplier.email,
    isIgnore: !supplier.flag ? (
      <span style={{ color: 'green' }}>Negotiating</span>
    ) : (
      <Space style={{ color: 'red' }}>
        <CloseCircleOutlined />
        Ignored
      </Space>
    ),
    actions: (
      <Space>
        <Button icon={<CommentOutlined />} size="small" type="dashed">
          <span>&nbsp;</span>
          <a
            href={createLink([
              'aggregator',
              'group',
              `chat?groupId=${groupId}`
            ])}
            target="_blank"
            rel="noreferrer"
          >
            Chat
          </a>
        </Button>
        <Button
          icon={<FileProtectOutlined />}
          size="small"
          style={{ color: 'green' }}
          onClick={() => {
            Router.push(
              `/aggregator/order/confirmation?groupId=${groupId}&isNegotiating=true&supplierId=${supplier.id}`
            );
          }}
        >
          Closing deal
        </Button>
      </Space>
    )
  }));

const BiddingSupplierInvitationComponent = ({
  getSupplierByGroupId,
  supplierByGroupIdData,
  addSupplierToGroup,
  groupId,
  productId,
  addSupplierToGroupData
}) => {
  const [isOpenContact, setIsOpenContact] = useState(false);
  const [openSupplierDetail, setOpenSupplierDetail] = useState(false);

  const callbackGetSupplierList = () => {
    getSupplierByGroupId(
      DEFAULT_PAGING_INFO.page,
      DEFAULT_PAGING_INFO.pageSize,
      groupId
    );
  };

  useEffect(() => {
    if (addSupplierToGroupData) {
      setIsOpenContact(false);
    }
  }, [addSupplierToGroupData]);

  let supplierData = [],
    totalSupplier = 0;
  if (supplierByGroupIdData) {
    supplierData = supplierByGroupIdData.data;
    totalSupplier = supplierByGroupIdData.total;
  }

  return (
    <Fragment>
      <Drawer
        width={640}
        title="Supplier details"
        placement={'right'}
        closable={true}
        onClose={() => setOpenSupplierDetail(false)}
        visible={openSupplierDetail}
        key={'supplier-details'}
      >
        <UserProfileComponent isDrawer={true} />
      </Drawer>

      <Card
        title={<Title level={5}>Suppliers Contact</Title>}
        style={{ width: '100%' }}
      >
        <div>
          <ReactTableLayout
            hasAction={false}
            dispatchAction={getSupplierByGroupId}
            searchProps={{
              exCondition: [groupId]
            }}
            data={getSupplierTable({
              supplierData: supplierData || [],
              setOpenSupplierDetail,
              groupId
            })}
            columns={SUPPLIER_CONTACT}
            totalCount={totalSupplier}
            footer={() => (
              <Button type="primary" onClick={() => setIsOpenContact(true)}>
                Add Suppliers
              </Button>
            )}
          />
        </div>
      </Card>
    </Fragment>
  );
};

export default connectToRedux(BiddingSupplierInvitationComponent);
