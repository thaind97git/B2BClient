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
import {
  getBadgeAuctionLabel,
  getUtcTime,
  getUtcTimeWithoutFormat
} from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  responseAuctionInvitation,
  ResponseAuctionInvitationData
} from '../stores/AuctionState';
import { B_ACTIVE, B_DONE } from '../enums/biddingStatus';
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
    dateCreated,
    reverseAuctionStatus = {}
  } = bidding || {};
  const { category = {} } = product;
  const { firstName, lastName } = aggregator;
  return (
    <div style={styles.root}>
      <Badge.Ribbon
        color={
          reverseAuctionStatus.id === B_DONE
            ? 'green'
            : reverseAuctionStatus.id === B_ACTIVE
            ? 'blue'
            : closed
            ? 'red'
            : getUtcTime(auctionStartTime) <= Date.now()
            ? 'blue'
            : 'gold'
        }
        placement="end"
        text={getBadgeAuctionLabel(
          getUtcTime(auctionStartTime),
          closed,
          reverseAuctionStatus.id
        )}
      >
        <Row className="bidding-item" align="middle">
          <Col style={styles.detailSection} md={15} sm={24}>
            <Title className="title" level={4}>
              {auctionName}
            </Title>
            {/* <div>
              Posted on{' '}
              <Moment format="LLL">{getUtcTime(dateCreated, 'LLL')}</Moment>
            </div> */}
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
                <Moment format="LLL">
                  {getUtcTime(auctionStartTime, 'LLL')}
                </Moment>
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
                        title: 'Are you sure you want to accept this event?',
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
                        title: 'Are you sure you want to decline this event?',
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
                new Date(auctionStartTime) <= new Date(Date.now()) && (
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
