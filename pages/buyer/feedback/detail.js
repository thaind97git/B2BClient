import React from 'react';
import BuyerLayout from '../../../layouts/BuyerLayout';
import UserFeedbackDetailComponent from '../../../component/UserFeedbackDetailComponent';
import withAuth from '../../../component/HOC/AuthenHOC';

function Page() {
  return (
    <BuyerLayout>
      <UserFeedbackDetailComponent />
    </BuyerLayout>
  );
}
export default withAuth(Page);
