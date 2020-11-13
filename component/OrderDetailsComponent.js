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
  Modal
} from 'antd';
import {
  PhoneOutlined,
  UserOutlined,
  MobileOutlined,
  LeftOutlined
} from '@ant-design/icons';
import React, { useState } from 'react';
import RequestDetailsComponent from './RequestDetailsComponent';
import { displayCurrency } from '../utils';
import Router from 'next/router';
import { CurrentUserData } from '../stores/UserState';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
const { Title } = Typography;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};

const connectToRedux = connect(
  createStructuredSelector({
    // productPagingData: GetProductPagingData,
    // productPagingError: GetProductPagingError,
    currentUser: CurrentUserData
  })
  //   (dispatch) => ({
  //     getProduct: (pageIndex, pageSize, searchMessage, dateRange, category) => {
  //       dispatch(
  //         getProductPaging({
  //           pageIndex,
  //           pageSize,
  //           categoryID: category,
  //           productName: searchMessage,
  //         })
  //       );
  //     },
);

const styles = {
  colStyle: { padding: '0 8px' },
  titleStyle: { fontWeight: 500 }
};

const SUPPLIER_DETAIL = {
  name: 'Supplier 1',
  companyName: 'FPT company',
  companyPhone: '38835287',
  address: '7 đường 10A, khu dân cư Vĩnh Lộc',
  ward: 'phường Bình Hưng Hòa B',
  district: 'quận Bình Tân',
  province: 'thành phố Hồ Chí Minh',
  phoneNumber: '0919727775',
  email: 'duyquanghoang27@gmail.com'
};
const groupRequestColumns = [
  { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy' },
  { title: 'Preferred Unit Price', dataIndex: 'price', key: 'price' },
  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
  { title: 'Date Created', dataIndex: 'dateCreated', key: 'dateCreated' },
  { title: 'Actions', dataIndex: 'actions', key: 'actions' }
];

const REQUEST_LIST = [
  {
    key: '1',
    price: '1.190.000 đ',
    category: 'Iphone 7S 64Gb',
    quantity: 50,
    createdBy: 'Buyer 1',
    dateCreated: '30/09/2020 02:07:26 PM',
    actions: (
      <Space>
        <Button
          type="link"
          onClick={() => {
            // setOpenRequestDetail(true);
          }}
        >
          {' '}
          Details
        </Button>
      </Space>
    )
  },
  {
    key: '2',
    price: '1.180.000 đ',
    category: 'Iphone 7S 64Gb',
    quantity: 140,
    createdBy: 'Buyer 1',
    dateCreated: '30/09/2020 02:07:26 PM',
    actions: (
      <Space>
        <Button
          type="link"
          onClick={() => {
            // setOpenRequestDetail(true);
          }}
        >
          {' '}
          Details
        </Button>
      </Space>
    )
  },
  {
    key: '3',
    price: '1.200.000 đ',
    category: 'Iphone 7s 64Gb',
    quantity: 30,
    createdBy: 'Buyer 1',
    dateCreated: '30/09/2020 02:07:26 PM'
  }
];

const getRequestTable = (requestList = [], role) => {
  return requestList
    ? requestList.map((request = {}) => ({
        key: request.id,
        createdBy: request.createdBy,
        price: request.price,
        quantity: request.quantity,
        dateCreated: request.dateCreated,
        actions: (
          <Space>
            <Button
              type="link"
              onClick={() => {
                // setOpenRequestDetail(true);
              }}
            >
              {' '}
              View
            </Button>
            { role==="Supplier"?
              <Button
                type="primary"
                onClick={() => {
                  // setOpenRequestDetail(true);
                }}
              >
                Delivered
              </Button>:""
            }
          </Space>
        )
      }))
    : [];
};

const totalQuantity = 220;

const SupplierDetail = () => {
  return (
    <Card
      bordered={false}
      title={<b>Supplier: {SUPPLIER_DETAIL.name}</b>}
      style={{
        width: '100%',
        boxShadow: '2px 2px 14px 0 rgba(0,0,0,.1)',
        marginTop: 16
      }}
    >
      <Row justify="space-between">
        <Col span={8}>
          <Card bordered={false} size="small">
            <b>Company information</b>
            <br />
            {SUPPLIER_DETAIL.companyName}
            <br />
            {SUPPLIER_DETAIL.address}
            <br />
            {SUPPLIER_DETAIL.ward} - {SUPPLIER_DETAIL.district} -{' '}
            {SUPPLIER_DETAIL.province}
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} size="small">
            <b>Company contact</b>
            <br />
            <PhoneOutlined />
            {SUPPLIER_DETAIL.companyPhone}
            <br />
            {/* <PrinterOutlined />
                      <br />
                      <GlobalOutlined />
                      <br />
                      <MailOutlined /> */}
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} size="small">
            <b>Supplier contact</b>
            <br />
            <UserOutlined />
            {SUPPLIER_DETAIL.email}
            <br />
            <MobileOutlined />
            {SUPPLIER_DETAIL.phoneNumber}
            <br />
            {/* <UserOutlined />
                      <br />
                      <MobileOutlined /> */}
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

const RequestList = ({ role }) => {
  const [openRequestDetail, setOpenRequestDetail] = useState(false);
  return (
    <div>
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
          columns={
            role === 'Aggregator'
              ? groupRequestColumns
              : [
                  groupRequestColumns[0],
                  groupRequestColumns[2],
                  groupRequestColumns[3],
                  groupRequestColumns[4]
                ]
          }
          dataSource={getRequestTable(REQUEST_LIST || [],role)}
          rowKey="id"
          pagination={false}
        />
      </Card>
      <Drawer
        width={640}
        title="RFQ details"
        placement={'right'}
        closable={true}
        onClose={() => setOpenRequestDetail(false)}
        visible={openRequestDetail}
        key={'right'}
      >
        <RequestDetailsComponent
          buttonActions={[
            {
              label: 'Remove',
              buttonProps: {
                danger: true
              }
            }
          ]}
        />
      </Drawer>
    </div>
  );
};

const OrderDetailsComponent = ({ isNegotiating = false, currentUser }) => {
  const [price, setPrice] = useState(0);
  const [form] = Form.useForm();

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
              `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/\đ\s?|(,*)/g, '')}
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
      productName:
        'IR Night Vision Hidden Camera Watch Sport Wear Watch Camera WIFI',
      productPrice: isNegotiating ? price : displayCurrency(1170000),
      totalQuantity:
        REQUEST_LIST.reduce((prev, current) => {
          return prev + current.quantity;
        }, 0) + ' Pieces'
    }
  ];

  return (
    <div>
      <Col span={24}>
        <Row
          style={{ paddingBottom: 24 }}
          justify="space-between"
          align="middle"
        >
          <Button
            type="primary"
            onClick={() => {
              let path = '';
              switch (currentUser.role) {
                case 'Aggregator':
                  path = '/aggregator/order';
                  break;
                case 'Buyer':
                  path = '/buyer/order';
                  break;
                case 'Supplier':
                  path = '/supplier/order';
                  break;
                default:
                  break;
              }
              Router.push(path);
            }}
          >
            <LeftOutlined /> Back to Order list
          </Button>
        </Row>
        <Row align="middle" justify="center">
          <Col sm={20} md={18}>
            <Form
              form={form}
              {...formItemLayout}
              className="register-form"
              initialValues={PRODUCT_DETAIL}
            >
              <Row justify="center">
                <Title style={styles.titleStyle} level={2}>
                  Order Details
                </Title>
              </Row>
              {currentUser.role === 'Aggregator' ||
              currentUser.role === 'Buyer' ? (
                <SupplierDetail />
              ) : (
                ''
              )}
              <Card
                bordered={false}
                title={<b>Invoice Item</b>}
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
                          ? displayCurrency(price * totalQuantity)
                          : displayCurrency(257400000)}
                      </p>
                    </div>
                  )}
                />
              </Card>
              {currentUser.role === 'Aggregator' ||
              currentUser.role === 'Supplier' ? (
                <RequestList role={currentUser.role} />
              ) : (
                ''
              )}
            </Form>
          </Col>
        </Row>
      </Col>
    </div>
  );
};
export default connectToRedux(OrderDetailsComponent);
