import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import FeedbackDetailComponent from '../../../component/FeedbackDetailComponent';
import withAuth from '../../../component/HOC/AuthenHOC';

function Page() {
  return (
    <AdminLayout>
      <FeedbackDetailComponent />
    </AdminLayout>
  );
}
export default withAuth(Page);
