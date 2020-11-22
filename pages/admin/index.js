import Router from 'next/router';
import { useEffect } from 'react';
import AdminDashBoardComponent from '../../component/AdminDashBoardComponent';
import AdminLayout from '../../layouts/AdminLayout';
const Page = () => {
  // useEffect(() => {
  //   Router.push("/admin/product");
  // }, []);
  return (
    <AdminLayout>
      <div id="container">
        <AdminDashBoardComponent />
      </div>
    </AdminLayout>
  );
};
export default Page;
