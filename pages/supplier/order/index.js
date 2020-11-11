import React from 'react';
import withAuth from '../../../component/HOC/AuthenHOC';
import SupplierOrderManagementComponent from '../../../component/SupplierOrderManagementComponent';
import SupplierLayout from '../../../layouts/SupplierLayout';
const Page = () => {
  return (
    <SupplierLayout>
      <SupplierOrderManagementComponent />
    </SupplierLayout>
  );
};
export default withAuth(Page);
