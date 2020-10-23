import { Collapse, Row, Table, Typography, List, Button } from "antd";
import React from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import { displayCurrency } from "../utils";
import Router from "next/router";
const { Panel } = Collapse;
const { Link } = Typography;
const columns = [
  {
    title: <b>CURRENT VALUE</b>,
    dataIndex: "currentValue",
    key: "currentValue",
    render: (text) => displayCurrency(text),
  },
  {
    title: <b># BIDS</b>,
    dataIndex: "noBids",
    key: "noBids",
  },
  {
    title: <b>BEST BID VALUE</b>,
    dataIndex: "bestBid",
    key: "bestBid",
    render: (text) => <Link>{displayCurrency(text)}</Link>,
  },
  {
    title: <b>LEAD SUPPLIER</b>,
    dataIndex: "leadSupplier",
    key: "leadSupplier",
  },
  {
    title: <b>SAVING OFFERED</b>,
    dataIndex: "savingOffered",
    key: "savingOffered",
    render: (text, row) => {
      const saving = row.currentValue - row.bestBid;
      const percentageSaving = (saving / row.currentValue) * 100;
      return (
        <span>
          {displayCurrency(saving)} (
          <span style={{ color: "green" }}>
            {percentageSaving.toFixed(2)} %
          </span>
          )
        </span>
      );
    },
  },
  {
    title: <b># ACTIVE SUPPLIER</b>,
    dataIndex: "active",
    key: "active",
  },
];

const dataSrc = [
  {
    currentValue: 850000,
    noBids: 8,
    bestBid: 740000,
    leadSupplier: "Supplier Rank 1",
    active: 3,
  },
];
const data = [
  "12:40:00  Supplier-1 placed a bid of 800,000 đ.",
  "12:40:03  Supplier-2 placed a bid of 790,000 đ.",
  "12:41:20  Supplier-1 placed a bid of 780,000 đ.",
  "12:41:30  Supplier-3 placed a bid of 772,000 đ.",
  "12:41:50  Supplier-1 placed a bid of 765,000 đ.",
  "12:43:40  Supplier-2 placed a bid of 764,000 đ.",
  "12:45:10  Supplier-1 placed a bid of 760,000 đ.",
  "12:46:05  Supplier-3 placed a bid of 740,000 đ.",
];

const BiddingResultListComponent = () => {
  return (
    <Row style={{ width: "100%" }}>
      <Collapse
        style={{ width: "100%", marginBottom: 40 }}
        bordered={false}
        defaultActiveKey={["1"]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        className="site-collapse-custom-collapse"
      >
        <Panel
          header="Live Auction Feed"
          key="1"
          className="site-collapse-custom-panel"
        >
          <div style={{ height: 200, overflowY: "scroll" }}>
            <List
              size="small"
              dataSource={data}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </div>
        </Panel>
      </Collapse>
      <Table
        pagination={false}
        style={{ width: "100%" }}
        columns={columns}
        dataSource={dataSrc}
      />
      <Row justify="start" style={{ marginTop: 32 }}>
        <Button
          type="primary"
          onClick={() => {
            Router.push(`/aggregator/order/confirmation?groupID=${1}`);
          }}
        >
          Closing Sales
        </Button>
      </Row>
    </Row>
  );
};

export default BiddingResultListComponent;
