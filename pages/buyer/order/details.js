import React from 'react';
import OrderDetailsComponent from '../../../component/OrderDetailsComponent';
import withAuth from '../../../component/HOC/AuthenHOC';
import BuyerLayout from '../../../layouts/BuyerLayout';
import { BUYER } from '../../../enums/accountRoles';
const DetailsPage = () => {
  return (
    <BuyerLayout hasBackground={false}>
      <OrderDetailsComponent role={BUYER} />
    </BuyerLayout>
  );
};
export default withAuth(DetailsPage);
