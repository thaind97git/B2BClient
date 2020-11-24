import React from 'react';
import OrderDetailsComponent from '../../../component/OrderDetailsComponent';
import withAuth from '../../../component/HOC/AuthenHOC';
import AggregatorLayout from '../../../layouts/AggregatorLayout';
const DetailsPage = () => {
  return (
    <AggregatorLayout hasBackground={false}>
      <OrderDetailsComponent />
    </AggregatorLayout>
  );
};
export default withAuth(DetailsPage);
