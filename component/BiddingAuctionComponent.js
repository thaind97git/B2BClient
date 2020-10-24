import React, { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Descriptions,
  InputNumber,
  Row,
  Space,
  Statistic,
  Table,
  List,
} from "antd";
import { ArrowUpOutlined, CaretRightOutlined } from "@ant-design/icons";
import { displayCurrency } from "../utils";
import {
  currencyFormatter,
  currencyParser,
  currencyValue,
} from "../libs/currencyFormatter";
import { uniqBy } from "lodash";
const { Panel } = Collapse;
const Rank = ({ rank }) => {
  let color;
  switch (rank) {
    case 1:
      color = "#52c41a";
      break;
    case 2:
      color = "#faad14";
      break;
    case 3:
      color = "#f5222d";
      break;
    default:
      color = "black";
      break;
  }
  return <Badge count={rank} style={{ backgroundColor: color }} />;
};
const columns = [
  {
    title: "No",
    dataIndex: "no",
    key: "no",
  },
  {
    title: "Bid Per UOM",
    dataIndex: "bid",
    key: "bid",
    render: (text, record) => ` ${record.bid}`,
  },
  {
    title: "Total Lot",
    dataIndex: "total",
    key: "total",
    render: (text, record) => `${record.total}`,
  },
  // {
  //   title: "Rank",
  //   key: "rank",
  //   render: (text, record) => <Rank rank={record.rank} />,
  // },
];

const data2 = [
  "12:40:00 A Supplier has bid 800,000 đ per product",
  "12:40:30 A Supplier has bid 790,000 đ per product",
  <b>12:41:10 You have bid 780,000 đ per product</b>,
  "12:41:30 A Supplier has bid 772,000 đ per product",
  <b>12:41:50 You have bid 765,000 đ per product</b>,
  "12:43:40 A Supplier has bid 764,000 đ per product",
  "12:45:10 A Supplier has bid 760,000 đ per product",
  <b>12:46:05 You have bid 740,000 đ per product</b>,
];

const data = [
  {
    no: 1,
    bid: displayCurrency(780000),
    total: displayCurrency(171600000),
  },
  {
    no: 2,
    bid: displayCurrency(765000),
    total: displayCurrency(168300000),
  },
  {
    no: 3,
    bid: displayCurrency(740000),
    total: displayCurrency(162800000),
  },
];

const unit = 220;
const BiddingAuctionComponent = () => {
  const [isPlaceBid, setIsPlaceBid] = useState(false);
  const [currentBid, setCurrentBid] = useState(780000);
  const [bidTemp, setBidTemp] = useState(0);
  const [totalLot, setTotalLot] = useState(unit * currentBid);
  const minimumChange = 700000;
  const maximumChange = 800000;
  return (
    <div>
      <Collapse
        bordered={false}
        defaultActiveKey={["1"]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        className="site-collapse-custom-collapse"
      >
        {/* <Panel
          header="Live Auction Feed"
          key="1"
          className="site-collapse-custom-panel"
        >
          <p>
            The Live Auction Feed will provide real-time notifications of
            messages and changes to the auction settings
          </p>
        </Panel> */}
        <Panel
          header="Live Reverse Auction Feed"
          key="1"
          className="site-collapse-custom-panel"
        >
          <div style={{ height: 200, overflowY: "scroll" }}>
            <List
              size="small"
              dataSource={data2}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </div>
        </Panel>
      </Collapse>

      <Row justify="center">
        <Card bordered={false} style={{ textAlign: "center" }}>
          <Statistic
            title="Lowest Bid"
            value={"772,000 đ"}
            precision={0}
            valueStyle={{ color: "#3f8600" }}
            // prefix={<ArrowUpOutlined />}
          />
        </Card>
      </Row>

      <Row gutter={16}>
        <Col md={12} sm={24}>
          <Descriptions title="Reverse Auction Information" bordered>
            <Descriptions.Item label="REVERSE AUCTION NAME" span={3}>
              IR Night Vision Hidden Camera Watch Sport - 24/10/2020
            </Descriptions.Item>
            <Descriptions.Item label="PRODUCT NAME" span={3}>
              IR Night Vision Hidden Camera Watch Sport Wear Watch Camera WIFI
            </Descriptions.Item>
            <Descriptions.Item label="QUANTITY x UNIT MEASURE (UOM)" span={3}>
              {unit} x Each
            </Descriptions.Item>
            <Descriptions.Item label="QUALIFICATION PRICE" span={3}>
              800.000 đ
            </Descriptions.Item>
            <Descriptions.Item label="BID RANGE" span={3}>
              {displayCurrency(minimumChange)} -{" "}
              {displayCurrency(maximumChange)}
            </Descriptions.Item>
            <Descriptions.Item label="YOUR BID PER UOM" span={3}>
              {isPlaceBid ? (
                <InputNumber
                  style={{ minWidth: 200 }}
                  min={minimumChange}
                  max={maximumChange}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/,*/g, "")}
                  onChange={(value) => {
                    setBidTemp(value);
                    setTotalLot(value * unit);
                  }}
                />
              ) : (
                `${displayCurrency(currentBid)}`
              )}
            </Descriptions.Item>
            <Descriptions.Item label="TOTAL LOT VALUE PLACED" span={3}>
              {`${displayCurrency(totalLot)}`}
            </Descriptions.Item>
            <Descriptions.Item label="YOUR RANK" span={3}>
              <Badge count={1} style={{ backgroundColor: "#52c41a" }} />
            </Descriptions.Item>
            <Descriptions.Item label="ENTER NEW BID" span={3}>
              {isPlaceBid ? (
                <Row>
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => {
                        setCurrentBid(bidTemp);
                        setIsPlaceBid(false);
                      }}
                    >
                      Submit
                    </Button>
                    <Button
                      danger
                      onClick={() => {
                        setTotalLot(unit * currentBid);
                        setIsPlaceBid(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Space>
                </Row>
              ) : (
                <Button onClick={() => setIsPlaceBid(true)}>Place Bid</Button>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col md={12} sm={24}>
          <Collapse defaultActiveKey="1">
            <Panel header="Your Bidding History" key="1">
              {/* <Empty /> */}
              <Table columns={columns} dataSource={data} />
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </div>
  );
};
export default BiddingAuctionComponent;
