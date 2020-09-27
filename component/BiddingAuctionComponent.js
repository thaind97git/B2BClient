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
  console.log({ color });
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
    render: (text, record) => `$ ${record.bid}.00`,
  },
  {
    title: "Total Lot",
    dataIndex: "total",
    key: "total",
    render: (text, record) => `$ ${record.total}.00`,
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
    bid: 55,
    total: 800,
    rank: 1,
  },
  {
    no: 2,
    bid: 53,
    total: 800,
    rank: 5,
  },
  {
    no: 3,
    bid: 51,
    total: 800,
    rank: 2,
  },
  {
    no: 4,
    bid: 48,
    total: 800,
    rank: 3,
  },
  {
    no: 5,
    bid: 47,
    total: 800,
    rank: 3,
  },
  {
    no: 6,
    bid: 45,
    total: 800,
    rank: 4,
  },
];

const unit = 20;
const BiddingAuctionComponent = () => {
  const [isPlaceBid, setIsPlaceBid] = useState(false);
  const [currentBid, setCurrentBid] = useState(85);
  const [bidTemp, setBidTemp] = useState(0);
  const [totalLot, setTotalLot] = useState(unit * currentBid);
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
            title="Your Rank"
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
              {isPlaceBid ? "$ 45.00 - $ 89.55" : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="YOUR BID PER UOM" span={3}>
              {isPlaceBid ? (
                <InputNumber
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={(value) => {
                    setBidTemp(value);
                    setTotalLot(value * unit);
                  }}
                  prefix="$"
                />
              ) : (
                `$ ${currentBid}.00`
              )}
            </Descriptions.Item>
            <Descriptions.Item label="TOTAL LOT VALUE PLACED" span={3}>
              {`$ ${totalLot}.00`}
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
