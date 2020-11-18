import React from 'react';
import FeedbackCreateComponent from '../../../component/FeedbackCreateComponent';
import withAuth from '../../../component/HOC/AuthenHOC';
import BuyerLayout from '../../../layouts/BuyerLayout';
const Page = () => {
  return (
    <BuyerLayout>
      <FeedbackCreateComponent />
    </BuyerLayout>
  );
};
export default withAuth(Page);
