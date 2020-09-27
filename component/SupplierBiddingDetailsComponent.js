import React from "react";
import { Row, Tabs } from "antd";
import { ADMIN, SUPPLIER } from "../enums/accountRoles";

const { TabPane } = Tabs;
const SupplierBiddingDetailsComponent = ({ role = SUPPLIER }) => {
  return (
    <Row>
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span>Over view</span>} key="1">
          Overview
        </TabPane>
        {role === ADMIN && (
          <TabPane tab={<span>Participants</span>} key="2">
            Participants
          </TabPane>
        )}
        <TabPane tab={<span>Term & Condition</span>} key="3">
          Term
        </TabPane>
        <TabPane tab={<span>Qual. Bids</span>} key="4">
          Qual. Bids
        </TabPane>
        <TabPane tab={<span>Auction</span>} key="5">
          Auction
        </TabPane>
      </Tabs>
    </Row>
  );
};
export default SupplierBiddingDetailsComponent;
