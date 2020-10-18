import { Button, Col, Divider, Radio, Row, Select, Drawer } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import { R_PENDING } from "../enums/requestStatus";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE, displayCurrency } from "../utils";
import GroupCreateComponent from "./GroupCreateComponent";
import RequestStatusComponent from "./Utils/RequestStatusComponent";
import RequestDetailsComponent from "./RequestDetailsComponent";
const { Option, OptGroup } = Select;

const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Preferred Unit Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Date Created",
    dataIndex: "dateCreated",
    key: "dateCreated",
  },
  // {
  //   title: "Status",
  //   dataIndex: "status",
  //   key: "status",
  // },

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
  const [modalVisible, setModalVisible] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const dataSource = [
    {
      key: "1",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_PENDING} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "2",
      price: displayCurrency(300000),
      name: "Laptop Gaming For Go Pro",
      category: "Laptop",
      quantity: 30,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_PENDING} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "3",
      price: displayCurrency(300000),
      name: "Gaming Gear Razor",
      category: "Electronic Device",
      quantity: 30,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_PENDING} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "4",
      price: displayCurrency(300000),
      name: "Leather",
      category: "Cloth",
      quantity: 30,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_PENDING} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    /*{
      key: "2",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_CANCELED} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "3",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_REJECTED} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "4",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_DONE} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "5",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_BIDDING} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "5",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_WAIT_FOR_AUCTION} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },*/
    {
      key: "5",
      price: displayCurrency(300000),
      name: "Samsung Galaxy S300",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_PENDING} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    /*{
      key: "5",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_NEGOTIATING} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "5",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_ORDERED} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },*/
  ];

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
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(true)}
        footer={[
          <Row justify="space-between">
            <Col>
              <Button type="primary" onClick={() => setOpenGroupModal(true)}>
                Create new group
              </Button>
            </Col>
            <Col>
              <Button key="back" onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button
                key="submit"
                type="primary"
                onClick={() => setModalVisible(false)}
              >
                Submit
              </Button>
            </Col>
          </Row>,
        ]}
      >
        <Radio.Group style={{ width: "100%" }} onChange={onChange}>
          <Row>
            <Col span={24}>
              <Radio value="A">
                <b>Group Iphone 6s 32Gb</b> created inside Iphone
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="B">
                <b>Group Iphone 8 64Gb</b> created inside Iphone
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="C">
                <b>Group Mackbook Air 2015</b> created inside Mackbook
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="D">
                <b>Group Mackbook Air 2018</b> created inside Mackbook
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="E">
                <b>Group Mackbook Air 2018</b> created inside Mackbook
              </Radio>
            </Col>
          </Row>
        </Radio.Group>
      </Modal>
      <Row justify="end">
        <Button
          onClick={() => setModalVisible(true)}
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
          placeholder: "Search by product name",
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
      <Drawer
        width={640}
        title="RFQ details"
        placement={"right"}
        closable={true}
        onClose={() => setOpenDetails(false)}
        visible={openDetails}
        key={"right"}
      >
        <RequestDetailsComponent isSupplier={false} />
      </Drawer>
      {/* <Table dataSource={dataSource} columns={columns} /> */}
    </div>
  );
};

export default AdminRequestManagement;
