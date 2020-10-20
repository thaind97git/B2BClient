import React, { useState } from "react";
import AdminRequestProcessedComponent from "../../../component/AdminRequestProcessedComponent";
import AdminRequestProcessingComponent from "../../../component/AdminRequestProcessingComponent";
import AdminRequestPendingComponent from "../../../component/AdminRequestPendingComponent";
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
          <AdminRequestPendingComponent />
        </div>
      ),
    },
    {
      title: "Processing Request",
      key: "2",
      content: (
        <div>
          <AdminRequestProcessingComponent />
        </div>
      ),
    },
    {
      title: "Processed Request",
      key: "3",
      content: (
        <div>
          <AdminRequestProcessedComponent />
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
