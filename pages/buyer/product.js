import Router from "next/router";
import React from "react";
import ProductListHomePageComponent from "../../component/ProductListHomePageComponent";
import BuyerLayout from "../../layouts/BuyerLayout";
const Page = () => {
  return (
    <BuyerLayout>
      <ProductListHomePageComponent />
    </BuyerLayout>
  );
};
export default Page;
