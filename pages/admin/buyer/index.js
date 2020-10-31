import React from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import BuyerManagementComponent from "../../../component/BuyerManagementComponent.js";
import withAuth from "../../../component/HOC/AuthenHOC";

function Page() {
  return (
    <AdminLayout>
      <BuyerManagementComponent />
    </AdminLayout>
  );
}

export default withAuth(Page);
