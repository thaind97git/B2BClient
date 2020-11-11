import React from 'react';
import withAuth from '../../../component/HOC/AuthenHOC';
import BuyerOrderManagementComponent from '../../../component/BuyerOrderManagementComponent';
import BuyerLayout from '../../../layouts/BuyerLayout';
const Page = () => {
  return (
    <BuyerLayout>
      <BuyerOrderManagementComponent />
    </BuyerLayout>
  );
};
export default withAuth(Page);
