import React from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import SupplierManagementComponent from "../../../component/SupplierManagementComponent.js";
import withAuth from "../../../component/HOC/AuthenHOC";

function Page() {
  return (
    <AdminLayout>
      <SupplierManagementComponent />
    </AdminLayout>
  );
}

export default withAuth(Page);
