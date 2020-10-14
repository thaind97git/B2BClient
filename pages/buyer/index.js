import Router from "next/router";
import React, { useEffect } from "react";
import BuyerLayout from "../../layouts/BuyerLayout";
const Page = () => {
  useEffect(() => {
    Router.push("/buyer/rfq");
  }, []);
  return null; // <BuyerLayout>Buyer dashboard</BuyerLayout>;
};
export default Page;
