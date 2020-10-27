import React from "react";
import withAuth from "../../../component/HOC/AuthenHOC";
import SupplierProductListingComponent from "../../../component/SupplierProductListingComponent";
import SupplierLayout from "../../../layouts/SupplierLayout";
const Page = () => {
  return (
    <SupplierLayout>
      <SupplierProductListingComponent />
    </SupplierLayout>
  );
};
export default withAuth(Page);
