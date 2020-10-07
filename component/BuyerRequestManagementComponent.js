import { Button, Row, Select, Space, Typography } from "antd";
import React, { useState } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE } from "../utils";
import Router from "next/router";
import RequestStatusComponent from "./Utils/RequestStatusComponent";
import {
  R_BIDDING,
  R_CANCELED,
  R_DONE,
  R_GROUPED,
  R_NEGOTIATING,
  R_ORDERED,
  R_PENDING,
  R_REJECTED,
  R_WAIT_FOR_AUCTION,
} from "../enums/requestStatus";
const { Option } = Select;
const { Title } = Typography;
const dataSource = [
  {
    key: "1",
    price: "80$",
    category: "Iphone 5",
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    dueDate: "30/09/2020 02:07:26 PM",
    status: <RequestStatusComponent status={R_PENDING} />,
    actions: (
      <Space>
        <Button size="small" danger>
          Cancel
        </Button>
        <Button size="small">Edit</Button>
      </Space>
    ),
  },
  {
    key: "2",
    price: "80$",
    category: "Iphone 5S",
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    dueDate: "30/09/2020 02:07:26 PM",
    status: <RequestStatusComponent status={R_CANCELED} />,
    actions: "--",
  },
  {
    key: "3",
    price: "80$",
    category: "Iphone 6",
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    dueDate: "30/09/2020 02:07:26 PM",
    status: <RequestStatusComponent status={R_REJECTED} />,
    actions: "--",
  },
  {
    key: "4",
    price: "80$",
    category: "Iphone 6S",
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    dueDate: "30/09/2020 02:07:26 PM",
    status: <RequestStatusComponent status={R_DONE} />,
    actions: "--",
  },
  {
    key: "5",
    price: "80$",
    category: "Iphone 7",
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    dueDate: "30/09/2020 02:07:26 PM",
    status: <RequestStatusComponent status={R_BIDDING} />,
  },
  {
    key: "5",
    price: "80$",
    category: "Iphone 7S",
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    dueDate: "30/09/2020 02:07:26 PM",
    status: <RequestStatusComponent status={R_WAIT_FOR_AUCTION} />,
  },
  {
    key: "5",
    price: "80$",
    category: "Iphone 7S Plus",
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    dueDate: "30/09/2020 02:07:26 PM",
    status: <RequestStatusComponent status={R_GROUPED} />,
    actions: (
      <Space>
        <Button size="small" danger>
          Cancel
        </Button>
      </Space>
    ),
  },
  {
    key: "5",
    price: "80$",
    category: "Iphone 8",
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    dueDate: "30/09/2020 02:07:26 PM",
    status: <RequestStatusComponent status={R_NEGOTIATING} />,
    actions: (
      <Space>
        <Button size="small" danger>
          Cancel
        </Button>
      </Space>
    ),
  },
  {
    key: "5",
    price: "80$",
    category: "Iphone 10",
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    dueDate: "30/09/2020 02:07:26 PM",
    status: <RequestStatusComponent status={R_ORDERED} />,
  },
];

const columns = [
  {
    title: "Product Name",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Preferred Unit Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Date Created",
    dataIndex: "dateCreated",
    key: "dateCreated",
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
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
function handleChange(value) {
  console.log(`selected ${value}`);
}
const BuyerRequestManagement = () => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);

  return (
    <div>
      <Row justify="space-between">
        <Title level={4}>Your Request</Title>
        <Button
          onClick={() => Router.push("/buyer/request/create")}
          type="primary"
        >
          Create new request
        </Button>
      </Row>
      <ReactTableLayout
        searchProps={{
          searchMessage,
          setSearchMessage,
          exElement: (
            <Select
              size="large"
              placeholder="Filter by status"
              style={{ width: 200 }}
              onChange={handleChange}
            >
              <Option value="pending">Pending</Option>
              <Option value="done">Done</Option>
              <Option value="rejected">Rejected</Option>
              <Option value="canceled">Canceled</Option>
            </Select>
          ),
        }}
        dateRangeProps={{
          dateRange,
          setDateRange,
        }}
        data={dataSource}
        columns={columns}
      />
      {/* <Table dataSource={dataSource} columns={columns} /> */}
    </div>
  );
};

export default BuyerRequestManagement;
