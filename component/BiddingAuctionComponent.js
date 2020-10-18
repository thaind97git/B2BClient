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
} from "antd";
import { ArrowUpOutlined, CaretRightOutlined } from "@ant-design/icons";
import { displayCurrency } from "../utils";
import {
  currencyFormatter,
  currencyParser,
  currencyValue,
} from "../libs/currencyFormatter";
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
  {
    title: "Rank",
    key: "rank",
    render: (text, record) => <Rank rank={record.rank} />,
  },
];

const data = [
  {
    no: 1,
    bid: displayCurrency(800000),
    total: displayCurrency(16000000),
    rank: 1,
  },
  {
    no: 2,
    bid: displayCurrency(780000),
    total: displayCurrency(15600000),
    rank: 5,
  },
  {
    no: 3,
    bid: displayCurrency(750000),
    total: displayCurrency(15000000),
    rank: 2,
  },
  {
    no: 4,
    bid: displayCurrency(740000),
    total: displayCurrency(14800000),
    rank: 3,
  },
  {
    no: 5,
    bid: displayCurrency(735000),
    total: displayCurrency(14700000),
    rank: 3,
  },
  {
    no: 6,
    bid: displayCurrency(730000),
    total: displayCurrency(14600000),
    rank: 4,
  },
  {
    no: 6,
    bid: displayCurrency(610000),
    total: displayCurrency(12200000),
    rank: 1,
  },
];

const unit = 20;
const BiddingAuctionComponent = () => {
  const [isPlaceBid, setIsPlaceBid] = useState(false);
  const [currentBid, setCurrentBid] = useState(750000);
  const [bidTemp, setBidTemp] = useState(0);
  const [totalLot, setTotalLot] = useState(unit * currentBid);
  const minimumChange = 600000;
  const maximumChange = 830000;
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
        <Panel
          header="Live Auction Feed"
          key="1"
          className="site-collapse-custom-panel"
        >
          <p>
            The Live Auction Feed will provide real-time notifications of
            messages and changes to the auction settings
          </p>
        </Panel>
      </Collapse>

      <Row justify="center">
        <Card bordered={false}>
          <Statistic
            title="Rank Notification"
            value={1}
            precision={0}
            valueStyle={{ color: "#3f8600" }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
      </Row>

      <Row gutter={16}>
        <Col md={12} sm={24}>
          <Descriptions title="Auction Information" bordered>
            <Descriptions.Item label="LOT NAME" span={3}>
              Apple Macbook Air 13 inches
            </Descriptions.Item>
            <Descriptions.Item label="QUANTITY x UNIT MEASURE (UOM)" span={3}>
              20 x Each
            </Descriptions.Item>
            <Descriptions.Item label="BID RANGE" span={3}>
              {isPlaceBid
                ? `${displayCurrency(minimumChange)} - ${displayCurrency(
                    maximumChange
                  )}`
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="YOUR BID PER UOM" span={3}>
              {isPlaceBid ? (
                <InputNumber
                  style={{ minWidth: 200 }}
                  min={minimumChange}
                  max={maximumChange}
                  formatter={currencyFormatter(currencyValue)}
                  parser={currencyParser}
                  onChange={(value) => {
                    setBidTemp(value);
                    setTotalLot(value * unit);
                  }}
                  prefix="đ"
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
