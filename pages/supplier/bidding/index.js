import React from "react";
import withAuth from "../../../component/HOC/AuthenHOC";
import SupplierBiddingComponent from "../../../component/SupplierBiddingComponent";
import SupplierLayout from "../../../layouts/SupplierLayout";
const Page = () => {
  return (
    <SupplierLayout>
      <SupplierBiddingComponent />
    </SupplierLayout>
  );
};
export default withAuth(Page);
