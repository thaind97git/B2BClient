import { Button, Drawer, Row, Select, Typography } from "antd";
import React, { useState } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE , displayCurrency } from "../utils";
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
import RequestDetailsComponent from "./RequestDetailsComponent";
const { Option } = Select;
const { Title } = Typography;

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
    title: "Details",
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
  const [openDetails, setOpenDetails] = useState(false);
  const dataSource = [
    {
      key: "1",
      price: displayCurrency(300000),
      category: "Iphone 5",
      quantity: 20,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
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
      category: "Iphone 5S",
      quantity: 20,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
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
      category: "Iphone 6",
      quantity: 20,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
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
      category: "Iphone 6S",
      quantity: 20,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
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
      category: "Iphone 7",
      quantity: 20,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
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
      category: "Iphone 7S",
      quantity: 20,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_WAIT_FOR_AUCTION} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "5",
      price: displayCurrency(300000),
      category: "Iphone 7S Plus",
      quantity: 20,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_GROUPED} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "5",
      price: displayCurrency(300000),
      category: "Iphone 8",
      quantity: 20,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
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
      category: "Iphone 10",
      quantity: 20,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_ORDERED} />,
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
  ];
  return (
    <div>
      <Row justify="space-between">
        <Drawer
          width={640}
          title="RFQ details"
          placement={"right"}
          closable={true}
          onClose={() => setOpenDetails(false)}
          visible={openDetails}
          key={"right"}
        >
          <RequestDetailsComponent
            buttonActions={[
              {
                label: "Cancel",
                buttonProps: {
                  danger: true,
                },
              },
            ]}
          />
        </Drawer>
        <Title level={4}>Your Request for Quotation</Title>
        <Button onClick={() => Router.push("/buyer/rfq/create")} type="primary">
          Create new request
        </Button>
      </Row>
      <ReactTableLayout
        searchProps={{
          placeholder: "Search by product name",
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
              <Option value="ordered">Ordered</Option>
              <Option value="bidding">Bidding</Option>
              <Option value="wait">Wait for Auction</Option>
              <Option value="group">Grouping</Option>
              <Option value="nego">Negotiating</Option>
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
    </div>
  );
};

export default BuyerRequestManagement;
