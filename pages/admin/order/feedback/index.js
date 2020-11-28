import React from 'react';
import withAuth from '../../../../component/HOC/AuthenHOC';
import OrderFeedbackDetailsListComponent from '../../../../component/OrderFeedbackDetailsListComponent';
import AdminLayout from '../../../../layouts/AdminLayout';
const Page = () => {
  return (
    <AdminLayout hasBackground={false}>
      <OrderFeedbackDetailsListComponent />
    </AdminLayout>
  );
};
export default withAuth(Page);
