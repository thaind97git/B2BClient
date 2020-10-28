import React from "react";
import AdminBiddingCreateComponent from "../../../component/AdminBiddingCreateComponent";
import withAuth from "../../../component/HOC/AuthenHOC";
import AggregatorLayout from "../../../layouts/AggregatorLayout";
const Page = () => {
  return (
    <AggregatorLayout>
      <AdminBiddingCreateComponent />
    </AggregatorLayout>
  );
};
export default withAuth(Page);
