import React from "react";
import AdminProductCreateComponent from "../../../component/AdminProductCreateComponent";
import withAuth from "../../../component/HOC/AuthenHOC";
import AdminLayout from "../../../layouts/AdminLayout";
const Page = () => {
  return (
    <AdminLayout>
      <AdminProductCreateComponent />
    </AdminLayout>
  );
};
export default withAuth(Page);
