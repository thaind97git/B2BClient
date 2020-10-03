import { Button, Input, Row, Select, Space, Tag } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE } from "../utils";
import BuyerRequestCreateComponent from "./BuyerRequestCreateComponent";
const { Option } = Select;
const { TextArea } = Input;
const dataSource = [
  {
    key: "1",
    fromPrice: "60$",
    toPrice: "80$",
    category: <Tag color="blue">Apple</Tag>,
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    status: <Tag>Pending</Tag>,
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
    fromPrice: "60$",
    toPrice: "80$",
    category: <Tag color="blue">Apple</Tag>,
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    status: (
      <Tag icon={<CloseCircleOutlined />} color="error">
        Canceled
      </Tag>
    ),
    actions: "--",
  },
  {
    key: "3",
    fromPrice: "60$",
    toPrice: "80$",
    category: <Tag color="blue">Apple</Tag>,
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    status: <Tag color="#f50">Rejected</Tag>,
    actions: "--",
  },
  {
    key: "4",
    fromPrice: "60$",
    toPrice: "80$",
    category: <Tag color="blue">Apple</Tag>,
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    status: <Tag color="#87d068">Done</Tag>,
    actions: "--",
  },
  {
    key: "5",
    fromPrice: "60$",
    toPrice: "80$",
    category: <Tag color="blue">Apple</Tag>,
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    status: <Tag>Pending</Tag>,
    actions: (
      <Space>
        <Button size="small" danger>
          Cancel
        </Button>
        <Button size="small">Edit</Button>
      </Space>
    ),
  },
];

const columns = [
  {
    title: "From Price",
    dataIndex: "fromPrice",
    key: "fromPrice",
  },
  {
    title: "To Price",
    dataIndex: "toPrice",
    key: "toPrice",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Date Created",
    dataIndex: "dateCreated",
    key: "dateCreated",
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
  const [visible, setVisible] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  function onChange(checkedValues) {
    console.log("checked = ", checkedValues);
  }

  return (
    <div>
      <Modal
        title="Create New Group"
        visible={openGroupModal}
        onOk={() => setOpenGroupModal(false)}
        onCancel={() => setOpenGroupModal(true)}
        footer={[
          <Button key="back" onClick={() => setOpenGroupModal(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => setOpenGroupModal(false)}
          >
            Submit
          </Button>,
        ]}
      >
        <Input placeholder="Group name" />
        <TextArea
          placeholder="Group description"
          allowClear
          onChange={onChange}
        />
      </Modal>
      <Modal
        width={1000}
        title="Create New Request"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(true)}
      >
        <BuyerRequestCreateComponent width={24} />
      </Modal>
      <Row justify="end">
        <Button onClick={() => setVisible(true)} type="primary">
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
