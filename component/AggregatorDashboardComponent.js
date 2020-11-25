import { Card, Col, DatePicker, Row, Typography } from 'antd';
import React from 'react';
let G2Plot;
if (process.browser) {
  G2Plot = require('@ant-design/charts');
}
const { Title } = Typography;
const dataGroup = [
  { type: 'Pending', value: 10 },
  { type: 'Negotiating', value: 10 },
  { type: 'Done', value: 20 },
  { type: 'Failed', value: 10 },
  { type: 'Bidding', value: 10 },
  { type: 'Wait For Auction', value: 10 },
  { type: 'Ordered', value: 10 }
];

const dataAuction = [
  { type: 'Waiting', value: 30 },
  { type: 'Closed', value: 30 },
  { type: 'Failed', value: 50 },
  { type: 'Activating', value: 50 },
  { type: 'Done', value: 40 },
  { type: 'Canceled', value: 50 }
];

const AggregatorDashBoardComponent = () => {
  const configRequest = {
    width: 380,
    autoFit: false,
    appendPadding: 10,
    data: dataGroup,
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
  const configAuction = {
    width: 380,
    autoFit: false,
    appendPadding: 10,
    data: dataAuction,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0,
    meta: {
      value: {
        formatter: (v) => `${v} Auctions`
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
              <Title level={4}>Group Statistic</Title>
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
              <Title level={4}>Reverse Auction Statistic</Title>
              <DatePicker picker="month" />
            </Row>
          }
          style={{ width: '98%' }}
          bordered={false}
        >
          <Row justify="center">
            {G2Plot && <G2Plot.Pie {...configAuction} />}
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default AggregatorDashBoardComponent;
