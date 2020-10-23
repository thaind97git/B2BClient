import React, { Fragment } from "react";
import { Row, Select, Space, Tabs } from "antd";
import { ApartmentOutlined, ClusterOutlined } from "@ant-design/icons";
import SupplierBiddingItemComponent from "./SupplierBiddingItemComponent";

const { TabPane } = Tabs;
const { Option } = Select;

const getFeatureDate = (numberDate = 0) => {
  const timeInOneDay = 24 * 60 * 60 * 1000;
  const currentDate = new Date(
    new Date().getTime() + numberDate * timeInOneDay
  );
  return currentDate;
};

const BIDDING_INVITE = [
  {
    id: 1,
    title: "IR Night Vision Hidden Camera Watch Sport - 24/10/2020",
    category: "Action & Sports Camera",
    startTime: getFeatureDate(),
    owner: "John Smith",
    duration: 200,
    currency: "VND",
  },
  // {
  //   id: 2,
  //   title: "Jean for men",
  //   category: "Cloth",
  //   startTime: getFeatureDate(1),
  //   owner: "John Smith",
  //   duration: 500,
  //   currency: "VND",
  // },
  // {
  //   id: 3,
  //   title: "Iphone 12 Plus",
  //   category: "Iphone",
  //   startTime: Date.now(),
  //   owner: "John Smith",
  //   duration: 400,
  //   currency: "USD",
  // },
  // {
  //   id: 4,
  //   title: "Apple Macbook Air 15 inches",
  //   category: "Mackbook",
  //   startTime: getFeatureDate(1),
  //   owner: "John Smith",
  //   duration: 100,
  //   currency: "USD",
  // },
];
const BIDDING_INVITE2 = [
  {
    id: 1,
    title: "IR Night Vision Hidden Camera Watch Sport - 24/10/2020",
    category: "Action & Sports Camera",
    startTime: getFeatureDate(1),
    owner: "John Smith",
    duration: 200,
    currency: "VND",
  },
  // {
  //   id: 2,
  //   title: "Jean for men",
  //   category: "Cloth",
  //   startTime: getFeatureDate(1),
  //   owner: "John Smith",
  //   duration: 500,
  //   currency: "VND",
  // },
  // {
  //   id: 3,
  //   title: "Iphone 12 Plus",
  //   category: "Iphone",
  //   startTime: getFeatureDate(1),
  //   owner: "John Smith",
  //   duration: 400,
  //   currency: "USD",
  // },
  // {
  //   id: 4,
  //   title: "Apple Macbook Air 15 inches",
  //   category: "Mackbook",
  //   startTime: getFeatureDate(1),
  //   owner: "John Smith",
  //   duration: 100,
  //   currency: "USD",
  // },
];

const SupplierBiddingComponent = () => {
  return (
    <Fragment>
      <Row justify="end">
        <Space>
          <Select
            placeholder="Filter by category"
            style={{
              width: "200px",
              margin: "0 4px",
            }}
          >
            <Option value="c1">Category 1</Option>
            <Option value="c2">Category 2</Option>
            <Option value="c3">Category 3</Option>
            <Option value="c4">Category 4</Option>
          </Select>
          <Select
            placeholder="Sort by"
            style={{
              width: "200px",
              margin: "0 4px",
            }}
          >
            <Option value="new">Newest</Option>
            <Option value="old">Oldest</Option>
          </Select>
        </Space>
      </Row>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <ApartmentOutlined />
              Event invitations
            </span>
          }
          key="1"
        >
          {BIDDING_INVITE2.map((bidding, index) => (
            <SupplierBiddingItemComponent
              bidding={bidding}
              key={index}
              isInvitation={true}
            />
          ))}
        </TabPane>
        <TabPane
          tab={
            <span>
              <ClusterOutlined />
              Accepted events
            </span>
          }
          key="2"
        >
          {BIDDING_INVITE.map((bidding, index) => (
            <SupplierBiddingItemComponent bidding={bidding} key={index} />
          ))}
        </TabPane>
        <TabPane
          tab={
            <span>
              <ClusterOutlined />
              Closed events
            </span>
          }
          key="3"
        >
          {BIDDING_INVITE.map((bidding, index) => (
            <SupplierBiddingItemComponent
              closed
              key={index}
              bidding={bidding}
            />
          ))}
        </TabPane>
      </Tabs>
    </Fragment>
  );
};

export default SupplierBiddingComponent;
