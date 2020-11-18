import React from 'react';
import BuyerLayout from '../../../layouts/BuyerLayout';
import UserFeedbackManagamentComponent from '../../../component/UserFeedbackManagementComponent';
import withAuth from '../../../component/HOC/AuthenHOC';

function Page() {
  return (
    <BuyerLayout>
      <UserFeedbackManagamentComponent />
    </BuyerLayout>
  );
}

export default withAuth(Page);
