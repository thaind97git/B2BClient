import React from 'react';
import BuyerRequestUpdateComponent from '../../../component/BuyerRequestUpdateComponent';
import withAuth from '../../../component/HOC/AuthenHOC';
import BuyerLayout from '../../../layouts/BuyerLayout';

const Page = () => {
  return (
    <BuyerLayout hasBackground={false}>
      <BuyerRequestUpdateComponent />
    </BuyerLayout>
  );
};
export default withAuth(Page);
