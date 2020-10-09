import { Button, Select, Drawer } from "antd";
import React, { Fragment, useState } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE, displayCurrency } from "../utils";
import RequestStatusComponent from "./Utils/RequestStatusComponent";
import {
  R_CANCELED,
  R_DONE,
  R_ORDERED,
  R_REJECTED,
} from "../enums/requestStatus";
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
const AdminRequestCanceledComponent = () => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [openDetails, setOpenDetails] = useState(false);

  const dataSource = [
    {
      key: "1",
      fromPrice: "60$",
      toPrice: "80$",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 1",
      status: <RequestStatusComponent status={R_CANCELED} />,
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "2",
      fromPrice: "60$",
      toPrice: "80$",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 1",
      status: <RequestStatusComponent status={R_CANCELED} />,
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "3",
      fromPrice: "60$",
      toPrice: "80$",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 2",
      status: <RequestStatusComponent status={R_DONE} />,
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "4",
      fromPrice: "60$",
      toPrice: "80$",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 2",
      status: <RequestStatusComponent status={R_REJECTED} />,
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
      status: <RequestStatusComponent status={R_ORDERED} />,
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "1",
      fromPrice: "60$",
      toPrice: "80$",
      price: displayCurrency(300000),
      name: "Iphone 5",
      category: "Mobile Phone",
      quantity: 30,
      createdBy: "User 1",
      status: <RequestStatusComponent status={R_REJECTED} />,
      dateCreated: "30/09/2020 02:07:26 PM",
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

export default AdminRequestCanceledComponent;
