import { Button, Row, Tag } from "antd";
import React from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
const columns = [
  {
    title: "Supplier",
    dataIndex: "supplier",
    key: "supplier",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Details",
    dataIndex: "actions",
    key: "actions",
  },
];
const dataSource = [
  {
    key: "1",
    supplier: "Supplier 1",
    email: "supplier1@gmail.com",
    phone: "0163909365",
    status: (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Registered
      </Tag>
    ),
    actions: (
      <Button size="small" danger>
        Remove
      </Button>
    ),
  },
  {
    key: "2",
    supplier: "Supplier 2",
    email: "supplier2@gmail.com",
    phone: "0934496442",
    status: (
      <Tag icon={<CloseCircleOutlined />} color="error">
        Not accepted invitation
      </Tag>
    ),
  },
  {
    key: "3",
    supplier: "Supplier 3",
    email: "Supplier3@gmail.com",
    phone: "0934496441",
    status: (
      <Tag icon={<ClockCircleOutlined />} color="warning">
        Pending
      </Tag>
    ),
    actions: (
      <Button size="small" danger>
        Cancel
      </Button>
    ),
  },
];
const BiddingSupplierListComponent = () => {
  return (
    <Row>
      <ReactTableLayout
        hasAction={false}
        hasPaging={false}
        data={dataSource}
        columns={columns}
      />
    </Row>
  );
};

export default BiddingSupplierListComponent;
