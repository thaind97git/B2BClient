import { Card, Col, Row, Typography } from 'antd';
import React, { useState } from 'react';
let G2Plot;
if (process.browser) {
  G2Plot = require('@ant-design/charts');
}
const { Title } = Typography;
const data = [
  { type: 'Pending', value: 27 },
  { type: 'Closed', value: 25 }
];

const AdminDashBoardComponent = () => {
  const configRequest = {
    width: 380,
    autoFit: false,
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0,
    meta: {
      value: {
        formatter: (v) => `${v} feedback`
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
    <Card
      title={<Title level={4}>Feedback Statistic</Title>}
      style={{ width: '100%' }}
      bordered={false}
    >
      <Row>
        <Col span={24}>
          <Row justify="space-around">
            <Col span={11}>
              <Card className="" title="Supplier" style={{ width: '100%' }}>
                {G2Plot && <G2Plot.Pie {...configRequest} />}
              </Card>
            </Col>
            <Col span={11}>
              <Card className="" title="Buyer" style={{ width: '100%' }}>
                {G2Plot && <G2Plot.Pie {...configRequest} />}
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default AdminDashBoardComponent;
