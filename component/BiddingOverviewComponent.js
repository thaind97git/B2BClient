import React, { Fragment } from "react";
import { Card, Col, Row } from "antd";
const { Meta } = Card;
const BiddingOverviewComponent = ({ isSupplier = true }) => {
  return (
    <div>
      <Card bordered={false}>
        <Meta
          title="Event Brief"
          description={
            <Row className="info">
              <Col span={24}>We are looking to source 20 laptops.</Col>
              <Col span={24}>
                These must be delivered to our Ho Chi Minh office
              </Col>
              <Col span={24}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
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
                Name: <span className="info">John Smith</span>
              </Col>
              <Col span={24}>
                E-mail: <span className="info">thaind97.dev@gmail.com</span>
              </Col>
              <Col span={24}>
                Phone: <span className="info">123456789</span>
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
                Event Name:{" "}
                <span className="info">Apple Macbook Air 13 inches</span>
              </Col>
              <Col span={24}>
                Event type: <span className="info">Online Reverse Auction</span>
              </Col>
              <Col span={24}>
                Currency: <span className="info">VNĐ</span>
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
                Product Name:{" "}
                <span className="info">Macbook Air 13 inches</span>
              </Col>
              <Col span={24}>
                Quantity of UoM's: <span className="info">60 Units</span>
              </Col>
              {!isSupplier && (
                <Col span={24}>
                  Current Price: <span className="info">800.000 đ</span>
                </Col>
              )}
              <Col span={24}>
                Qualification Price: <span className="info">750.000 đ</span>
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
                Auction Start Time:{" "}
                <span className="info">September 28, 2020 12:39 PM</span>
              </Col>
              <Col span={24}>
                Bid Direction: <span className="info">Reverse</span>
              </Col>
              <Col span={24}>
                Event type: <span className="info">Ranked</span>
              </Col>
              <Col span={24}>
                Minimum Duration: <span className="info">30 minutes</span>
              </Col>
              <Col span={24}>
                Dynamic Close Period:{" "}
                <span className="info">
                  2 minutes which applies to All bidders
                </span>
              </Col>
              {!isSupplier && (
                <Fragment>
                  <Col span={24}>
                    Minimum Bid Change: <span className="info">10%</span>
                  </Col>
                  <Col span={24}>
                    Maximum Bid Change: <span className="info">10 %</span>
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
