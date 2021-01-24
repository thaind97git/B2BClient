import React from 'react';
import AggregatorLayout from '../../../layouts/AggregatorLayout';
import GroupRequestComponent from '../../../component/GroupRequestComponent';
import withAuth from '../../../component/HOC/AuthenHOC';
import { useState } from 'react';
import TabsLayout from '../../../layouts/TabsLayout';
import GroupRequestNotHavingSupplierComponent from '../../../component/GroupRequestNotHavingSupplierComponent';
import GroupRequestHavingSupplierComponent from '../../../component/GroupRequestHavingSupplierComponent';

function Group() {
  const [defaultTab, setDefaultTab] = useState('1');

  const GROUP_TABS = [
    {
      title: 'Processing group',
      key: '1',
      content: (
        <div>
          <GroupRequestComponent />
        </div>
      )
    },
    {
      title: 'Qualified Group',
      key: '2',
      content: (
        <div>
          <GroupRequestHavingSupplierComponent />
        </div>
      )
    },
    {
      title: 'Unqualified Group',
      key: '3',
      content: (
        <div>
          <GroupRequestNotHavingSupplierComponent />
        </div>
      )
    }
  ];
  return (
    <AggregatorLayout>
      <TabsLayout
        tabs={GROUP_TABS}
        defaultTab={defaultTab}
        setDefaultTab={setDefaultTab}
      />
    </AggregatorLayout>
  );
}

export default withAuth(Group);
