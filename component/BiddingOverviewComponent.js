import React, { Fragment } from 'react';
import { Card, Col, Empty, Row } from 'antd';
import Moment from 'react-moment';
import {
  DATE_TIME_FORMAT,
  displayCurrency,
  getUtcTime,
  timeConvert
} from '../utils';
const { Meta } = Card;
const BiddingOverviewComponent = ({ isSupplier = true, auction }) => {
  if (!auction) {
    return <Empty description="Can not find any event details" />;
  }
  const {
    description,
    auctionName,
    currency,
    product = {},
    auctionStartTime,
    dynamicClosePeriod = '0',
    minimumBidChange,
    maximumBidChange,
    minimumDuration,
    aggregator = {},
    quantity,
    currentPrice
  } = auction;
  const { firstName, lastName, email, phoneNumber } = aggregator;
  const { productName, unitOfMeasure = {} } = product;
  return (
    <div>
      <Card bordered={false}>
        <Meta
          title="Event Brief"
          description={
            <Row className="info">
              <Col span={24}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: description
                  }}
                />
              </Col>
            </Row>
          }
        />
      </Card>
      <Card bordered={false}>
        <Meta
          title="Host Contact Details"
          description={
            <Row>
              <Col span={24}>
                Name: <span className="info">{`${firstName} ${lastName}`}</span>
              </Col>
              <Col span={24}>
                E-mail: <span className="info">{email}</span>
              </Col>
              <Col span={24}>
                Phone: <span className="info">{phoneNumber}</span>
              </Col>
            </Row>
          }
        />
      </Card>
      <Card bordered={false}>
        <Meta
          title="Event"
          description={
            <Row>
              <Col span={24}>
                Event Name: <span className="info">{auctionName}</span>
              </Col>
              <Col span={24}>
                Event type: <span className="info">Online Reverse Auction</span>
              </Col>
              <Col span={24}>
                Currency: <span className="info">{currency}</span>
              </Col>
            </Row>
          }
        />
      </Card>

      <Card bordered={false}>
        <Meta
          title="Product Details"
          description={
            <Row>
              <Col span={24}>
                Product Name: <span className="info">{productName}</span>
              </Col>
              <Col span={24}>
                Quantity of UoM's:{' '}
                <span className="info">
                  {quantity} {unitOfMeasure.description}
                </span>
              </Col>
              <Col span={24}>
                Current Price:{' '}
                <span className="info">{displayCurrency(currentPrice)}</span>
              </Col>
            </Row>
          }
        />
      </Card>

      <Card bordered={false}>
        <Meta
          title="Auction Rules"
          description={
            <Row>
              <Col span={24}>
                Auction Start Time:{' '}
                <span className="info">
                  <Moment format={DATE_TIME_FORMAT}>
                    {getUtcTime(auctionStartTime)}
                  </Moment>
                </span>
              </Col>
              <Col span={24}>
                Bid Direction: <span className="info">Reverse</span>
              </Col>
              {/* <Col span={24}>
                Event type: <span className="info">Ranked</span>
              </Col> */}
              <Col span={24}>
                Minimum Duration:{' '}
                <span className="info">{timeConvert(minimumDuration)}</span>
              </Col>
              <Col span={24}>
                Dynamic Close Period:{' '}
                <span className="info">
                  {dynamicClosePeriod ? dynamicClosePeriod : 0}{' '}
                  {dynamicClosePeriod > 1 ? 'minutes' : 'minute'} which applies
                  to All bidders
                </span>
              </Col>
              {!isSupplier && (
                <Fragment>
                  <Col span={24}>
                    Minimum Bid Change:{' '}
                    <span className="info">{minimumBidChange} %</span>
                  </Col>
                  <Col span={24}>
                    Maximum Bid Change:{' '}
                    <span className="info">{maximumBidChange} %</span>
                  </Col>
                </Fragment>
              )}
            </Row>
          }
        />
      </Card>
      <style jsx>
        {`
          .info {
            color: rgba(0, 0, 0, 0.65);
          }
        `}
      </style>
    </div>
  );
};
export default BiddingOverviewComponent;
