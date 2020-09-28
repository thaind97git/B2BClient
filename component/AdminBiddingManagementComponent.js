import { Button, Row, Tabs } from "antd";
import Router from "next/router";
import React from "react";
const { TabPane } = Tabs;
function callback(key) {
  console.log(key);
}
const AdminBiddingManagementComponent = () => {
  return (
    <div>
      <Row justify="end">
        <Button
          onClick={() => {
            Router.push("/admin/bidding/create");
          }}
          type="primary"
          danger
        >
          Create New Event
        </Button>
      </Row>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Current Event" key="1">
          Content of Tab Pane 1
        </TabPane>
        {/* <TabPane tab="Invite Participants" key="2">
          Content of Tab Pane 2
        </TabPane> */}
      </Tabs>
    </div>
  );
};

export default AdminBiddingManagementComponent;
