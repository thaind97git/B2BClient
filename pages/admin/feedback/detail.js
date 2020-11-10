import React from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import AdminFeedbackDetailComponent from "../../../component/AdminFeedbackDetailComponent";
import withAuth from "../../../component/HOC/AuthenHOC";

function Page() {
  return (
    <AdminLayout>
      <AdminFeedbackDetailComponent/>
    </AdminLayout>
  );
}
export default withAuth(Page);
