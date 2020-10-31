import React from "react";
import AdminProductUpdateComponent from "../../../component/AdminProductUpdateComponent";
import withAuth from "../../../component/HOC/AuthenHOC";
import AdminLayout from "../../../layouts/AdminLayout";

const Page = () => {
  return (
    <AdminLayout>
      <AdminProductUpdateComponent />
    </AdminLayout>
  );
};
export default withAuth(Page);
