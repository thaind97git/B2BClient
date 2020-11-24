import { Card, Col, DatePicker, Row, Typography } from 'antd';
import React, { useState } from 'react';
import LeaderboardProductSupplierComponent from './LeaderboardProductSupplierComponent';

const { Title } = Typography;

const SupplierDashboardComponent = () => {
  return (
    <Row justify="space-around">
      <Col span={24}>
        <Card
          title={<Title level={4}>LeaderBoard Top 10 Product</Title>}
          style={{ width: '98%' }}
          bordered={false}
        >
          <LeaderboardProductSupplierComponent />
        </Card>
      </Col>
    </Row>
  );
};

export default SupplierDashboardComponent;
