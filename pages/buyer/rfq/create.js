import React from "react";
import BuyerRequestCreateComponent from "../../../component/BuyerRequestCreateComponent";
import BuyerLayout from "../../../layouts/BuyerLayout";

const Page = () => {
  return (
    <BuyerLayout isVertical={false}>
      <BuyerRequestCreateComponent />
    </BuyerLayout>
  );
};
export default Page;
