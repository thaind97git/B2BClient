import React from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import AdminProductManagementComponent from "../../../component/AdminProductManagementComponent.js";
import withAuth from "../../../component/HOC/AuthenHOC";

function Page() {
  return (
    <AdminLayout>
      <AdminProductManagementComponent />
    </AdminLayout>
  );
}

export default withAuth(Page);
