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
  Avatar,
  Skeleton,
  Tag,
  Modal,
  message
} from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  LeftOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  PrinterOutlined 
} from '@ant-design/icons';
import React, { Fragment, useEffect, useState } from 'react';
import RequestDetailsComponent from './RequestDetailsComponent';
import {
  DATE_TIME_FORMAT,
  displayCurrency,
  getCurrentUserImage,
  getUtcTime
} from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Router, { useRouter } from 'next/router';

import Moment from 'react-moment';
import {
  deliveredOrder,
  DeliveredOrderDataSelector,
  DeliveredOrderErrorSelector,
  DeliveredOrderResetter,
  getOrderDetails,
  GetOrderDetailsDataSelector,
  GetOrderDetailsErrorSelector,
  GetOrderDetailsResetter
} from '../stores/OrderState';
import OrderStatusComponent from './Utils/OrderStatusComponent';
import RequestStatusComponent from './Utils/RequestStatusComponent';
import { get } from 'lodash/fp';
import { ADMIN, BUYER, MODERATOR, SUPPLIER } from '../enums/accountRoles';
import RequestDetailsForSupplierComponent from './RequestDetailsForSupplierComponent';
import { R_DONE } from '../enums/requestStatus';
import FeedbackSubmitComponent from './FeedbackSubmitComponent';
import { CreateFeedbackData } from '../stores/FeedbackState';
import FeedbackDetailsComponent from './FeedbackDetailsComponent';
import DisplayStarComponent from './Utils/DisplayStarComponent';
const { Title, Text } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    orderDetailsData: GetOrderDetailsDataSelector,
    orderDetailsError: GetOrderDetailsErrorSelector,
    deliveredOrderData: DeliveredOrderDataSelector,
    deliveredOrderError: DeliveredOrderErrorSelector,
    createFeedbackData: CreateFeedbackData
  }),
  (dispatch) => ({
    getOrderDetails: (id) => dispatch(getOrderDetails(id)),
    deliveredOrder: ({ orderId, requestId }) =>
      dispatch(deliveredOrder({ orderId, requestId })),
    resetData: () => {
      dispatch(GetOrderDetailsResetter);
    },
    resetDelivered: () => dispatch(DeliveredOrderResetter)
  })
);

const getPathURLByRole = (role) => {
  let path = 'buyer';
  switch (role) {
    case SUPPLIER:
      path = 'supplier';
      break;
    case MODERATOR:
      path = 'aggregator';
      break;
    case ADMIN:
      path = 'admin';
      break;
    default:
      break;
  }
  return path;
};

const OrderDetailsComponent = ({
  orderDetailsData,
  getOrderDetails,
  role = MODERATOR,
  orderDetailsError,
  resetData,
  deliveredOrder,
  deliveredOrderData,
  deliveredOrderError,
  resetDelivered,
  createFeedbackData
}) => {
  const [openRequestDetails, setOpenRequestDetails] = useState(false);
  const [currentRequestSelected, setCurrentRequestSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openFeedbackDetails, setOpenFeedbackDetails] = useState(false);
  const [currentFeedbackId, setCurrentFeedbackId] = useState(null);
  const { id: orderId } = router.query;
  useEffect(() => {
    if (createFeedbackData) {
      message.success('Thank for your feedback!');
      setOpenFeedback(false);
      getOrderDetails(orderId);
    }
  }, [createFeedbackData, orderId, getOrderDetails]);

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      getOrderDetails(orderId);
    }
  }, [orderId, getOrderDetails]);

  useEffect(() => {
    if (!!deliveredOrderData) {
      message.success('Change to delivered successfully');
      getOrderDetails(orderId);
      resetDelivered();
    }
  }, [deliveredOrderData, resetDelivered, orderId, getOrderDetails]);

  useEffect(() => {
    if (!!deliveredOrderError) {
      message.error('Change to delivered error');
      resetDelivered();
    }
  }, [deliveredOrderError, resetDelivered, orderId]);

  useEffect(() => {
    if (orderDetailsData || orderDetailsError) {
      setLoading(false);
    }
  }, [orderDetailsData, orderDetailsError]);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);
  if (loading) {
    return <Skeleton active />;
  }
  if (!orderDetailsData) {
    return <Empty description="Can not find any order details!" />;
  }
  let groupRequestColumns = [
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy' },
    { title: 'Preferred Unit Price', dataIndex: 'price', key: 'price' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'RFQ Status', dataIndex: 'status', key: 'status' },
    { title: 'View Details', dataIndex: 'actions', key: 'actions' }
  ];
  if (role === SUPPLIER) {
    groupRequestColumns.push({
      title: 'Is Delivered',
      dataIndex: 'delivered',
      key: 'delivered'
    });
  }
  if (role === ADMIN) {
    groupRequestColumns.splice(4, 0, {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating'
    });
  }
  const {
    product = {},
    orderStatus = {},
    requests,
    unitPrice,
    supplier = {},
    quantity,
    requestStatus = {},
    dateCreated,
    aggregator = {},
    feedbackId
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
      title: role === BUYER ? 'Quantity' : 'Total Quantity',
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
      totalQuantity: `${role === BUYER ? quantity : totalQuantity} ${
        unitOfMeasure.description
      }`
    }
  ];

  const { id, email, address, companyName, firstName, lastName, phoneNumber, fax, taxIdentificationNumber } =
    supplier || {};

  return (
    <div>
      <Modal
        width={1000}
        title="Feedback form"
        visible={openFeedback}
        onOk={() => {}}
        onCancel={() => {
          setOpenFeedback(false);
        }}
        footer={false}
      >
        {openFeedback ? (
          <FeedbackSubmitComponent
            requestId={(orderDetailsData || {}).id}
            unitPrice={unitPrice}
            quantity={quantity}
            product={product}
            title={false}
            span={22}
            supplier={supplier}
          />
        ) : null}
      </Modal>
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
          role === SUPPLIER ? (
            <RequestDetailsForSupplierComponent
              requestDetailsData={currentRequestSelected}
            />
          ) : (
            <RequestDetailsComponent
              requestId={(currentRequestSelected || {}).id}
              isSupplier={role === SUPPLIER}
            />
          )
        ) : null}
      </Drawer>
      <Drawer
        width={640}
        title="Feedback details"
        placement={'right'}
        closable={true}
        onClose={() => setOpenFeedbackDetails(false)}
        visible={openFeedbackDetails}
        key={'right'}
      >
        {openFeedbackDetails ? (
          <FeedbackDetailsComponent
            isAtOrder={true}
            isAdmin={role === ADMIN}
            feedbackId={feedbackId || currentFeedbackId}
          />
        ) : null}
      </Drawer>
      <Col span={24}>
        <Row align="middle" justify="center">
          <Col sm={22} md={20}>
            <Button
              type="link"
              onClick={() => {
                Router.push(`/${getPathURLByRole(role)}/order`);
              }}
            >
              <LeftOutlined /> Back to order list
            </Button>
          </Col>
          <Col sm={22} md={20}>
            <Row justify="center">
              <Title level={3}>Order Details</Title>
              <Col span={24} style={{ textAlign: 'center' }}>
                Date Create: {getUtcTime(dateCreated)}
              </Col>
            </Row>
            {role === ADMIN && (
              <Card
                bordered={false}
                title={<b>Aggregator Information</b>}
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
                            getCurrentUserImage(aggregator.id) ||
                            '/static/images/avatar.png'
                          }
                        />

                        <span>&nbsp;&nbsp;&nbsp;</span>
                        <div>
                          {role !== BUYER && (
                            <Fragment>
                              Aggregator Name:{' '}
                              {`${aggregator.firstName} ${aggregator.lastName}`}
                              <br />
                            </Fragment>
                          )}
                          {/* Company: {companyName} */}
                          Address: {address}
                        </div>
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card bordered={false} size="small">
                      <div style={{ textAlign: 'right' }}>
                        <Space>
                          {aggregator.email}
                          <MailOutlined />
                        </Space>
                        <br />
                        <Space>
                          {aggregator.phoneNumber}
                          <PhoneOutlined />
                        </Space>
                        <br />
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>
            )}
            {role !== SUPPLIER && (
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
                            getCurrentUserImage(id) ||
                            '/static/images/avatar.png'
                          }
                        />

                        <span>&nbsp;&nbsp;&nbsp;</span>
                        <div>
                          {role !== BUYER && (
                            <Fragment>
                              Supplier Name: {`${firstName} ${lastName}`}
                              <br />
                            </Fragment>
                          )}
                          Company: {companyName}
                          <br />
                          Address: {address}
                          <br />
                          Tax Identification Number:
                          {taxIdentificationNumber
                            ? taxIdentificationNumber
                            : 'N/A'}
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
                        {fax ? (
                          <Space>
                            {fax}
                            <PrinterOutlined />
                          </Space>
                        ) : null}
                        <br />
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>
            )}
            <Card
              bordered={false}
              title={
                <Row justify="space-between">
                  <b>Order Item</b>
                  <Row dir="row" align="middle">
                    <Title style={{ marginBottom: 0 }} level={5}>
                      Order Status:<span>&nbsp;</span>
                    </Title>
                    {role === BUYER ? (
                      <RequestStatusComponent status={requestStatus.id} />
                    ) : (
                      <OrderStatusComponent status={orderStatus.id} />
                    )}
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
                footer={() => {
                  if (role === BUYER && (requestStatus || {}).id === R_DONE) {
                    return (
                      <Row justify="space-between">
                        <div>
                          {!feedbackId ? (
                            <Button
                              size="small"
                              icon={<FormOutlined />}
                              onClick={() => setOpenFeedback(true)}
                              type="primary"
                            >
                              Give Feedback
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                setOpenFeedbackDetails(true);
                              }}
                              size="small"
                            >
                              View feedback
                            </Button>
                          )}
                        </div>
                        <div style={{ height: '20px' }}>
                          <p style={{ color: '#199eb8', fontSize: 18 }}>
                            Total{' '}
                            {displayCurrency(
                              unitPrice *
                                (role === BUYER ? quantity : totalQuantity)
                            )}
                          </p>
                        </div>
                      </Row>
                    );
                  } else {
                    return (
                      <div align="right" style={{ height: '20px' }}>
                        <p style={{ color: '#199eb8', fontSize: 18 }}>
                          Total{' '}
                          {displayCurrency(
                            unitPrice *
                              (role === BUYER ? quantity : totalQuantity)
                          )}
                        </p>
                      </div>
                    );
                  }
                }}
              />
            </Card>
            {role !== BUYER && (
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
                        <Moment format={DATE_TIME_FORMAT}>
                          {getUtcTime(dateCreated)}
                        </Moment>
                      ),
                      rating: request?.feedback?.rating ? (
                        <DisplayStarComponent
                          star={request?.feedback?.rating}
                        />
                      ) : (
                        'N/A'
                      ),
                      status: (
                        <RequestStatusComponent
                          status={get('requestStatus.id')(request)}
                        />
                      ),
                      actions: (
                        <Space>
                          <Button
                            onClick={() => {
                              setCurrentRequestSelected(request);
                              setOpenRequestDetails(true);
                            }}
                            type="link"
                          >
                            RFQ
                          </Button>
                          {request?.feedback?.feedbackId && role === ADMIN && (
                            <Button
                              onClick={() => {
                                setCurrentFeedbackId(
                                  request?.feedback?.feedbackId
                                );
                                setOpenFeedbackDetails(true);
                              }}
                              type="link"
                            >
                              Feedback
                            </Button>
                          )}
                        </Space>
                      ),
                      delivered:
                        get('requestStatus.id')(request) === R_DONE ? (
                          <Tag
                            color="#87d068"
                            size="small"
                            icon={<CheckOutlined />}
                          >
                            Delivered
                          </Tag>
                        ) : (
                          <Space>
                            <Tag
                              color="warning"
                              size="small"
                              icon={<ExclamationCircleOutlined />}
                            >
                              Not yet
                            </Tag>
                            <Button
                              onClick={() => {
                                Modal.confirm({
                                  title: (
                                    <div>
                                      Do you want to change this Request to
                                      Delivered?
                                      <br />
                                      <Text
                                        style={{ fontSize: 12 }}
                                        type="warning"
                                      >
                                        Warning: This action cannot be undone
                                      </Text>
                                    </div>
                                  ),
                                  okText: 'Yes',
                                  cancelText: 'No',
                                  onOk: () => {
                                    deliveredOrder({ orderId, requestId: id });
                                  }
                                });
                              }}
                              size="small"
                            >
                              Update Status
                            </Button>
                          </Space>
                        )
                    };
                  })}
                  rowKey="key"
                  pagination={false}
                />
              </Card>
            )}
          </Col>
        </Row>
      </Col>
    </div>
  );
};
export default connectToRedux(OrderDetailsComponent);
