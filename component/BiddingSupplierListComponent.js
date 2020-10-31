import { Button, Col, Row, Space, Tag } from "antd";
import React, { useState } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import ListingSupplierByProductComponent from "./ListingSupplierByProductComponent";
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
  const [isOpenContact, setIsOpenContact] = useState(false);
  return (
    <Row>
      <Modal
        width={1000}
        onCancel={() => setIsOpenContact(false)}
        title="Add Supplier"
        visible={isOpenContact}
        okText="Add"
      >
        <ListingSupplierByProductComponent />
      </Modal>
      <Row justify="end" style={{ marginBottom: 32, width: "100%" }}>
        <Button onClick={() => setIsOpenContact(true)} type="primary">
          Add new Supplier
        </Button>
      </Row>
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
