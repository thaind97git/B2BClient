import React from "react";
import BuyerRequestCreateComponent from "../../../component/BuyerRequestCreateComponent";
import BuyerLayout from "../../../layouts/BuyerLayout";

const Page = () => {
  return (
    <BuyerLayout>
      <BuyerRequestCreateComponent isUpdate={true} />
    </BuyerLayout>
  );
};
export default Page;
