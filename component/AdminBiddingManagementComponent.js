import { Button, Row, Table, Tabs } from "antd";
import Router from "next/router";
import React from "react";
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
    status: (
      <Button size="small" type="primary">
        Feature
      </Button>
    ),
  },
  {
    key: "2",
    name: "Samsum Galaxy",
    duration: "1 Hour",
    dateCreated: "January 30, 2020 17:00 GTM",
    createdBy: "Ryota",
    status: (
      <Button size="small" type="primary" danger>
        Closed
      </Button>
    ),
  },
  {
    key: "2",
    name: "Samsum Galaxy",
    duration: "2 Hours",
    dateCreated: "January 30, 2020 17:00 GTM",
    createdBy: "Ryota",
    status: (
      <Button size="small" style={{ background: "green" }} type="primary">
        Done
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
