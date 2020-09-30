import {
  Button,
  Col,
  Divider,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Tag,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE } from "../utils";
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
        title="Listing Group"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(true)}
        footer={[
          <Button type="primary" onClick={() => setOpenGroupModal(true)}>
            Create new group
          </Button>,
          <Button key="back" onClick={() => setVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => setVisible(false)}>
            Submit
          </Button>,
        ]}
      >
        <Radio.Group style={{ width: "100%" }} onChange={onChange}>
          <Row>
            <Col span={24}>
              <Radio value="A">
                <b>Group 1</b> created inside <Tag color="blue">Apple</Tag>
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="B">
                <b>Group 2</b> created inside <Tag color="blue">Apple</Tag>
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="C">
                <b>Group 3</b> created inside <Tag color="blue">Apple</Tag>
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="D">
                <b>Group 4</b> created inside <Tag color="blue">Apple</Tag>
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="E">
                <b>Group 5</b> created inside <Tag color="blue">Apple</Tag>
              </Radio>
            </Col>
          </Row>
        </Radio.Group>
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
              <Option value="jack">Pending</Option>
              <Option value="lucy">Done</Option>
              <Option value="Yiminghe">Reject</Option>
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
