import React, { useState } from 'react';
import AdminRequestProcessedComponent from '../../../component/AdminRequestProcessedComponent';
import AdminRequestProcessingComponent from '../../../component/AdminRequestProcessingComponent';
import AdminRequestPendingComponent from '../../../component/AdminRequestPendingComponent';
import AdminRequestGroupManagement from '../../../component/AdminRequestPendingGroupComponent';
import AggregatorLayout from '../../../layouts/AggregatorLayout';
import TabsLayout from '../../../layouts/TabsLayout';
import withAuth from '../../../component/HOC/AuthenHOC';
import { Radio, Row } from 'antd';
const options = [
  { label: 'View RFQ Group By Product', value: true },
  { label: 'View Manual RFQ', value: false }
];
const Page = () => {
  const [defaultTab, setDefaultTab] = useState('1');
  const [groupBy, setGroupBy] = useState(true);

  const REQUEST_TABS = [
    {
      title: 'Pending Request',
      key: '1',
      content: (
        <div>
          <Row justify="center">
            <Radio.Group
              options={options}
              onChange={(e) => setGroupBy(e.target.value)}
              value={groupBy}
              optionType="button"
              buttonStyle="solid"
            />
          </Row>
          {groupBy ? (
            <AdminRequestGroupManagement setDefaultTab={setDefaultTab} />
          ) : (
            <AdminRequestPendingComponent setDefaultTab={setDefaultTab} />
          )}
        </div>
      )
    },
    {
      title: 'Processing Request',
      key: '2',
      content: (
        <div>
          <AdminRequestProcessingComponent />
        </div>
      )
    },
    {
      title: 'Processed Request',
      key: '3',
      content: (
        <div>
          <AdminRequestProcessedComponent />
        </div>
      )
    }
  ];
  return (
    <AggregatorLayout>
      <TabsLayout
        tabs={REQUEST_TABS}
        defaultTab={defaultTab}
        setDefaultTab={setDefaultTab}
      />
    </AggregatorLayout>
  );
};
export default withAuth(Page);
