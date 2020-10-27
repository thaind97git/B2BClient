import React from "react";
import withAuth from "../../../component/HOC/AuthenHOC";
import SupplierProductComponent from "../../../component/SupplierProductComponent";
import SupplierLayout from "../../../layouts/SupplierLayout";
const Page = () => {
  return (
    <SupplierLayout>
      <SupplierProductComponent />
    </SupplierLayout>
  );
};
export default withAuth(Page);
