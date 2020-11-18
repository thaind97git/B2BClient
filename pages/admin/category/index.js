import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import CategoryManagementComponent from '../../../component/CategoryManagementComponent';
import withAuth from '../../../component/HOC/AuthenHOC';

function Page() {
  return (
    <AdminLayout>
      <CategoryManagementComponent />
    </AdminLayout>
  );
}

export default withAuth(Page);
