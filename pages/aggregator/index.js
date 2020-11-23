import Router from 'next/router';
import React, { useEffect } from 'react';
import AggregatorLayout from '../../layouts/AggregatorLayout';
import withAuth from '../../component/HOC/AuthenHOC';
import AggregatorDashBoardComponent from '../../component/AggregatorDashboardComponent';
const DashboardPage = () => {
  // useEffect(() => {
  //   Router.push("/aggregator/request");
  // }, []);
  return (
    <AggregatorLayout hasBackground={false}>
      <AggregatorDashBoardComponent />
    </AggregatorLayout>
  );
};
export default withAuth(DashboardPage);
