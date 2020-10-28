import Router from "next/router";
import React, { useEffect } from "react";
import AggregatorLayout from "../../layouts/AggregatorLayout";
import withAuth from "../../component/HOC/AuthenHOC";
const DashboardPage = () => {
  useEffect(() => {
    Router.push("/aggregator/request");
  }, []);
  return null; // <AggregatorLayout>Dashboard admin</AggregatorLayout>;
};
export default withAuth(DashboardPage);
