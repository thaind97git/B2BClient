import { Button, Row, Typography } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import Router from 'next/router';
import React, { useState } from 'react';
import TabsLayout from '../layouts/TabsLayout';
import BiddingSettingComponent from './BiddingSettingComponent';
import ListingSupplierByProductComponent from './ListingSupplierByProductComponent';
import BiddingSupplierInvitationComponent from './BiddingSupplierInvitationComponent';
const { Title } = Typography;
const plainOptions = [
  { id: 1, label: 'Supplier 1 (supplier1@gmail.com)' },
  { id: 2, label: 'Supplier 2 (supplier2@gmail.com)' },
  { id: 3, label: 'Supplier 3 (supplier3@gmail.com)' },
  { id: 4, label: 'Supplier 4 (supplier4@gmail.com)' },
  { id: 5, label: 'Supplier 5 (supplier5@gmail.com)' }
];

const AdminBiddingCreateComponent = () => {
  const [defaultTab, setDefaultTab] = useState('1');
  const [visible, setVisible] = useState(false);
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
      <Modal
        width={1000}
        title="Invite Supplier"
        visible={visible}
        onOk={() => {
          Router.push('/aggregator/bidding');
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      >
        <ListingSupplierByProductComponent />
      </Modal>
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
