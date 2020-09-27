import React from "react";
import { Tabs } from "antd";
import { ApartmentOutlined, ClusterOutlined } from "@ant-design/icons";
import BiddingComponent from "./BiddingComponent";

const { TabPane } = Tabs;

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
    title: "Apple Macbook Air 13 inches",
    category: "Digital Programing",
    startTime: getFeatureDate(1),
    owner: "John Smith",
    duration: 200,
  },
  {
    id: 2,
    title: "Apple Macbook Air 13 inches",
    category: "Digital",
    startTime: getFeatureDate(1),
    owner: "John Smith",
    duration: 500,
  },
  {
    id: 3,
    title: "Apple Macbook Air 13 inches",
    category: "Apple",
    startTime: getFeatureDate(1),
    owner: "John Smith",
    duration: 400,
  },
  {
    id: 4,
    title: "Apple Macbook Air 13 inches",
    category: "Digital Programing",
    startTime: getFeatureDate(1),
    owner: "John Smith",
    duration: 100,
  },
];

const SupplierBiddingComponent = () => {
  return (
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
        {BIDDING_INVITE.map((bidding, index) => (
          <BiddingComponent bidding={bidding} key={index} isInvitation={true} />
        ))}
      </TabPane>
      <TabPane
        tab={
          <span>
            <ClusterOutlined />
            Active events
          </span>
        }
        key="2"
      >
        {BIDDING_INVITE.map((bidding, index) => (
          <BiddingComponent bidding={bidding} key={index} />
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
          <BiddingComponent closed key={index} bidding={bidding} />
        ))}
      </TabPane>
    </Tabs>
  );
};

export default SupplierBiddingComponent;
