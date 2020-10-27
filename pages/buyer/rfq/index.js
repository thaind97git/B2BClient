import React from "react";
import BuyerRequestManagementComponent from "../../../component/BuyerRequestManagementComponent";
import withAuth from "../../../component/HOC/AuthenHOC";
import BuyerLayout from "../../../layouts/BuyerLayout";

const Page = () => {
  return (
    <BuyerLayout>
      <BuyerRequestManagementComponent />
    </BuyerLayout>
  );
};
export default withAuth(Page);
