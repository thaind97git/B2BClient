import React from "react";
import AdminBiddingDetailsComponent from "../../../component/AdminBiddingDetailsComponent";
import withAuth from "../../../component/HOC/AuthenHOC";
import AggregatorLayout from "../../../layouts/AggregatorLayout";
const DetailsPage = () => {
  return (
    <AggregatorLayout>
      <AdminBiddingDetailsComponent />
    </AggregatorLayout>
  );
};
export default withAuth(DetailsPage);
