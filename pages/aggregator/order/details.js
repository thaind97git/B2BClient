import React from 'react';
import OrderDetailsComponent from '../../../component/OrderDetailsComponent';
import withAuth from '../../../component/HOC/AuthenHOC';
import AggregatorLayout from '../../../layouts/AggregatorLayout';
import { MODERATOR } from '../../../enums/accountRoles';
const DetailsPage = () => {
  return (
    <AggregatorLayout hasBackground={false}>
      <OrderDetailsComponent role={MODERATOR} />
    </AggregatorLayout>
  );
};
export default withAuth(DetailsPage);
