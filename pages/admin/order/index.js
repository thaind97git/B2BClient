import React from 'react';
import withAuth from '../../../component/HOC/AuthenHOC';
import AdminOrderManagementComponent from '../../../component/AdminOrderManagementComponent';
import AdminLayout from '../../../layouts/AdminLayout';
const Page = () => {
  return (
    <AdminLayout>
      <AdminOrderManagementComponent />
    </AdminLayout>
  );
};
export default withAuth(Page);
