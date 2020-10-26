import { Button, Row, Table, Tabs } from "antd";
import Link from "next/link";
import Router from "next/router";
import React from "react";
import { B_ACTIVE, B_CLOSED, B_DONE, B_FEATURE } from "../enums/biddingStatus";
import { createLink } from "../libs";
import BiddingStatusComponent from "./Utils/BiddingStatusComponent";
const { TabPane } = Tabs;
function callback(key) {
  console.log(key);
}

const dataSource = [
  {
    key: "1",
    name: "IR Night Vision Hidden Camera Watch Sport - 25/10/2020",
    duration: "30 Minutes",
    dateCreated: "October 22, 2020 17:00 GTM",
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
    name:
      "Followsun 50 in 1 Accessories for Go pro, Action Camera Mounts, Sports Camera Head Strap Chest Strap - 24/10/2020",
    duration: "2 Hours",
    dateCreated: "October 18, 2020 17:00 GTM",
    createdBy: "Ryota",
    status: <BiddingStatusComponent status={B_ACTIVE} />,
  },
  {
    key: "3",
    name:
      "Customization japanese School Uniform shirts wholesale Set - 27/09/2020",
    duration: "1 Hour",
    dateCreated: "September 25, 2020 17:00 GTM",
    createdBy: "Ryota",
    status: <BiddingStatusComponent status={B_CLOSED} />,
  },
  {
    key: "4",
    name:
      "Factory Direct Supply Double-breasted Breathable Chef Cook Uniform - 28/05/2020",
    duration: "2 Hours",
    dateCreated: "May 27, 2020 17:00 GTM",
    createdBy: "Ryota",
    status: <BiddingStatusComponent status={B_DONE} />,
  },
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => (
      <Link href={createLink(["aggregator", "bidding", `details?id=${1}`])}>
        {text}
      </Link>
    ),
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
            Router.push("/aggregator/bidding/create");
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
