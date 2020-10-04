import { Button, Row, Table, Tabs } from "antd";
import Router from "next/router";
import React from "react";
import { B_ACTIVE, B_CLOSED, B_DONE, B_FEATURE } from "../enums/biddingStatus";
import BiddingStatusComponent from "./Utils/BiddingStatusComponent";
const { TabPane } = Tabs;
function callback(key) {
  console.log(key);
}

const dataSource = [
  {
    key: "1",
    name: "Macbook Pro 2015",
    duration: "30 Minutes",
    dateCreated: "January 30, 2020 17:00 GTM",
    createdBy: "John Smith",
    status: <BiddingStatusComponent status={B_FEATURE} />,
    actions: (
      <Button size="small" danger>
        Cancel
      </Button>
    ),
  },
  {
    key: "2",
    name: "Samsum Galaxy",
    duration: "1 Hour",
    dateCreated: "January 30, 2020 17:00 GTM",
    createdBy: "Ryota",
    status: <BiddingStatusComponent status={B_CLOSED} />,
  },
  {
    key: "2",
    name: "Samsum Galaxy",
    duration: "2 Hours",
    dateCreated: "January 30, 2020 17:00 GTM",
    createdBy: "Ryota",
    status: <BiddingStatusComponent status={B_DONE} />,
  },
  {
    key: "2",
    name: "Samsum Galaxy",
    duration: "2 Hours",
    dateCreated: "January 30, 2020 17:00 GTM",
    createdBy: "Ryota",
    status: <BiddingStatusComponent status={B_ACTIVE} />,
    actions: (
      <Button size="small" danger>
        Cancel
      </Button>
    ),
  },
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Duration",
    dataIndex: "duration",
    key: "duration",
  },
  {
    title: "Date create",
    dataIndex: "dateCreated",
    key: "dateCreated",
  },
  {
    title: "Created By",
    dataIndex: "createdBy",
    key: "createdBy",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
  },
];

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
          <Table dataSource={dataSource} columns={columns} />
        </TabPane>
        {/* <TabPane tab="Invite Participants" key="2">
          Content of Tab Pane 2
        </TabPane> */}
      </Tabs>
    </div>
  );
};

export default AdminBiddingManagementComponent;
