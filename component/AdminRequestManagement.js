import { Button, Col, Divider, Input, Radio, Row, Select, Tag } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE } from "../utils";
const { Option, OptGroup } = Select;
const dataSource = [
  {
    key: "1",
    fromPrice: "60$",
    toPrice: "80$",
    category: <Tag color="blue">Apple</Tag>,
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    actions: (
      <Button size="small" danger>
        Reject
      </Button>
    ),
  },
  {
    key: "2",
    fromPrice: "60$",
    toPrice: "80$",
    category: <Tag color="blue">Apple</Tag>,
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    actions: (
      <Button size="small" danger>
        Reject
      </Button>
    ),
  },
  {
    key: "3",
    fromPrice: "60$",
    toPrice: "80$",
    category: <Tag color="blue">Apple</Tag>,
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    actions: (
      <Button size="small" danger>
        Reject
      </Button>
    ),
  },
  {
    key: "4",
    fromPrice: "60$",
    toPrice: "80$",
    category: <Tag color="blue">Apple</Tag>,
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    actions: (
      <Button size="small" danger>
        Reject
      </Button>
    ),
  },
  {
    key: "5",
    fromPrice: "60$",
    toPrice: "80$",
    category: <Tag color="blue">Apple</Tag>,
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    actions: (
      <Button size="small" danger>
        Reject
      </Button>
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
    title: "Created By",
    dataIndex: "createdBy",
    key: "createdBy",
  },
  {
    title: "Date Created",
    dataIndex: "dateCreated",
    key: "dateCreated",
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
