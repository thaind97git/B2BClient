import React from 'react';
import FeedbackCreateComponent from '../../../component/FeedbackCreateComponent';
import withAuth from '../../../component/HOC/AuthenHOC';
import SupplierLayout from '../../../layouts/SupplierLayout';
const Page = () => {
  return (
    <SupplierLayout>
      <FeedbackCreateComponent />
    </SupplierLayout>
  );
};
export default withAuth(Page);
