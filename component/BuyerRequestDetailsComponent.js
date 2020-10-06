import { Button, Card, Descriptions, Row, Typography } from "antd";
import React, { Fragment } from "react";
import { R_PENDING } from "../enums/requestStatus";
const { Title } = Typography;
const BuyerRequestDetailsComponent = ({
  request = {
    title: "Iphone 12",
    formPrice: 60,
    toPrice: 80,
    category: "Apple",
    dateCreated: "30/09/2020 02:07:26 PM",
    status: R_PENDING,
  },
}) => {
  const { title, formPrice, toPrice, category, dateCreated, status } = request;
  return (
    <Fragment>
      <Row justify="space-between">
        {/* <Button type="primary" onClick={() => setIsOpenContact(true)}>
          Contact to Suppliers
        </Button> */}
      </Row>
      <Card
        title={<Title level={5}>Request Details</Title>}
        bordered={false}
        style={{ width: "100%" }}
      >
        {/* <Descriptions>
          <Descriptions.Item label="Category">{category}</Descriptions.Item>
          <Descriptions.Item label="Created date">
            {dateCreated}
          </Descriptions.Item>
          <Descriptions.Item label="Updated Date">
            {dateUpdated}
          </Descriptions.Item>
          <Descriptions.Item label="Reserve Auction ID">
            {reserveAuctionID}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <GroupStatusComponent status={status} />
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {description}
          </Descriptions.Item>
        </Descriptions> */}
      </Card>
    </Fragment>
  );
};

export default BuyerRequestDetailsComponent;
