import { Button, Col, Drawer, Row } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import ReactTableLayout from '../layouts/ReactTableLayout';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  createReverseAuction,
  CreateReverseAuctionData,
  removeSupplierAuction,
  RemoveSupplierAuctionResetter
} from '../stores/AuctionState';
import {
  getSupplierByGroupId,
  GetSupplierByGroupIdData
} from '../stores/SupplierState';
import QuotationListDisplayComponent from './Utils/QuotationListDisplayComponent';
import Router from 'next/router';
import { LeftOutlined } from '@ant-design/icons';
import { openNotification } from '../utils';
import UserProfileComponent from './UserProfileComponent';
const connectToRedux = connect(
  createStructuredSelector({
    supplierByGroupData: GetSupplierByGroupIdData,
    submitAuctionData: CreateReverseAuctionData
  }),
  (dispatch) => ({
    getSupplierByGroupId: (page, pageSize, groupId) =>
      dispatch(
        getSupplierByGroupId({
          groupId,
          pageIndex: page,
          pageSize
        })
      ),
    removeSupplier: (supplierId, reverseAuctionId, callback) =>
      dispatch(
        removeSupplierAuction({ supplierId, reverseAuctionId }, callback)
      ),
    submitAuction: (values) => {
      values.quantity = values.quantity + '';
      values.currentPrice = values.currentPrice + '';
      values.minimumDuration = +values.minimumDuration;
      values.description = (values.brief || {}).value;
      values.auctionStartTime = new Date(values.auctionStartTime);
      dispatch(createReverseAuction(values));
    },
    resetRemoveSupplier: () => dispatch(RemoveSupplierAuctionResetter)
  })
);

const BiddingSupplierReviewComponent = ({
  getSupplierByGroupId,
  supplierByGroupData,
  resetRemoveSupplier,
  groupId,
  submitAuctionData,
  submitAuction,
  values,
  setDefaultTab
}) => {
  const [supplierIds, setSupplierIds] = useState([]);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentSupplierSelected, setCurrentSupplierSelected] = useState({});
  useEffect(() => {
    return () => {
      resetRemoveSupplier();
    };
  }, [resetRemoveSupplier]);

  useEffect(() => {
    if (submitAuctionData) {
      Router.push('/aggregator/bidding');
    }
  }, [submitAuctionData]);
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
      title: 'Quotations',
      dataIndex: 'quotations',
      key: 'quotations'
    }
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSupplierIds(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name
    })
  };

  const getSupplierDataTable = (supplierData = []) => {
    return (
      supplierData &&
      supplierData.length > 0 &&
      supplierData.map((supplier) => {
        return {
          key: supplier.id,
          supplier: (
            <Button
              onClick={() => {
                setCurrentSupplierSelected(supplier);
                setOpenDetails(true);
              }}
              size="small"
              type="link"
            >
              {supplier.firstName+" "} {supplier.lastName}
            </Button>
          ),
          email: supplier.email,
          phone: supplier.phoneNumber,
          quotations: (
            <QuotationListDisplayComponent
              quotations={supplier.description}
              isTooltip
            />
          )
        };
      })
    );
  };
  let supplierData = [],
    totalCount = 0;
  if (supplierByGroupData) {
    supplierData = supplierByGroupData.data;
    totalCount = supplierByGroupData.total;
  }
  return (
    <Row>
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
          </Fragment>
        ) : null}
      </Drawer>
      <ReactTableLayout
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        totalCount={totalCount}
        searchProps={{
          exCondition: [groupId]
        }}
        hasAction={false}
        dispatchAction={getSupplierByGroupId}
        data={getSupplierDataTable(supplierData) || []}
        columns={columns}
        footer={() => {
          return (
            <Row>
              <Col span={24}>
                <Button
                  onClick={() => setDefaultTab('0')}
                  size="small"
                  type="primary"
                >
                  <LeftOutlined /> Previous step
                </Button>
              </Col>
            </Row>
          );
        }}
      />
      <Col span={24}>
        <br />
        <Row justify="end">
          <Button
            disabled={totalCount < 3}
            onClick={() => {
              if (supplierIds?.length < 3) {
                openNotification('error', {
                  message: 'Please select at least 3 suppliers'
                });
                return;
              }
              submitAuction({ ...values, supplierIds });
            }}
            size="large"
            type="primary"
          >
            Submit
          </Button>
        </Row>
      </Col>
    </Row>
  );
};

export default connectToRedux(BiddingSupplierReviewComponent);
