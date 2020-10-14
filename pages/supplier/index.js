import Router from "next/router";
import React, { useEffect } from "react";
import SupplierLayout from "../../layouts/SupplierLayout";
const DashboardPage = () => {
  useEffect(() => {
    Router.push("/supplier/chat");
  }, []);
  return null; //<SupplierLayout>Dashboard member</SupplierLayout>;
};
export default DashboardPage;
