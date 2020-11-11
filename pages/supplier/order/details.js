import React from 'react';
import OrderDetailsComponent from '../../../component/OrderDetailsComponent';
import withAuth from '../../../component/HOC/AuthenHOC';
import SupplierLayout from '../../../layouts/SupplierLayout';
const DetailsPage = () => {
  return (
    <SupplierLayout>
      <OrderDetailsComponent />
    </SupplierLayout>
  );
};
export default withAuth(DetailsPage);
