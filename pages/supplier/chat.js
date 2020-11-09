import React from 'react';
import withAuth from '../../component/HOC/AuthenHOC';
import SupplierChatComponent from '../../component/SupplierChatComponent';
import SupplierLayout from '../../layouts/SupplierLayout';
const Page = () => {
  return (
    <SupplierLayout isChat>
      <SupplierChatComponent />
    </SupplierLayout>
  );
};
export default withAuth(Page);
