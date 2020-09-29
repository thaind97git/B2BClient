import { Button, Checkbox, Col, Divider, Row, Typography } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import TabsLayout from "../layouts/TabsLayout";
import BiddingSettingComponent from "./BiddingSettingComponent";
const { Title } = Typography;
const AdminBiddingCreateComponent = () => {
  const [defaultTab, setDefaultTab] = useState("1");
  const [visible, setVisible] = useState(false);
  const CREATE_BIDDING = [
    {
      title: "Settings",
      key: "1",
      content: <BiddingSettingComponent setDefaultTab={setDefaultTab} />,
    },
    {
      title: "Invite Participants",
      key: "2",
      content: (
        <div>
          <Button onClick={() => setVisible(true)} danger>
            Add New Participant
          </Button>
        </div>
      ),
    },
  ];
  function onChange(checkedValues) {
    console.log("checked = ", checkedValues);
  }
  return (
    <div>
      <Modal
        title="Invite Participant"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(true)}
      >
        <Checkbox.Group style={{ width: "100%" }} onChange={onChange}>
          <Row>
            <Col span={24}>
              <Checkbox value="A">
                Participant 1 | Participant1@gmail.com
              </Checkbox>
            </Col>
            <Divider />
            <Col span={24}>
              <Checkbox value="B">
                Participant 2 | Participant2@gmail.com
              </Checkbox>
            </Col>
            <Divider />
            <Col span={24}>
              <Checkbox value="C">
                Participant 3 | Participant3@gmail.com
              </Checkbox>
            </Col>
            <Divider />
            <Col span={24}>
              <Checkbox value="D">
                Participant 4 | Participant4@gmail.com
              </Checkbox>
            </Col>
            <Divider />
            <Col span={24}>
              <Checkbox value="E">
                Participant 5 | Participant5@gmail.com
              </Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </Modal>
      <Row>
        <Title level={4}>New Event</Title>
      </Row>
      <div>
        <TabsLayout
          tabs={CREATE_BIDDING}
          defaultTab={defaultTab}
          setDefaultTab={setDefaultTab}
        />
        {/* <TabsLayout defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Settings" key="1">
            <BiddingSettingComponent />
          </TabPane>
          <TabPane tab="Invite Participants" key="2">
            Content of Tab Pane 2
          </TabPane>
        </TabsLayout> */}
      </div>
    </div>
  );
};

export default AdminBiddingCreateComponent;
