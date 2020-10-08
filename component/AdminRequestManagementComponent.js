import { Button, Col, Divider, Radio, Row, Select, Space } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
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
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE } from "../utils";
import GroupCreateComponent from "./GroupCreateComponent";
import RequestStatusComponent from "./Utils/RequestStatusComponent";
const { Option, OptGroup } = Select;
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
          Reject
        </Button>
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
    actions: (
      <Space>
        <Button size="small">View Auction</Button>
      </Space>
    ),
  },
  {
    key: "5",
    price: "80$",
    category: "Iphone 7S",
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    dueDate: "30/09/2020 02:07:26 PM",
    status: <RequestStatusComponent status={R_WAIT_FOR_AUCTION} />,
    actions: (
      <Space>
        <Button size="small">View Auction</Button>
      </Space>
    ),
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
        <Button size="small">View Group</Button>
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
        <Button size="small">View Group</Button>
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
    actions: "--",
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
const AdminRequestManagement = () => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [recordSelected, setRecordSelected] = useState([]);
  const [visible, setVisible] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setRecordSelected(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };
  function onChange(checkedValues) {
    console.log("checked = ", checkedValues);
  }
  useEffect(() => {
    console.log(recordSelected);
  }, [recordSelected]);
  return (
    <div>
      <Modal
        width={800}
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
        <GroupCreateComponent />
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
                <b>Group 1</b> created inside Iphone 6
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="B">
                <b>Group 2</b> created inside Iphone 7
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="C">
                <b>Group 3</b> created inside Iphone 8
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="D">
                <b>Group 4</b> created inside Iphone 10
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="E">
                <b>Group 5</b> created inside Iphone 12
              </Radio>
            </Col>
          </Row>
        </Radio.Group>
      </Modal>
      <Row justify="end">
        <Button
          onClick={() => setVisible(true)}
          type="primary"
          disabled={recordSelected.length > 0 ? false : true}
        >
          Choose Group to Add
        </Button>
      </Row>
      <ReactTableLayout
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        searchProps={{
          searchMessage,
          setSearchMessage,
          exElement: (
            <Select
              size="large"
              placeholder="Filter by category"
              style={{ width: 200 }}
              onChange={handleChange}
            >
              <OptGroup label="Category 1">
                <Option value="jack">Sub-1 Category 1</Option>
                <Option value="lucy">Sub-2 Category 1</Option>
              </OptGroup>
              <OptGroup label="Category 2">
                <Option value="Yiminghe">Sub-1 Category 1</Option>
              </OptGroup>
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

export default AdminRequestManagement;
