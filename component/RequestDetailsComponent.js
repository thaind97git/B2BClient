import { Button, Col, Divider, Empty, Row, Space, Typography } from "antd";
import React, { Fragment, useEffect } from "react";
import { R_PENDING } from "../enums/requestStatus";
import RequestStatusComponent from "./Utils/RequestStatusComponent";
import { displayCurrency } from "../utils";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  getRequestDetails,
  GetRequestDetailsDataSelector,
} from "../stores/RequestState";
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    requestDetailsData: GetRequestDetailsDataSelector,
  }),
  (dispatch) => ({
    getRequestDetails: (id) => dispatch(getRequestDetails(id)),
  })
);

const DescriptionItem = ({ title, content }) => (
  <Col span={24}>
    <Row className="site-description-item-profile-wrapper">
      <Col span={8}>
        <p className="site-description-item-profile-p-label">{title}:</p>
      </Col>
      <Col span={16}>
        <b>{content}</b>
      </Col>
    </Row>
  </Col>
);
const requestDefault = {
  productName: "Iphone 6s",
  category: "Iphone",
  sourcingType: "Non-customized Product",
  sourcingPurpose: "Retail",
  quantity: "20",
  unit: "Units",
  tradeTerms: "FOB",
  preUnitPrice: 500000,
  dueDate: "30/10/2020 02:05:00 PM",
  details: "I really want to buy this product",
  attachments: [
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ],
  certifi: "ISO/TS16949",
  shippingMethod: "Express",
  destination: "Nguyễn Thị Minh Khai - Phường 2 - Q.1 - TP.HCM",
  leadTime: 4,
  status: R_PENDING,
};
const RequestDetailsComponent = ({
  request = requestDefault,
  buttonActions = [],
  isSupplier = true,
  requestDetailsData,
  getRequestDetails,
  requestId,
}) => {
  const {
    productName,
    category,
    sourcingType,
    sourcingPurpose,
    quantity,
    unit,
    tradeTerms,
    preUnitPrice,
    dueDate,
    details,
    certifi,
    shippingMethod,
    destination,
    leadTime,
    status,
  } = request || {};
  const leadTimeDisplay = `Ship in ${leadTime} day(s) after supplier receives the initial payment`;
  useEffect(() => {
    if (requestId) {
      getRequestDetails(requestId);
    }
  }, [requestId, getRequestDetails]);
  console.log({ requestDetailsData });
  if (!requestId) {
    return <Empty description="Can not find any request !" />;
  }
  return (
    <Row style={{ width: "100%" }}>
      <Col style={{ padding: "12px 0px" }} span={24}>
        Status: <RequestStatusComponent status={status} />
      </Col>
      <Col style={{ padding: "12px 0px" }} span={24}>
        <Space>
          {buttonActions.map((button, index) => (
            <Button
              key={index}
              onClick={() => {
                typeof button.actions === "function" && button.action();
              }}
              size="small"
              {...button.buttonProps}
            >
              {button.label}
            </Button>
          ))}
        </Space>
      </Col>
      <Col span={24}>
        <Title level={5}>Product Basic Information</Title>
      </Col>
      <DescriptionItem title="Product Name" content={productName} />
      <DescriptionItem title="Category" content={category} />
      <DescriptionItem title="Sourcing Type" content={sourcingType} />
      <DescriptionItem title="Sourcing Purpose" content={sourcingPurpose} />
      <DescriptionItem title="Quantity" content={`${quantity} ${unit}`} />
      <DescriptionItem title="Trade Term" content={tradeTerms} />
      <DescriptionItem
        title="Preferred Unit Price"
        content={displayCurrency(preUnitPrice)}
      />
      <DescriptionItem title="Due Date" content={dueDate} />
      <DescriptionItem title="Details" content={details} />
      <Divider />
      <Col span={24}>
        <Title level={5}>Supplier Capability</Title>
      </Col>
      <DescriptionItem title="Certifications" content={certifi} />
      <Divider />
      <Col span={24}>
        <Title level={5}>Shipping Capability</Title>
      </Col>
      <DescriptionItem title="Shipping Method" content={shippingMethod} />
      <DescriptionItem title="Destination" content={destination} />
      <DescriptionItem title="Lead Time" content={leadTimeDisplay} />
      {!isSupplier && (
        <Fragment>
          <Divider />
          <Col span={24}>
            <Title level={5}>RFQ Owner</Title>
          </Col>
          <DescriptionItem title="Created by" content="User 1" />
          <DescriptionItem title="Email" content="user1@gmail.com" />
          <DescriptionItem title="Phone" content="0123456789" />
        </Fragment>
      )}

      <style jsx global>{`
        .site-description-item-profile-wrapper {
          margin-bottom: 7px;
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          line-height: 1.5715;
        }

        [data-theme="compact"] .site-description-item-profile-wrapper {
          font-size: 24px;
          line-height: 1.66667;
        }

        .ant-drawer-body p.site-description-item-profile-p {
          display: block;
          margin-bottom: 16px;
          color: rgba(0, 0, 0, 0.85);
          font-size: 16px;
          line-height: 1.5715;
        }

        [data-theme="compact"]
          .ant-drawer-body
          p.site-description-item-profile-p {
          font-size: 14px;
          line-height: 1.66667;
        }

        .site-description-item-profile-p-label {
          display: inline-block;
          margin-right: 8px;
          color: rgba(0, 0, 0, 0.85);
        }
      `}</style>
    </Row>
  );
};

export default connectToRedux(RequestDetailsComponent);
