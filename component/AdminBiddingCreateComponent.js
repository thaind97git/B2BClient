import { Row, Tabs, Typography } from "antd";
import React from "react";
import BiddingSettingComponent from "./BiddingSettingComponent";
const { Title } = Typography;
const { TabPane } = Tabs;
function callback(key) {
  console.log(key);
}
const AdminBiddingCreateComponent = () => {
  return (
    <div>
      <Row>
        <Title level={4}>New Event</Title>
      </Row>
      <div>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Settings" key="1">
            <BiddingSettingComponent />
          </TabPane>
          <TabPane tab="Invite Participants" key="2">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminBiddingCreateComponent;
