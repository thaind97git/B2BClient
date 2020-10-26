import { useRouter } from "next/router";
import React from "react";
import ConfirmationOrderComponent from "../../../component/ConfirmationOrderComponent";
import AggregatorLayout from "../../../layouts/AggregatorLayout";
const Page = () => {
  const isNegotiating = useRouter().query.isNegotiating || false;
  return (
    <AggregatorLayout>
      <ConfirmationOrderComponent isNegotiating={isNegotiating} />
    </AggregatorLayout>
  );
};
export default Page;
