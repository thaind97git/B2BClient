import React from "react";
import { Row, Statistic, Tabs, Tag, Typography } from "antd";
import { ADMIN, SUPPLIER } from "../enums/accountRoles";
import BiddingOverviewComponent from "./BiddingOverviewComponent";
import BiddingAuctionComponent from "./BiddingAuctionComponent";
const { TabPane } = Tabs;
const { Countdown } = Statistic;
const { Title } = Typography;
function onFinish() {
  console.log("finished!");
}
const SupplierBiddingDetailsComponent = ({ role = SUPPLIER }) => {
  const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
  return (
    <div>
      <Row justify="space-between">
        <div></div>
        <Tag color="blue">
          <Row align="middle">
            <Title style={{ fontWeight: 500, marginBottom: 0 }} level={5}>
              Time Remaining:{" "}
            </Title>
            <span>&nbsp;</span>
            <Countdown title="" value={deadline} onFinish={onFinish} />
          </Row>
        </Tag>
      </Row>
      <Tabs defaultActiveKey="1">
        <TabPane
          className="bidding-over-view"
          tab={<span>Overview</span>}
          key="1"
        >
          <BiddingOverviewComponent />
        </TabPane>
        {role === ADMIN && (
          <TabPane tab={<span>Participants</span>} key="2">
            Participants
          </TabPane>
        )}
        <TabPane tab={<span>Auction</span>} key="5">
          <BiddingAuctionComponent />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default SupplierBiddingDetailsComponent;
