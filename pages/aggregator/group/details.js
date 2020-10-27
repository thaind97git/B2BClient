import React from "react";
import GroupRequestDetailsComponent from "../../../component/GroupRequestDetailsComponent";
import withAuth from "../../../component/HOC/AuthenHOC";
import AggregatorLayout from "../../../layouts/AggregatorLayout";
const DetailsPage = () => {
  return (
    <AggregatorLayout>
      <GroupRequestDetailsComponent />
    </AggregatorLayout>
  );
};
export default withAuth(DetailsPage);
