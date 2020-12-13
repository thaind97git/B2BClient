import { Card, Col, DatePicker, Row, Typography } from 'antd';
import React, { useState } from 'react';
import LeaderboardProductSupplierComponent from './LeaderboardProductSupplierComponent';

const { Title } = Typography;

const SupplierDashboardComponent = () => {
  return (
    <Row justify="space-around">
      <Col span={24}>
        <Card
          title={
            <Row justify="space-between" align="middle">
              <Title level={4}>Leaderboard Product</Title>
            </Row>
          }
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
