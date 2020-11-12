import { Button, Card, Drawer, Space, Typography, Modal } from 'antd';
import {
  CloseCircleOutlined,
  CommentOutlined,
  FileProtectOutlined
} from '@ant-design/icons';
import Router from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import ListingSupplierByProductComponent from './ListingSupplierByProductComponent';
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
  GetSupplierByGroupIdError,
  getSupplierByProductId
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
    getSupplierByGroupId: ({ groupId, pageIndex, pageSize }) =>
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
              `/aggregator/order/confirmation?groupID=${1}&isNegotiating=true`
            );
          }}
        >
          Closing deal
        </Button>
      </Space>
    )
  }));

const GroupRequestSuppliersTabComponent = ({
  getSupplierByGroupId,
  supplierByGroupIdData,
  addSupplierToGroup,
  groupId,
  productId,
  addSupplierToGroupData
}) => {
  const [isOpenContact, setIsOpenContact] = useState(false);
  const [openSupplierDetail, setOpenSupplierDetail] = useState(false);
  const [supplierIdSelected, setSupplierIdSelected] = useState([]);

  const callbackGetSupplierList = () => {
    getSupplierByProductId(
      DEFAULT_PAGING_INFO.page,
      DEFAULT_PAGING_INFO.pageSize,
      groupId
    );
  };

  useEffect(() => {
    if (!!groupId) {
      getSupplierByGroupId({ groupId });
    }
  }, [groupId, getSupplierByGroupId]);

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
            dispatchAction={getSupplierByProductId}
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
      <Modal
        width={1000}
        onCancel={() => setIsOpenContact(false)}
        onOk={() => {
          if (supplierIdSelected && supplierIdSelected.length > 0) {
            addSupplierToGroup({
              groupId,
              supplierIds: supplierIdSelected,
              callback: callbackGetSupplierList
            });
          }
        }}
        title="Find Supplier"
        visible={isOpenContact}
        okText="Add"
      >
        {isOpenContact ? (
          <ListingSupplierByProductComponent
            setSupplierIdSelected={(arrayId = []) => {
              setSupplierIdSelected(arrayId);
            }}
            productId={productId}
          />
        ) : null}
      </Modal>
    </Fragment>
  );
};

export default connectToRedux(GroupRequestSuppliersTabComponent);
