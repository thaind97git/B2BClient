import Router from "next/router";
import React, { useEffect } from "react";
import AggregatorLayout from "../../layouts/AggregatorLayout";
const DashboardPage = () => {
  useEffect(() => {
    Router.push("/aggregator/request");
  }, []);
  return null; // <AggregatorLayout>Dashboard admin</AggregatorLayout>;
};
export default DashboardPage;
