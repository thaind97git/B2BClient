import React from 'react';
import OrderDetailsComponent from '../../../component/OrderDetailsComponent';
import withAuth from '../../../component/HOC/AuthenHOC';
import SupplierLayout from '../../../layouts/SupplierLayout';
import { SUPPLIER } from '../../../enums/accountRoles';
const DetailsPage = () => {
  return (
    <SupplierLayout hasBackground={false}>
      <OrderDetailsComponent role={SUPPLIER} />
    </SupplierLayout>
  );
};
export default withAuth(DetailsPage);
