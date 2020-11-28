import React from 'react';
import OrderDetailsComponent from '../../../component/OrderDetailsComponent';
import withAuth from '../../../component/HOC/AuthenHOC';
import { ADMIN } from '../../../enums/accountRoles';
import AdminLayout from '../../../layouts/AdminLayout';
const DetailsPage = () => {
  return (
    <AdminLayout hasBackground={false}>
      <OrderDetailsComponent role={ADMIN} />
    </AdminLayout>
  );
};
export default withAuth(DetailsPage);
