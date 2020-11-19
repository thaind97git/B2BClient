import React from 'react';
import SupplierLayout from '../../../layouts/SupplierLayout';
import FeedbackDetailComponent from '../../../component/FeedbackDetailComponent';
import withAuth from '../../../component/HOC/AuthenHOC';

function Page() {
  return (
    <SupplierLayout>
      <FeedbackDetailComponent />
    </SupplierLayout>
  );
}
export default withAuth(Page);
