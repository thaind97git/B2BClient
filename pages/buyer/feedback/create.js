import React from 'react';
import FeedbackCreateComponent from '../../../component/FeedbackCreateComponent';
import FeedbackSubmitComponent from '../../../component/FeedbackSubmitComponent';
import withAuth from '../../../component/HOC/AuthenHOC';
import BuyerLayout from '../../../layouts/BuyerLayout';
const Page = () => {
  return (
    <BuyerLayout hasBackground={false}>
      <FeedbackSubmitComponent span={22} />
      {/* <FeedbackCreateComponent /> */}
    </BuyerLayout>
  );
};
export default withAuth(Page);
