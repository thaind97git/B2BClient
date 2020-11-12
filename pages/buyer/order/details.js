import React from 'react';
import OrderDetailsComponent from '../../../component/OrderDetailsComponent';
import withAuth from '../../../component/HOC/AuthenHOC';
import BuyerLayout from '../../../layouts/BuyerLayout';
const DetailsPage = () => {
  return (
    <BuyerLayout>
      <OrderDetailsComponent />
    </BuyerLayout>
  );
};
export default withAuth(DetailsPage);
