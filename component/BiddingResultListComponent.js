import { Row } from "antd";
import React from "react";

const column = [
  {
    title: "Current Value",
    dataIndex: "currentValue",
    key: "currentValue",
  },
  {
    title: "No. Bids",
    dataIndex: "noBids",
    key: "noBids",
  },
  {
    title: "Best Bid Value",
    dataIndex: "bestBid",
    key: "bestBid",
  },
  {
    title: "Lead Supplier",
    dataIndex: "leadSupplier",
    key: "leadSupplier",
  },
  {
    title: "Saving Offered",
    dataIndex: "savingOffered",
    key: "savingOffered",
  },
  {
    title: "Supplier",
    dataIndex: "supplier",
    key: "supplier",
  },
];

const dataSource = [
  {
    currentValue: 850000,
    noBids: 6,
    bestBid: 740000,
    leadSupplier: "Supplier Rank 1",
  },
];

const BiddingResultListComponent = () => {
  return <Row></Row>;
};

export default BiddingResultListComponent;
