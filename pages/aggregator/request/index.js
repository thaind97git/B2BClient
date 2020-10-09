import React, { useState } from "react";
import AdminRequestCanceledComponent from "../../../component/AdminRequestCanceledComponent";
import AdminRequestGroupedComponent from "../../../component/AdminRequestGroupedComponent";
import AdminRequestManagementComponent from "../../../component/AdminRequestManagementComponent";
import AggregatorLayout from "../../../layouts/AggregatorLayout";
import TabsLayout from "../../../layouts/TabsLayout";

const Page = () => {
  const [defaultTab, setDefaultTab] = useState("1");

  const REQUEST_TABS = [
    {
      title: "Pending Request",
      key: "1",
      content: (
        <div>
          <AdminRequestManagementComponent />
        </div>
      ),
    },
    {
      title: "Processing Request",
      key: "2",
      content: (
        <div>
          <AdminRequestGroupedComponent />
        </div>
      ),
    },
    {
      title: "Processed Request",
      key: "3",
      content: (
        <div>
          <AdminRequestCanceledComponent />
        </div>
      ),
    },
  ];
  return (
    <AggregatorLayout>
      <TabsLayout
        tabs={REQUEST_TABS}
        defaultTab={defaultTab}
        setDefaultTab={setDefaultTab}
      />
    </AggregatorLayout>
  );
};
export default Page;
