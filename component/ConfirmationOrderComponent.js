import {
  Form,
  Button,
  Row,
  Col,
  Typography,
  InputNumber,
  Space,
  Card,
  Table,
  Drawer,
  Modal,
  Empty,
  Avatar
} from 'antd';
import { PhoneOutlined, MailOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import RequestDetailsComponent from './RequestDetailsComponent';
import {
  DATE_TIME_FORMAT,
  displayCurrency,
  fallbackImage,
  getCurrentUserImage,
  openNotification
} from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getGroupDetails,
  GetGroupDetailsData,
  GetGroupDetailsError,
  GetGroupDetailsResetter
} from '../stores/GroupState';
import Router, { useRouter } from 'next/router';
import {
  getRequestByGroupId,
  getRequestByGroupIdData
} from '../stores/RequestState';
import { getUser, getUserData } from '../stores/UserState';
import Moment from 'react-moment';
import { createNewOrder, CreateNewOrderData } from '../stores/OrderState';
const { Title } = Typography;

const styles = {
  colStyle: { padding: '0 8px' },
  titleStyle: { fontWeight: 500 }
};

const connectToRedux = connect(
  createStructuredSelector({
    groupDetailsData: GetGroupDetailsData,
    groupDetailsError: GetGroupDetailsError,
    requestByGroupData: getRequestByGroupIdData,
    supplierData: getUserData,
    createOrderData: CreateNewOrderData
  }),
  (dispatch) => ({
    getGroupDetails: (id) => dispatch(getGroupDetails(id)),
    getRequestByGroupId: (groupId) =>
      dispatch(getRequestByGroupId({ groupId, pageIndex: 1, pageSize: 100 })),
    getSupplier: (supplierId) => dispatch(getUser(supplierId)),
    createOrder: ({ unitPrice, groupId, supplierId }, callback) =>
      dispatch(createNewOrder({ unitPrice, groupId, supplierId }, callback)),
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
  { title: 'View Details', dataIndex: 'actions', key: 'actions' }
];

const ConfirmationOrderComponent = ({
  isNegotiating = false,
  groupDetailsData,
  groupDetailsError,
  getGroupDetails,
  getRequestByGroupId,
  requestByGroupData,
  getSupplier,
  supplierData,
  createOrder,
  createOrderData
}) => {
  const [price, setPrice] = useState(0);
  const [openRequestDetails, setOpenRequestDetails] = useState(false);
  const [currentRequestSelected, setCurrentRequestSelected] = useState({});
  const [form] = Form.useForm();
  const router = useRouter();
  const { groupId, supplierId } = router.query;

  useEffect(() => {
    if (groupId) {
      getGroupDetails(groupId);
      getRequestByGroupId(groupId);
    }
  }, [groupId, getGroupDetails, getRequestByGroupId]);

  useEffect(() => {
    if (supplierId) {
      getSupplier(supplierId);
    }
  }, [supplierId, getSupplier]);

  if (!groupDetailsData) {
    return <Empty description="Can not find any group for this order!" />;
  }
  if (!supplierData) {
    return <Empty description="Can not find any supplier for this order!" />;
  }
  const { quantity, product = {} } = groupDetailsData;
  const { unitOfMeasure = {} } = product;
  const productDetailsColumns = [
    { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
    {
      title: 'Unit Price',
      dataIndex: 'productPrice',
      key: 'productPrice',
      render: (text) => {
        return isNegotiating ? (
          <InputNumber
            style={{ width: 150 }}
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/,*/g, '')}
            onChange={(value) => setPrice(value)}
          />
        ) : (
          text
        );
      }
    },
    {
      title: 'Total Quantity',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity'
    }
  ];
  const PRODUCT_DETAIL = [
    {
      productName: product.productName,
      productPrice: isNegotiating ? price : displayCurrency(1170000),
      totalQuantity: `${quantity} ${unitOfMeasure.description}`
    }
  ];

  let requestData = [];
  if (requestByGroupData) {
    requestData = requestByGroupData.data;
  }

  const {
    id,
    email,
    address,
    avatar,
    companyName,
    firstName,
    lastName,
    phoneNumber,
    role
  } = supplierData;
  console.log({ avatar });
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
            <Row justify="center">
              <Title style={styles.titleStyle} level={2}>
                Order Confirmation
              </Title>
            </Row>
            <Card
              bordered={false}
              title={<b>Supplier: {`${firstName} ${lastName}`}</b>}
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
                          avatar
                            ? getCurrentUserImage(id)
                            : '/static/images/avatar.png'
                        }
                      />
                      {/* <Avatar
                        style={{ width: 64 }}
                        // size={64}
                        src={getCurrentUserImage(avatar) || fallbackImage}
                      />{' '} */}
                      <span>&nbsp;</span>
                      <div>
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
              title={<b>Order Item</b>}
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
                      Total{' '}
                      {isNegotiating
                        ? displayCurrency(price * quantity)
                        : displayCurrency(257400000)}
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
                dataSource={(requestData || []).map((request) => {
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
            <Row style={{ marginTop: 32 }} justify="center" align="middle">
              <Col span={6}>
                <Button
                  onClick={() => {
                    if (!price) {
                      openNotification('error', {
                        message: 'Please input the price for order!'
                      });
                      return;
                    }
                    Modal.confirm({
                      title: 'Are you sure you want to submit order?',
                      okText: 'Submit',
                      cancelText: 'Cancel',
                      onOk: () => {
                        createOrder(
                          { unitPrice: price, groupId, supplierId },
                          () => {
                            Router.push('/aggregator');
                          }
                        );
                      }
                    });
                  }}
                  block
                  className="submit"
                  type="primary"
                  htmlType="submit"
                >
                  Submit Order
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </div>
  );
};
export default connectToRedux(ConfirmationOrderComponent);
