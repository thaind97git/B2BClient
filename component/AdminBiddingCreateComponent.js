import { Row, Typography } from 'antd';
import React, { useState } from 'react';
import BiddingSettingComponent from './BiddingSettingComponent';
const { Title } = Typography;

const AdminBiddingCreateComponent = () => {
  return (
    <div>
      <Row>
        <Title level={4}>New Event</Title>
      </Row>
      <div>
        <BiddingSettingComponent />
      </div>
      <style jsx global>
        {`
          .ant-checkbox-group-item {
            display: block;
            margin-right: 0;
          }
        `}
      </style>
    </div>
  );
};

export default AdminBiddingCreateComponent;
