import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import AggregatorManagementComponent from '../../../component/AggregatorManagementComponent';
import withAuth from '../../../component/HOC/AuthenHOC';

function Page() {
  return (
    <AdminLayout>
      <AggregatorManagementComponent />
    </AdminLayout>
  );
}

export default withAuth(Page);
