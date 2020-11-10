import React from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import AdminFeedbackManagamentComponent from "../../../component/AdminFeedbackManagamentComponent";
import withAuth from "../../../component/HOC/AuthenHOC";

function Page() {
  return (
    <AdminLayout>
      <AdminFeedbackManagamentComponent />
    </AdminLayout>
  );
}

export default withAuth(Page);
