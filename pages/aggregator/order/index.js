import React from 'react';
import withAuth from '../../../component/HOC/AuthenHOC';
import AggregatorOrderManagementComponent from '../../../component/AggregatorOrderManagementComponent';
import AggregatorLayout from '../../../layouts/AggregatorLayout';
const Page = () => {
  return (
    <AggregatorLayout>
      <AggregatorOrderManagementComponent />
    </AggregatorLayout>
  );
};
export default withAuth(Page);
