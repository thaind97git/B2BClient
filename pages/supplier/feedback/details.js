import React from 'react';
import SupplierLayout from '../../../layouts/SupplierLayout';
import UserFeedbackDetailComponent from '../../../component/UserFeedbackDetailComponent';
import withAuth from '../../../component/HOC/AuthenHOC';

function Page() {
  return (
    <SupplierLayout hasBackground={false}>
      <UserFeedbackDetailComponent />
    </SupplierLayout>
  );
}
export default withAuth(Page);
