import Router from 'next/router';
import React, { useEffect } from 'react';
import withAuth from '../../component/HOC/AuthenHOC';
import SupplierDashboardComponent from '../../component/SupplierDashboardComponent';
import SupplierLayout from '../../layouts/SupplierLayout';
const DashboardPage = () => {
  // useEffect(() => {
  //   Router.push("/supplier/chat");
  // }, []);
  return (
    <SupplierLayout hasBackground={false}>
      <SupplierDashboardComponent />
    </SupplierLayout>
  );
};
export default withAuth(DashboardPage);
