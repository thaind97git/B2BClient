import { Row, Col, Typography, Divider, Button, Badge, Tag, Space } from "antd";
import {
  ClockCircleOutlined,
  EditOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import React from "react";
import Moment from "react-moment";
import Router from "next/router";
const { Title } = Typography;
const styles = {
  root: {
    padding: "0px 8px",
  },
  detailSection: {
    paddingLeft: 8,
  },
  labelInfo: {
    textAlign: "left",
  },
  buttonAction: {
    margin: "2px 4px",
  },
};

const getDurationWithMinutes = (minutes) => {
  let unit = minutes;
  let label = " Minutes";
  let subUnit = 0;
  let subLabel = "";
  if (minutes < 0) {
    return null;
  }
  if (minutes === 1) {
    label = " Minute";
  }
  if (minutes >= 60 && minutes < 1440) {
    const tmp = Math.floor(minutes / 60);
    unit = tmp;
    label = tmp === 1 ? " Hour" : " Hours";
    subUnit = minutes - tmp * 60;
    subLabel = " Minutes";
  } else if (minutes >= 1440) {
    const tmp = Math.floor(minutes / 60 / 24);
    unit = tmp;
    label = tmp === 1 ? " Day" : " Days";
    subUnit = minutes - tmp * 60 * 24;
    subLabel = " Hours";
  }
  return `${unit + label} ${subUnit > 0 ? subUnit + subLabel : ""}`;
};

// const BiddingLayout = ({ isClosed, children }) => {
//   return isClosed ? (
//     <Fragment>{children}</Fragment>
//   ) : (
//     <Badge.Ribbon placement="end" text="Tomorrow"></Badge.Ribbon>
//   );
// };

const SupplierBiddingItemComponent = ({
  bidding = {},
  isInvitation = false,
  closed = false,
}) => {
  const { id, title, category, startTime, duration, owner, currency } = bidding;
  return (
    <div style={styles.root}>
      <Badge.Ribbon
        color={closed && "red"}
        placement="end"
        text={closed ? "Closed" : "Tomorrow"}
      >
        <Row className="bidding-item" align="middle">
          <Col style={styles.detailSection} md={15} sm={24}>
            <Title className="title" level={4}>
              {title}
            </Title>
            {/* <div>Posted on September 14th, 2020 by admin</div> */}
            <div>
              Posted in{" "}
              <Tag color="processing">
                <Link href="">
                  <a>{category}</a>
                </Link>
              </Tag>
              {/* <Badge color="blue">
                <Link href="">
                  <a>{category}</a>
                </Link>
              </Badge> */}
            </div>
          </Col>
          <Col md={9} sm={24} style={{ marginTop: 24 }}>
            <Row>
              <Col span={6} style={styles.labelInfo}>
                <ClockCircleOutlined /> Start Time:
              </Col>
              <Col span={18}>
                <Moment format="LLL">{startTime}</Moment>
                {/* September 14th, 2020 14:00 GMT */}
              </Col>
            </Row>
            <Row>
              <Col span={6} style={styles.labelInfo}>
                <ClockCircleOutlined /> Duration:
              </Col>
              <Col span={18}> {getDurationWithMinutes(duration)} </Col>
            </Row>
            <Row>
              <Col span={6} style={styles.labelInfo}>
                <EditOutlined /> Host by:
              </Col>
              <Col span={18}> {owner}</Col>
              <Col span={6} style={styles.labelInfo}>
                <MoneyCollectOutlined /> Currency:
              </Col>
              <Col span={18}> {currency}</Col>
            </Row>
            <Row>
              {!closed && isInvitation && (
                <Space>
                  <Button
                    onClick={() => {
                      Router.push(`/member/bidding/details?id=${id}`);
                    }}
                    type="primary"
                    size="small"
                  >
                    Accept
                  </Button>
                  <Button type="ghost" danger size="small">
                    Decline
                  </Button>
                </Space>
              )}
              {!closed && !isInvitation && (
                <Space>
                  <Button
                    style={styles.buttonAction}
                    type="primary"
                    size="small"
                  >
                    Join to auction
                  </Button>
                </Space>
              )}
            </Row>
          </Col>
          <Divider />
        </Row>
      </Badge.Ribbon>
    </div>
  );
};

export default SupplierBiddingItemComponent;
