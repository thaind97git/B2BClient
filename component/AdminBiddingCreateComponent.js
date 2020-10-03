import {
  Button,
  Checkbox,
  Col,
  Divider,
  Radio,
  Row,
  Tag,
  Typography,
} from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import TabsLayout from "../layouts/TabsLayout";
import BiddingSettingComponent from "./BiddingSettingComponent";
const { Title } = Typography;
const AdminBiddingCreateComponent = () => {
  const [defaultTab, setDefaultTab] = useState("0");
  const [visible, setVisible] = useState(false);
  const CREATE_BIDDING = [
    {
      title: "Choose Group",
      key: "0",
      content: (
        <Radio.Group
          style={{ width: "100%" }}
          onChange={(checkedValues) => {
            console.log({ checkedValues });
            setDefaultTab("1");
          }}
        >
          <Row>
            <Col span={24}>
              <Radio value="A">
                <b>Group 1</b> created inside <Tag color="blue">Apple</Tag>
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="B">
                <b>Group 2</b> created inside <Tag color="blue">Apple</Tag>
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="C">
                <b>Group 3</b> created inside <Tag color="blue">Apple</Tag>
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="D">
                <b>Group 4</b> created inside <Tag color="blue">Apple</Tag>
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="E">
                <b>Group 5</b> created inside <Tag color="blue">Apple</Tag>
              </Radio>
            </Col>
          </Row>
        </Radio.Group>
      ),
    },
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
      </div>
    </div>
  );
};

export default AdminBiddingCreateComponent;
