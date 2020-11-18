import React from 'react';
import BuyerLayout from '../../../layouts/BuyerLayout';
import FeedbackDetailComponent from '../../../component/FeedbackDetailComponent';
import withAuth from '../../../component/HOC/AuthenHOC';

function Page() {
  return (
    <BuyerLayout>
      <FeedbackDetailComponent />
    </BuyerLayout>
  );
}
export default withAuth(Page);
