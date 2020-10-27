import React from "react";
import BuyerRequestCreateComponent from "../../../component/BuyerRequestCreateComponent";
import withAuth from "../../../component/HOC/AuthenHOC";
import BuyerLayout from "../../../layouts/BuyerLayout";

const Page = () => {
  return (
    <BuyerLayout>
      <BuyerRequestCreateComponent />
    </BuyerLayout>
  );
};
export default withAuth(Page);
