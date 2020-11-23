import Router from 'next/router';
import { useEffect } from 'react';
import AdminDashboardComponent from '../../component/AdminDashboardComponent';
import AdminLayout from '../../layouts/AdminLayout';
const Page = () => {
  // useEffect(() => {
  //   Router.push("/admin/product");
  // }, []);
  return (
    <AdminLayout>
      <div id="container">
        <AdminDashboardComponent />
      </div>
    </AdminLayout>
  );
};
export default Page;
