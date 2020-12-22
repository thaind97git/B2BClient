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
  getUtcTime,
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
import Moment from 'react-moment';
import {
  createNewOrderAuction,
  CreateNewOrderData
} from '../stores/OrderState';
import {
  getWinning,
  GetWinningData,
  GetWinningResetter
} from '../stores/AuctionState';
const { Title } = Typography;

const styles = {
  colStyle: { padding: '0 8px' },
  titleStyle: { fontWeight: 500 }
};

const connectToRedux = connect(
  createStructuredSelector({
    winningData: GetWinningData,
    createOrderData: CreateNewOrderData
  }),
  (dispatch) => ({
    getWinning: (auctionId) => dispatch(getWinning(auctionId)),
    createOrder: (reverseAuctionId, callback) =>
      dispatch(createNewOrderAuction({ reverseAuctionId }, callback)),
    resetData: () => {
      dispatch(GetWinningResetter);
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

const ConfirmationOrderAuctionComponent = ({
  winningData,
  getWinning,
  createOrder,
  createOrderData
}) => {
  const [openRequestDetails, setOpenRequestDetails] = useState(false);
  const [currentRequestSelected, setCurrentRequestSelected] = useState({});
  const [form] = Form.useForm();
  const router = useRouter();
  const { reverseAuctionId } = router.query;

  useEffect(() => {
    if (reverseAuctionId) {
      getWinning(reverseAuctionId);
    }
  }, [reverseAuctionId, getWinning]);

  if (!winningData) {
    return (
      <Empty description="Can not find any reverse auction for this order!" />
    );
  }
  const { quantity, supplier, price, group = {} } = winningData;
  const { product = {}, requests: requestData = [] } = group;
  const unitOfMeasure = requestData?.[0]?.product?.unitType;
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
  const totalQuantity = requestData?.reduce((prev, current) => {
    return prev + +current.quantity;
  }, 0);
  const PRODUCT_DETAIL = [
    {
      productName: product.description,
      productPrice: displayCurrency(price),
      totalQuantity: `${totalQuantity} ${unitOfMeasure}`
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
    phoneNumber,
    role
  } = supplier || {};
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
                      Total {displayCurrency(price * totalQuantity)}
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
                      <Moment format={DATE_TIME_FORMAT}>
                        {getUtcTime(dateCreated)}
                      </Moment>
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
                    Modal.confirm({
                      title: 'Are you sure you want to submit order?',
                      okText: 'Submit',
                      cancelText: 'Cancel',
                      onOk: () => {
                        createOrder(reverseAuctionId, () => {
                          Router.push('/aggregator/order');
                        });
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
export default connectToRedux(ConfirmationOrderAuctionComponent);
