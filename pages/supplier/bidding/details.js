import React from "react";
import withAuth from "../../../component/HOC/AuthenHOC";
import SupplierBiddingDetailsComponent from "../../../component/SupplierBiddingDetailsComponent";
import SupplierLayout from "../../../layouts/SupplierLayout";
const BiddingDetailsPage = () => {
  return (
    <SupplierLayout>
      <SupplierBiddingDetailsComponent />
    </SupplierLayout>
  );
};
export default withAuth(BiddingDetailsPage);
