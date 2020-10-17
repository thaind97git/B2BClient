import { Button, Drawer, Row, Select, Typography } from "antd";
import React, { useState } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE, displayCurrency } from "../utils";
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
    title: "Details",
    dataIndex: "actions",
    key: "actions",
  },
];
function handleChange(value) {
  console.log(`selected ${value}`);
}

const getButtonActionsByStatus = (status) => {
  let result = [];
  switch (status) {
    case R_PENDING:
      result = [{ label: "Cancel", buttonProps: { danger: true } }];
      break;
    case R_WAIT_FOR_AUCTION:
      result = [];
      break;
    case R_REJECTED:
      result = [];
      break;
    case R_ORDERED:
      result = [];
      break;
    case R_NEGOTIATING:
      result = [];
      break;
    case R_GROUPED:
      result = [];
      break;
    case R_DONE:
      result = [];
      break;
    case R_CANCELED:
      result = [];
      break;
    case R_BIDDING:
      result = [];
      break;

    default:
      break;
  }
  return result;
};

const REQUEST_DETAIL_LIST = [
  {
    productName: "Iphone 6s",
    category: "Iphone",
    sourcingType: "Non-customized Product",
    sourcingPurpose: "Retail",
    quantity: "20",
    unit: "Units",
    tradeTerms: "FOB",
    preUnitPrice: 500000,
    dueDate: "30/10/2020 02:04:00 PM",
    details: "I really want to buy this product",
    attachments: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
    certifi: "ISO/TS16949",
    shippingMethod: "Express",
    destination: "Nguyễn Thị Minh Khai - Phường 2 - Q.1 - TP.HCM",
    leadTime: 4,
    status: R_PENDING,
  },
  {
    productName: "Iphone 6s",
    category: "Iphone",
    sourcingType: "Non-customized Product",
    sourcingPurpose: "Retail",
    quantity: "20",
    unit: "Units",
    tradeTerms: "FOB",
    preUnitPrice: 500000,
    dueDate: "30/10/2020 02:04:00 PM",
    details: "I really want to buy this product",
    attachments: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
    certifi: "ISO/TS16949",
    shippingMethod: "Express",
    destination: "Nguyễn Thị Minh Khai - Phường 2 - Q.1 - TP.HCM",
    leadTime: 4,
    status: R_BIDDING,
  },
  {
    productName: "Iphone 6s",
    category: "Iphone",
    sourcingType: "Non-customized Product",
    sourcingPurpose: "Retail",
    quantity: "20",
    unit: "Units",
    tradeTerms: "FOB",
    preUnitPrice: 500000,
    dueDate: "30/10/2020 02:04:00 PM",
    details: "I really want to buy this product",
    attachments: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
    certifi: "ISO/TS16949",
    shippingMethod: "Express",
    destination: "Nguyễn Thị Minh Khai - Phường 2 - Q.1 - TP.HCM",
    leadTime: 4,
    status: R_CANCELED,
  },
  {
    productName: "Iphone 6s",
    category: "Iphone",
    sourcingType: "Non-customized Product",
    sourcingPurpose: "Retail",
    quantity: "20",
    unit: "Units",
    tradeTerms: "FOB",
    preUnitPrice: 500000,
    dueDate: "30/10/2020 02:04:00 PM",
    details: "I really want to buy this product",
    attachments: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
    certifi: "ISO/TS16949",
    shippingMethod: "Express",
    destination: "Nguyễn Thị Minh Khai - Phường 2 - Q.1 - TP.HCM",
    leadTime: 4,
    status: R_DONE,
  },
  {
    productName: "Iphone 6s",
    category: "Iphone",
    sourcingType: "Non-customized Product",
    sourcingPurpose: "Retail",
    quantity: "20",
    unit: "Units",
    tradeTerms: "FOB",
    preUnitPrice: 500000,
    dueDate: "30/10/2020 02:04:00 PM",
    details: "I really want to buy this product",
    attachments: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
    certifi: "ISO/TS16949",
    shippingMethod: "Express",
    destination: "Nguyễn Thị Minh Khai - Phường 2 - Q.1 - TP.HCM",
    leadTime: 4,
    status: R_GROUPED,
  },
  {
    productName: "Iphone 6s",
    category: "Iphone",
    sourcingType: "Non-customized Product",
    sourcingPurpose: "Retail",
    quantity: "20",
    unit: "Units",
    tradeTerms: "FOB",
    preUnitPrice: 500000,
    dueDate: "30/10/2020 02:04:00 PM",
    details: "I really want to buy this product",
    attachments: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
    certifi: "ISO/TS16949",
    shippingMethod: "Express",
    destination: "Nguyễn Thị Minh Khai - Phường 2 - Q.1 - TP.HCM",
    leadTime: 4,
    status: R_NEGOTIATING,
  },
  {
    productName: "Iphone 6s",
    category: "Iphone",
    sourcingType: "Non-customized Product",
    sourcingPurpose: "Retail",
    quantity: "20",
    unit: "Units",
    tradeTerms: "FOB",
    preUnitPrice: 500000,
    dueDate: "30/10/2020 02:04:00 PM",
    details: "I really want to buy this product",
    attachments: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
    certifi: "ISO/TS16949",
    shippingMethod: "Express",
    destination: "Nguyễn Thị Minh Khai - Phường 2 - Q.1 - TP.HCM",
    leadTime: 4,
    status: R_ORDERED,
  },
  {
    productName: "Iphone 6s",
    category: "Iphone",
    sourcingType: "Non-customized Product",
    sourcingPurpose: "Retail",
    quantity: "20",
    unit: "Units",
    tradeTerms: "FOB",
    preUnitPrice: 500000,
    dueDate: "30/10/2020 02:04:00 PM",
    details: "I really want to buy this product",
    attachments: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
    certifi: "ISO/TS16949",
    shippingMethod: "Express",
    destination: "Nguyễn Thị Minh Khai - Phường 2 - Q.1 - TP.HCM",
    leadTime: 4,
    status: R_REJECTED,
  },
  {
    productName: "Iphone 6s",
    category: "Iphone",
    sourcingType: "Non-customized Product",
    sourcingPurpose: "Retail",
    quantity: "20",
    unit: "Units",
    tradeTerms: "FOB",
    preUnitPrice: 500000,
    dueDate: "30/10/2020 02:04:00 PM",
    details: "I really want to buy this product",
    attachments: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
    certifi: "ISO/TS16949",
    shippingMethod: "Express",
    destination: "Nguyễn Thị Minh Khai - Phường 2 - Q.1 - TP.HCM",
    leadTime: 4,
    status: R_WAIT_FOR_AUCTION,
  },
];
const BuyerRequestManagement = () => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentRequestSelected, setCurrentRequestSelected] = useState({});

  const dataSource = [
    {
      key: "1",
      price: displayCurrency(300000),
      category: "Iphone 5",
      quantity: 20,
      createdBy: "User 1",
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_PENDING} />,
      actions: (
        <Button
          onClick={() => {
            const requestSelected = REQUEST_DETAIL_LIST.find(
              (r) => r.status === R_PENDING
            );
            setCurrentRequestSelected(requestSelected);
            setOpenDetails(true);
          }}
          size="small"
          type="link"
        >
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
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_CANCELED} />,
      actions: (
        <Button
          onClick={() => {
            const requestSelected = REQUEST_DETAIL_LIST.find(
              (r) => r.status === R_CANCELED
            );
            setCurrentRequestSelected(requestSelected);
            setOpenDetails(true);
          }}
          size="small"
          type="link"
        >
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
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_REJECTED} />,
      actions: (
        <Button
          onClick={() => {
            const requestSelected = REQUEST_DETAIL_LIST.find(
              (r) => r.status === R_REJECTED
            );
            setCurrentRequestSelected(requestSelected);
            setOpenDetails(true);
          }}
          size="small"
          type="link"
        >
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
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_DONE} />,
      actions: (
        <Button
          onClick={() => {
            const requestSelected = REQUEST_DETAIL_LIST.find(
              (r) => r.status === R_DONE
            );
            setCurrentRequestSelected(requestSelected);
            setOpenDetails(true);
          }}
          size="small"
          type="link"
        >
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
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_BIDDING} />,
      actions: (
        <Button
          onClick={() => {
            const requestSelected = REQUEST_DETAIL_LIST.find(
              (r) => r.status === R_BIDDING
            );
            setCurrentRequestSelected(requestSelected);
            setOpenDetails(true);
          }}
          size="small"
          type="link"
        >
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
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_WAIT_FOR_AUCTION} />,
      actions: (
        <Button
          onClick={() => {
            const requestSelected = REQUEST_DETAIL_LIST.find(
              (r) => r.status === R_WAIT_FOR_AUCTION
            );
            setCurrentRequestSelected(requestSelected);
            setOpenDetails(true);
          }}
          size="small"
          type="link"
        >
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
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_GROUPED} />,
      actions: (
        <Button
          onClick={() => {
            const requestSelected = REQUEST_DETAIL_LIST.find(
              (r) => r.status === R_GROUPED
            );
            setCurrentRequestSelected(requestSelected);
            setOpenDetails(true);
          }}
          size="small"
          type="link"
        >
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
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_NEGOTIATING} />,
      actions: (
        <Button
          onClick={() => {
            const requestSelected = REQUEST_DETAIL_LIST.find(
              (r) => r.status === R_NEGOTIATING
            );
            setCurrentRequestSelected(requestSelected);
            setOpenDetails(true);
          }}
          size="small"
          type="link"
        >
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
      dueDate: "30/09/2020 02:07:26 PM",
      status: <RequestStatusComponent status={R_ORDERED} />,
      actions: (
        <Button
          onClick={() => {
            const requestSelected = REQUEST_DETAIL_LIST.find(
              (r) => r.status === R_ORDERED
            );
            setCurrentRequestSelected(requestSelected);
            setOpenDetails(true);
          }}
          size="small"
          type="link"
        >
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
            request={currentRequestSelected}
            buttonActions={getButtonActionsByStatus(
              currentRequestSelected.status
            )}
          />
        </Drawer>
        <Title level={4}>Your Request for Quotation</Title>
        <Button onClick={() => {}} type="primary">
          <a href="/#product" target="_blank">
            Submit Other RFQ
          </a>
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
