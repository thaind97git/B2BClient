import { Card, Col, Divider, Row, Typography } from "antd";
import React, { Fragment, useState } from "react";
import { B_ACTIVE } from "../enums/biddingStatus";
import TabsLayout from "../layouts/TabsLayout";
import BiddingSupplierListComponent from "./BiddingSupplierListComponent";
import BiddingStatusComponent from "./Utils/BiddingStatusComponent";
import BiddingOverviewComponent from "./BiddingOverviewComponent";
import BiddingResultListComponent from "./BiddingResultListComponent";
const { Title } = Typography;
const AdminBiddingDetailsComponent = ({ bidding }) => {
  const [defaultTab, setDefaultTab] = useState("0");
  const {
    groupName = "Group A7 Action Camera 4k HD720P - 02/10/2020",
    status = B_ACTIVE,
    hostBy = "John Smith",
  } = bidding || {};
  const BIDDING = [
    {
      title: "Overview",
      key: "0",
      content: <BiddingOverviewComponent isSupplier={false} />,
    },
    {
      title: "Suppliers",
      key: "1",
      content: <BiddingSupplierListComponent />,
    },
    {
      title: "Reverse Auction",
      key: "2",
      content: <BiddingResultListComponent />,
    },
  ];
  return (
    <Fragment>
      <Card
        style={{ width: "100%", boxShadow: "0 2px 6px rgba(28,35,43,0.06)" }}
      >
        <Row justify="space-between">
          <Col>
            <Title level={4}>Group Name: {groupName}</Title>
          </Col>
          <Col>
            <Row align="middle">
              <div>
                Auction Status: <BiddingStatusComponent status={status} />
              </div>
              <Divider type="vertical" />
              <div>
                Host: <b>{hostBy}</b>
              </div>
            </Row>
          </Col>
        </Row>
      </Card>
      <TabsLayout
        tabs={BIDDING}
        defaultTab={defaultTab}
        setDefaultTab={setDefaultTab}
      />
    </Fragment>
  );
};

export default AdminBiddingDetailsComponent;
