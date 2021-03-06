import { Card, Row, Typography } from 'antd';
import React, { useState } from 'react';
import AdminConfigSettingComponent from '../../component/AdminConfigSettingComponent';
import AdminConfigSettingGroupComponent from '../../component/AdminConfigSettingGroupComponent';
import withAuth from '../../component/HOC/AuthenHOC';
import AdminLayout from '../../layouts/AdminLayout';
import TabsLayout from '../../layouts/TabsLayout';
const { Title } = Typography;
const Page = () => {
  const [defaultTab, setDefaultTab] = useState('1');
  const GROUP_TABS = [
    {
      title: 'Group',
      key: '1',
      content: (
        <div>
          <AdminConfigSettingGroupComponent />
        </div>
      )
    },
    {
      title: 'Request for quotation',
      key: '2',
      content: (
        <div>
          <AdminConfigSettingComponent />
        </div>
      )
    }
  ];
  return (
    <AdminLayout hasBackground={false}>
      <div id="container">
        <Card
          title={
            <Row justify="space-between" align="middle">
              <Title level={4}>Configurations</Title>
            </Row>
          }
          style={{ width: '98%' }}
          bordered={false}
        >
          <TabsLayout
            tabs={GROUP_TABS}
            defaultTab={defaultTab}
            setDefaultTab={setDefaultTab}
          />
        </Card>
      </div>
    </AdminLayout>
  );
};
export default withAuth(Page);
