import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import AdminAggregatorCreateComponent from '../../../component/AdminAggregatorCreateComponent';
import withAuth from '../../../component/HOC/AuthenHOC';

function Page() {
  return (
    <AdminLayout hasBackground={false}>
      <AdminAggregatorCreateComponent />
    </AdminLayout>
  );
}

export default withAuth(Page);
