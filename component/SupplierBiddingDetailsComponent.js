import React from "react";
import { Tabs } from "antd";
import { ADMIN, SUPPLIER } from "../enums/accountRoles";
import BiddingOverviewComponent from "./BiddingOverviewComponent";
import BiddingAuctionComponent from "./BiddingAuctionComponent";
const { TabPane } = Tabs;
const SupplierBiddingDetailsComponent = ({ role = SUPPLIER }) => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane
        className="bidding-over-view"
        tab={<span>Over view</span>}
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
  );
};
export default SupplierBiddingDetailsComponent;
