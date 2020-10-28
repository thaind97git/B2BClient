import React from "react";
import AdminBiddingManagementComponent from "../../../component/AdminBiddingManagementComponent";
import withAuth from "../../../component/HOC/AuthenHOC";
import AggregatorLayout from "../../../layouts/AggregatorLayout";
const Page = () => {
  return (
    <AggregatorLayout>
      <AdminBiddingManagementComponent />
    </AggregatorLayout>
  );
};
export default withAuth(Page);
