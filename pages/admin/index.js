import Router from 'next/router';
import { useEffect } from 'react';
import AdminDashboardComponent from '../../component/AdminDashboardComponent';
import withAuth from '../../component/HOC/AuthenHOC';
import AdminLayout from '../../layouts/AdminLayout';
const Page = () => {
  // useEffect(() => {
  //   Router.push("/admin/product");
  // }, []);
  return (
    <AdminLayout hasBackground={false}>
      <div id="container">
        <AdminDashboardComponent />
      </div>
    </AdminLayout>
  );
};
export default withAuth(Page);
