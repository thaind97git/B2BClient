import {
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Badge,
  Tag,
  Space,
  Modal
} from 'antd';
import {
  ClockCircleOutlined,
  EditOutlined,
  MoneyCollectOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import React from 'react';
import Moment from 'react-moment';
import Router from 'next/router';
import { getBadgeAuctionLabel } from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  responseAuctionInvitation,
  ResponseAuctionInvitationData
} from '../stores/AuctionState';
const { Title } = Typography;
const styles = {
  root: {
    padding: '0px 8px'
  },
  detailSection: {
    paddingLeft: 8
  },
  labelInfo: {
    textAlign: 'left'
  },
  buttonAction: {
    margin: '2px 4px'
  }
};

const getDurationWithMinutes = (minutes) => {
  let unit = minutes;
  let label = ' Minutes';
  let subUnit = 0;
  let subLabel = '';
  if (minutes < 0) {
    return null;
  }
  if (minutes === 1) {
    label = ' Minute';
  }
  if (minutes >= 60 && minutes < 1440) {
    const tmp = Math.floor(minutes / 60);
    unit = tmp;
    label = tmp === 1 ? ' Hour' : ' Hours';
    subUnit = minutes - tmp * 60;
    subLabel = ' Minutes';
  } else if (minutes >= 1440) {
    const tmp = Math.floor(minutes / 60 / 24);
    unit = tmp;
    label = tmp === 1 ? ' Day' : ' Days';
    subUnit = minutes - tmp * 60 * 24;
    subLabel = ' Hours';
  }
  return `${unit + label} ${subUnit > 0 ? subUnit + subLabel : ''}`;
};

const connectToRedux = connect(
  createStructuredSelector({
    responseInvitationData: ResponseAuctionInvitationData
  }),
  (dispatch) => ({
    responseAuctionInvitation: (reverseAuctionId, isAccept, callback) =>
      dispatch(responseAuctionInvitation(reverseAuctionId, isAccept, callback))
  })
);

const SupplierBiddingItemComponent = ({
  bidding,
  isInvitation = false,
  closed = false,
  responseInvitationData,
  responseAuctionInvitation
}) => {
  if (!bidding) {
    return null;
  }
  const {
    id,
    auctionName,
    auctionStartTime,
    minimumDuration,
    aggregator = {},
    currency,
    product = {},
    dateCreated
  } = bidding || {};
  const { category = {} } = product;
  const { firstName, lastName } = aggregator;
  return (
    <div style={styles.root}>
      <Badge.Ribbon
        color={
          closed ? 'red' : auctionStartTime <= Date.now() ? 'blue' : 'gold'
        }
        placement="end"
        text={getBadgeAuctionLabel(auctionStartTime, closed)}
      >
        <Row className="bidding-item" align="middle">
          <Col style={styles.detailSection} md={15} sm={24}>
            <Title className="title" level={4}>
              {auctionName}
            </Title>
            <div>
              Posted on <Moment format="LLL">{dateCreated}</Moment>
            </div>
            <div>
              Posted in{' '}
              <Tag color="processing">
                <Link href="">
                  <a>{category.description}</a>
                </Link>
              </Tag>
            </div>
          </Col>
          <Col md={9} sm={24} style={{ marginTop: 24 }}>
            <Row>
              <Col span={6} style={styles.labelInfo}>
                <ClockCircleOutlined /> Start Time:
              </Col>
              <Col span={18}>
                <Moment format="LLL">{auctionStartTime}</Moment>
              </Col>
            </Row>
            <Row>
              <Col span={6} style={styles.labelInfo}>
                <ClockCircleOutlined /> Duration:
              </Col>
              <Col span={18}> {getDurationWithMinutes(minimumDuration)} </Col>
            </Row>
            <Row>
              <Col span={6} style={styles.labelInfo}>
                <EditOutlined /> Host by:
              </Col>
              <Col span={18}> {`${firstName} ${lastName}`}</Col>
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
                      Modal.confirm({
                        title: 'Do you want accept this event?',
                        okText: 'Accept',
                        cancelText: 'Close',
                        onOk: () => {
                          responseAuctionInvitation(id, true);
                        }
                      });
                    }}
                    type="primary"
                    size="small"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => {
                      Modal.confirm({
                        title: 'Do you want decline this event?',
                        okText: 'Decline',
                        cancelText: 'Close',
                        okButtonProps: {
                          danger: true
                        },
                        onOk: () => {
                          responseAuctionInvitation(id, false);
                        }
                      });
                    }}
                    type="ghost"
                    danger
                    size="small"
                  >
                    Decline
                  </Button>
                </Space>
              )}
              {!closed &&
                !isInvitation &&
                new Date(auctionStartTime) <= Date.now() && (
                  <Space>
                    <Button
                      style={styles.buttonAction}
                      onClick={() => {
                        Router.push(`/supplier/bidding/details?id=${id}`);
                      }}
                      type="primary"
                      size="small"
                    >
                      Join Event
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

export default connectToRedux(SupplierBiddingItemComponent);
