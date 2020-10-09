import { Button, Select, Space, Drawer } from "antd";
import React, { Fragment, useState } from "react";
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
import { DEFAULT_DATE_RANGE, displayCurrency } from "../utils";
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
    title: "Group",
    dataIndex: "group",
    key: "group",
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
const AdminRequestGroupedComponent = () => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [openDetails, setOpenDetails] = useState(false);

  const dataSource = [
    {
      key: "4",
      fromPrice: "60$",
      toPrice: "80$",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 2",
      group: "Group 1",
      status: <RequestStatusComponent status={R_GROUPED} />,
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "5",
      fromPrice: "60$",
      toPrice: "80$",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 3",
      group: "Group 2",
      status: <RequestStatusComponent status={R_GROUPED} />,
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "6",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 1",
      group: "Group 3",
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
      key: "7",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 1",
      group: "Group 4",
      dateCreated: "30/09/2020 02:07:26 PM",
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_WAIT_FOR_AUCTION} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "8",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 1",
      group: "Group 5",
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
      key: "9",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 1",
      group: "Group 6",
      dateCreated: "30/09/2020 02:07:26 PM",
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_NEGOTIATING} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
  ];
  return (
    <div>
      <ReactTableLayout
        searchProps={{
          placeholder: "Search by product name",
          searchMessage,
          setSearchMessage,
          exElement: (
            <Fragment>
              <Select
                size="large"
                placeholder="Filter by group"
                style={{ width: 200 }}
                onChange={handleChange}
              >
                <Option value="1">Group 1</Option>
                <Option value="2">Group 2</Option>
                <Option value="3">Group 3</Option>
                <Option value="4">Group 4</Option>
                <Option value="5">Group 5</Option>
              </Select>
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
            </Fragment>
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
      <Drawer
        width={640}
        title="RFQ details"
        placement={"right"}
        closable={true}
        onClose={() => setOpenDetails(false)}
        visible={openDetails}
        key={"right"}
      >
        <RequestDetailsComponent />
      </Drawer>
    </div>
  );
};

export default AdminRequestGroupedComponent;
