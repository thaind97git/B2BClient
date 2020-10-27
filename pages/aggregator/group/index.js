import React from "react";
import AggregatorLayout from "../../../layouts/AggregatorLayout";
import GroupRequestComponent from "../../../component/GroupRequestComponent";
import withAuth from "../../../component/HOC/AuthenHOC";

function Group() {
  return (
    <AggregatorLayout>
      <GroupRequestComponent />
    </AggregatorLayout>
  );
}

export default withAuth(Group);
