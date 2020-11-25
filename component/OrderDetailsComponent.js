import {
  Button,
  Row,
  Col,
  Typography,
  Space,
  Card,
  Table,
  Drawer,
  Empty,
  Avatar
} from 'antd';
import { PhoneOutlined, MailOutlined, LeftOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import RequestDetailsComponent from './RequestDetailsComponent';
import {
  DATE_TIME_FORMAT,
  displayCurrency,
  getCurrentUserImage
} from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { GetGroupDetailsResetter } from '../stores/GroupState';
import Router, { useRouter } from 'next/router';

import Moment from 'react-moment';
import {
  getOrderDetails,
  GetOrderDetailsDataSelector,
  GetOrderDetailsErrorSelector
} from '../stores/OrderState';
import OrderStatusComponent from './Utils/OrderStatusComponent';
import RequestStatusComponent from './Utils/RequestStatusComponent';
import { get } from 'lodash/fp';
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    orderDetailsData: GetOrderDetailsDataSelector,
    orderDetailsError: GetOrderDetailsErrorSelector
  }),
  (dispatch) => ({
    getOrderDetails: (id) => dispatch(getOrderDetails(id)),

    resetData: () => {
      dispatch(GetGroupDetailsResetter);
    }
  })
);

const groupRequestColumns = [
  { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy' },
  { title: 'Preferred Unit Price', dataIndex: 'price', key: 'price' },
  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
  { title: 'Date Created', dataIndex: 'dateCreated', key: 'dateCreated' },
  { title: 'RFQ Status', dataIndex: 'status', key: 'status' },
  { title: 'View Details', dataIndex: 'actions', key: 'actions' }
];

const OrderDetailsComponent = ({ orderDetailsData, getOrderDetails }) => {
  const [openRequestDetails, setOpenRequestDetails] = useState(false);
  const [currentRequestSelected, setCurrentRequestSelected] = useState({});
  const router = useRouter();
  const { id: orderId } = router.query;

  useEffect(() => {
    if (orderId) {
      getOrderDetails(orderId);
    }
  }, [orderId, getOrderDetails]);

  if (!orderDetailsData) {
    return <Empty description="Can not find any order details!" />;
  }
  const {
    product = {},
    groupName,
    orderStatus = {},
    requests,
    unitPrice,
    supplier = {}
  } = orderDetailsData;
  const totalQuantity = (requests || []).reduce((prev, current) => {
    return prev + +current.quantity;
  }, 0);
  const { unitOfMeasure = {} } = product;
  const productDetailsColumns = [
    { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
    {
      title: 'Unit Price',
      dataIndex: 'productPrice',
      key: 'productPrice'
    },
    {
      title: 'Total Quantity',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity'
    }
  ];
  const PRODUCT_DETAIL = [
    {
      productName: (
        <a
          target="_blank"
          rel="noreferrer"
          href={`/product-details?id=${product.id}`}
        >
          {product.productName}
        </a>
      ),

      productPrice: displayCurrency(unitPrice),
      totalQuantity: `${totalQuantity} ${unitOfMeasure.description}`
    }
  ];

  const {
    id,
    email,
    address,
    avatar,
    companyName,
    firstName,
    lastName,
    phoneNumber
  } = supplier || {};

  return (
    <div>
      <Drawer
        width={640}
        title="RFQ details"
        placement={'right'}
        closable={true}
        onClose={() => setOpenRequestDetails(false)}
        visible={openRequestDetails}
        key={'right'}
      >
        {openRequestDetails ? (
          <RequestDetailsComponent
            requestId={(currentRequestSelected || {}).id}
            isSupplier={false}
          />
        ) : null}
      </Drawer>
      <Col span={24}>
        <Row align="middle" justify="center">
          <Col sm={22} md={20}>
            <Button
              type="link"
              onClick={() => {
                Router.push(`/aggregator/order`);
              }}
            >
              <LeftOutlined /> Back to order list
            </Button>
          </Col>
          <Col sm={22} md={20}>
            <Row justify="center">
              <Title level={3}>Order Details</Title>
            </Row>
            <Card
              bordered={false}
              title={<b>Supplier Information</b>}
              style={{
                width: '100%',
                boxShadow: '2px 2px 14px 0 rgba(0,0,0,.1)',
                marginTop: 16
              }}
            >
              <Row justify="space-between">
                <Col span={16}>
                  <Card bordered={false} size="small">
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}
                    >
                      <Avatar
                        size={64}
                        src={
                          getCurrentUserImage(id) || '/static/images/avatar.png'
                        }
                      />

                      <span>&nbsp;&nbsp;&nbsp;</span>
                      <div>
                        Supplier Name: {`${firstName} ${lastName}`}
                        <br />
                        Company: {companyName}
                        <br />
                        Address: {address}
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card bordered={false} size="small">
                    <div style={{ textAlign: 'right' }}>
                      <Space>
                        {email}
                        <MailOutlined />
                      </Space>
                      <br />
                      <Space>
                        {phoneNumber}
                        <PhoneOutlined />
                      </Space>
                      <br />
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>
            <Card
              bordered={false}
              title={
                <Row justify="space-between">
                  <b>Order Item</b>
                  <Row dir="row" align="middle">
                    <Title style={{ marginBottom: 0 }} level={5}>
                      Order Status:<span>&nbsp;</span>
                    </Title>
                    <OrderStatusComponent status={orderStatus.id} />
                  </Row>
                </Row>
              }
              style={{
                width: '100%',
                boxShadow: '2px 2px 14px 0 rgba(0,0,0,.1)',
                marginTop: 10
              }}
            >
              <Table
                bordered
                columns={productDetailsColumns}
                dataSource={PRODUCT_DETAIL}
                rowKey="id"
                pagination={false}
                footer={() => (
                  <div align="right" style={{ height: '20px' }}>
                    <p style={{ color: '#199eb8', fontSize: 18 }}>
                      Total {displayCurrency(unitPrice * totalQuantity)}
                    </p>
                  </div>
                )}
              />
            </Card>
            <Card
              bordered={false}
              title={<b>Request List</b>}
              style={{
                width: '100%',
                boxShadow: '2px 2px 14px 0 rgba(0,0,0,.1)',
                marginTop: 10
              }}
            >
              <Table
                bordered
                columns={groupRequestColumns}
                dataSource={(requests || []).map((request) => {
                  const {
                    id,
                    buyer = {},
                    quantity,
                    product = {},
                    dateCreated,
                    preferredUnitPrice
                  } = request;
                  return {
                    key: id,
                    createdBy: buyer.fullName,
                    price: displayCurrency(preferredUnitPrice),
                    quantity: `${quantity} ${product.unitType}`,
                    dateCreated: (
                      <Moment format={DATE_TIME_FORMAT}>{dateCreated}</Moment>
                    ),
                    status: (
                      <RequestStatusComponent
                        status={get('requestStatus.id')(request)}
                      />
                    ),
                    actions: (
                      <Button
                        onClick={() => {
                          setCurrentRequestSelected(request);
                          setOpenRequestDetails(true);
                        }}
                        type="link"
                      >
                        View
                      </Button>
                    )
                  };
                })}
                rowKey="key"
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </Col>
    </div>
  );
};
export default connectToRedux(OrderDetailsComponent);
