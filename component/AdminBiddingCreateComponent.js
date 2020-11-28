import { Row, Typography } from 'antd';
import React, { useState } from 'react';
import TabsLayout from '../layouts/TabsLayout';
import BiddingSettingComponent from './BiddingSettingComponent';
import BiddingSupplierInvitationComponent from './BiddingSupplierInvitationComponent';
const { Title } = Typography;

const AdminBiddingCreateComponent = () => {
  const [defaultTab, setDefaultTab] = useState('1');
  const [isDoneSetting, setIsDoneSetting] = useState(false);
  const CREATE_BIDDING = [
    {
      title: 'Settings',
      key: '1',
      content: (
        <BiddingSettingComponent
          setDefaultTab={setDefaultTab}
          setIsDoneSetting={setIsDoneSetting}
        />
      )
    },
    {
      title: 'Suppliers Invitation',
      key: '2',
      content: <BiddingSupplierInvitationComponent />,
      disabled: isDoneSetting ? false : true
    }
  ];

  return (
    <div>
      <Row>
        <Title level={4}>New Event</Title>
      </Row>
      <div>
        <TabsLayout
          tabs={CREATE_BIDDING}
          defaultTab={defaultTab}
          setDefaultTab={setDefaultTab}
        />
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
