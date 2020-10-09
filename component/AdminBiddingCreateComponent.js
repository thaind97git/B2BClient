import { Button, Checkbox, Col, Divider, Row, Typography } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import TabsLayout from "../layouts/TabsLayout";
import BiddingSettingComponent from "./BiddingSettingComponent";
const { Title } = Typography;
const plainOptions = [
  { id: 1, label: "Supplier 1 (supplier1@gmail.com)" },
  { id: 2, label: "Supplier 1 (supplier1@gmail.com)" },
  { id: 3, label: "Supplier 1 (supplier1@gmail.com)" },
  { id: 4, label: "Supplier 1 (supplier1@gmail.com)" },
  { id: 5, label: "Supplier 1 (supplier1@gmail.com)" },
  { id: 6, label: "Supplier 1 (supplier1@gmail.com)" },
];

const AdminBiddingCreateComponent = () => {
  const [defaultTab, setDefaultTab] = useState("1");
  const [visible, setVisible] = useState(false);
  const [isDoneSetting, setIsDoneSetting] = useState(false);
  const [checkbox, setCheckBox] = useState({
    checkedList: [],
    indeterminate: true,
    checkAll: false,
  });
  const CREATE_BIDDING = [
    {
      title: "Settings",
      key: "1",
      content: (
        <BiddingSettingComponent
          setDefaultTab={setDefaultTab}
          setIsDoneSetting={setIsDoneSetting}
        />
      ),
    },
    {
      title: "Invite Suppliers",
      key: "2",
      content: (
        <div>
          <Button onClick={() => setVisible(true)} danger>
            Add New Supplier
          </Button>
        </div>
      ),
      // props: { disabled: isDoneSetting ? false : true },
    },
  ];
  const onChange = (checkedList) => {
    console.log({ checkedList });
    setCheckBox({
      checkedList,
      indeterminate:
        !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length,
    });
  };

  const onCheckAllChange = (e) => {
    setCheckBox({
      checkedList: e.target.checked ? plainOptions.map((op) => op.id) : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };
  return (
    <div>
      <Modal
        title="Invite Supplier"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <div className="site-checkbox-all-wrapper">
          <Checkbox
            indeterminate={checkbox.indeterminate}
            onChange={onCheckAllChange}
            checked={checkbox.checkAll}
          >
            Choose All Supplier
          </Checkbox>
        </div>
        <br />
        {/* <Checkbox.Group
          style={{ width: "100%" }}
          options={plainOptions}
          value={checkbox.checkedList}
          onChange={onChange}
        /> */}
        <Checkbox.Group style={{ width: "100%" }} onChange={onChange}>
          <Row>
            {plainOptions.map((option, index) => {
              return (
                <Col span={24} key={index}>
                  <Checkbox checked={checkbox.checkAll} value={option.id}>
                    {option.label}
                  </Checkbox>
                  <Divider />
                </Col>
              );
            })}
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
      <style jsx global>
        {`
          .ant-checkbox-group-item {
            display: block;
            margin-right: 0;
          }
        `}
      </style>
    </div>
  );
};

export default AdminBiddingCreateComponent;
