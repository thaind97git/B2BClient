import {
  Card,
  Col,
  DatePicker,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Typography
} from 'antd';
import React, { useState } from 'react';
import LeaderboardBuyerComponent from './LeaderboardBuyerComponent';
import LeaderboardProductComponent from './LeaderboardProductComponent';
import LeaderboardSupplierComponent from './LeaderboardSupplierComponent';
let G2Plot;
if (process.browser) {
  G2Plot = require('@ant-design/charts');
}
const { Title } = Typography;
const { TabPane } = Tabs;
const dataRFQ = [
  { type: 'Pending', value: 10 },
  { type: 'Negotiating', value: 10 },
  { type: 'Canceled', value: 10 },
  { type: 'Rejected', value: 10 },
  { type: 'Grouped', value: 10 },
  { type: 'Wait For Auction', value: 10 },
  { type: 'Bidding', value: 10 },
  { type: 'Ordered', value: 10 },
  { type: 'Done', value: 20 }
];

const dataOrder = [
  { type: 'Fail', value: 50 },
  { type: 'Done', value: 50 }
];

const AdminDashBoardComponent = () => {
  const configRequest = {
    width: 380,
    autoFit: false,
    appendPadding: 10,
    data: dataRFQ,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0,
    meta: {
      value: {
        formatter: (v) => `${v} RFQs`
      }
    },
    label: {
      type: 'inner',
      offset: '-50%',
      autoRotate: false,
      style: { textAlign: 'center' },
      formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`
    },
    statistic: {
      title: {
        offsetY: -8
      },
      content: {
        offsetY: -4
      }
    }
  };
  const configOrder = {
    width: 380,
    autoFit: false,
    appendPadding: 10,
    data: dataOrder,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0,
    meta: {
      value: {
        formatter: (v) => `${v} RFQs`
      }
    },
    label: {
      type: 'inner',
      offset: '-50%',
      autoRotate: false,
      style: { textAlign: 'center' },
      formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`
    },
    statistic: {
      title: {
        offsetY: -8
      },
      content: {
        offsetY: -4
      }
    }
  };

  return (
    <Row justify="space-around">
      <Col md={24} lg={12}>
        <Card
          title={
            <Row justify="space-between">
              <Title level={4}>RFQ Statistic</Title>
              <DatePicker picker="month" />
            </Row>
          }
          style={{ width: '98%' }}
          bordered={false}
        >
          <Row justify="center">
            {G2Plot && <G2Plot.Pie {...configRequest} />}
          </Row>
        </Card>
      </Col>
      <Col md={24} lg={12}>
        <Card
          title={
            <Row justify="space-between">
              <Title level={4}>Order Statistic</Title>
              <DatePicker picker="month" />
            </Row>
          }
          style={{ width: '98%', float: 'right' }}
          bordered={false}
        >
          <Row justify="center">
            {G2Plot && <G2Plot.Pie {...configOrder} />}
          </Row>
        </Card>
      </Col>
      <Col span={24} style={{ marginTop: 32 }}>
        <Card
          title={
            <Row justify="space-between">
              <Title level={4}>Leader Board Top 10</Title>
              <DatePicker picker="month" />
            </Row>
          }
          style={{ width: '100%' }}
          bordered={false}
        >
          <div className="card-container">
            <Tabs type="card">
              <TabPane tab="Product" key="1">
                <LeaderboardProductComponent />
              </TabPane>
              <TabPane tab="Supplier" key="2">
                <LeaderboardSupplierComponent />
              </TabPane>
              <TabPane tab="Buyer" key="3">
                <LeaderboardBuyerComponent />
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </Col>
      {/* <Col span={24} style={{ marginTop: 32 }}>
        <Row justify="center">
          <Col span={24}>
            <Card
              title={
                <Row justify="space-between">
                  <Title level={4}>Product Leader Board</Title>
                  <DatePicker picker="month" />
                </Row>
              }
              style={{ width: '100%' }}
              bordered={false}
            >
              <Table columns={columns} dataSource={dataTable} />
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={24} style={{ marginTop: 32 }}>
        <Row justify="center">
          <Col span={24}>
            <Card
              title={
                <Row justify="space-between">
                  <Title level={4}>Supplier Leader Board</Title>
                  <DatePicker picker="month" />
                </Row>
              }
              style={{ width: '100%' }}
              bordered={false}
            >
              <Table columns={columns} dataSource={dataTable} />
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={24} style={{ marginTop: 32 }}>
        <Row justify="center">
          <Col span={24}>
            <Card
              title={
                <Row justify="space-between">
                  <Title level={4}>Buyer Leader Board</Title>
                  <DatePicker picker="month" />
                </Row>
              }
              style={{ width: '100%' }}
              bordered={false}
            >
              <Table columns={columns} dataSource={dataTable} />
            </Card>
          </Col>
        </Row>
      </Col> */}
    </Row>
  );
};

export default AdminDashBoardComponent;
