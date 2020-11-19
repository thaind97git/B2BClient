import React from 'react';
import SupplierLayout from '../../../layouts/SupplierLayout';
import UserFeedbackManagamentComponent from '../../../component/UserFeedbackManagementComponent';
import withAuth from '../../../component/HOC/AuthenHOC';

function Page() {
  return (
    <SupplierLayout>
      <UserFeedbackManagamentComponent />
    </SupplierLayout>
  );
}

export default withAuth(Page);
