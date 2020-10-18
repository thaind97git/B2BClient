import { Button, Col, Divider, Empty, Row, Space, Typography } from "antd";
import React, { Fragment, useEffect } from "react";
import {
  R_BIDDING,
  R_CANCELED,
  R_DONE,
  R_GROUPED,
  R_NEGOTIATING,
  R_ORDERED,
  R_PENDING,
  R_REJECTED,
  R_WAIT_FOR_AUCTION,
} from "../enums/requestStatus";
import RequestStatusComponent from "./Utils/RequestStatusComponent";
import { DATE_TIME_FORMAT, displayCurrency } from "../utils";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  getRequestDetails,
  GetRequestDetailsDataSelector,
} from "../stores/RequestState";
import Moment from "react-moment";
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

const getButtonActionsByStatus = (status) => {
  let result = [];
  switch (status) {
    case R_PENDING:
      result = [
        { label: "Edit" },
        { label: "Cancel", buttonProps: { danger: true } },
      ];
      break;
    case R_WAIT_FOR_AUCTION:
      result = [];
      break;
    case R_REJECTED:
      result = [];
      break;
    case R_ORDERED:
      result = [];
      break;
    case R_NEGOTIATING:
      result = [];
      break;
    case R_GROUPED:
      result = [];
      break;
    case R_DONE:
      result = [];
      break;
    case R_CANCELED:
      result = [];
      break;
    case R_BIDDING:
      result = [];
      break;

    default:
      break;
  }
  return result;
};

const RequestDetailsComponent = ({
  buttonActions = [],
  isSupplier = true,
  requestDetailsData,
  getRequestDetails,
  requestId,
}) => {
  useEffect(() => {
    if (requestId) {
      getRequestDetails(requestId);
    }
  }, [requestId, getRequestDetails]);
  if (!requestId) {
    return <Empty description="Can not find any request !" />;
  }
  const {
    product = {},
    currency = {},
    shippingMethod = {},
    sourcingType = {},
    sourcingPurpose = {},
    quantity,
    unit = "",
    tradeTerm = {},
    preferredUnitPrice,
    dueDate,
    description,
    certifi,
    leadTime,
    requestStatus = {},
    paymentTerm = {},
    district = {},
    ward = {},
    province = {},
    address,
  } = requestDetailsData || {};
  const leadTimeDisplay = `Ship in ${leadTime} day(s) after supplier receives the initial payment`;
  return (
    <Row style={{ width: "100%" }}>
      <Col style={{ padding: "12px 0px" }} span={24}>
        Status: <RequestStatusComponent status={requestStatus.id} />
      </Col>
      <Col style={{ padding: "12px 0px" }} span={24}>
        <Space>
          {(getButtonActionsByStatus(requestStatus.id) || []).map(
            (button, index) => (
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
            )
          )}
        </Space>
      </Col>
      <Col span={24}>
        <Title level={5}>Product Basic Information</Title>
      </Col>
      <DescriptionItem title="Product Name" content={product.description} />
      {/* <DescriptionItem title="Category" content={category} /> */}
      <DescriptionItem
        title="Sourcing Type"
        content={sourcingType.description}
      />
      <DescriptionItem
        title="Sourcing Purpose"
        content={sourcingPurpose.description}
      />
      <DescriptionItem title="Quantity" content={`${quantity} ${unit}`} />
      <DescriptionItem title="Trade Term" content={tradeTerm.description} />
      <DescriptionItem
        title="Preferred Unit Price"
        content={displayCurrency(preferredUnitPrice)}
      />
      <DescriptionItem
        title="Due Date"
        content={<Moment format={DATE_TIME_FORMAT}>{dueDate}</Moment>}
      />
      <DescriptionItem title="Descriptions" content={description} />
      <Divider />
      <Col span={24}>
        <Title level={5}>Supplier Capability</Title>
      </Col>
      <DescriptionItem title="Certifications" content={certifi} />
      <Divider />
      <Col span={24}>
        <Title level={5}>Shipping Capability</Title>
      </Col>
      <DescriptionItem
        title="Shipping Method"
        content={shippingMethod.description}
      />
      <DescriptionItem
        title="Destination"
        content={`${address} - ${(district || {}).description} - ${
          (ward || {}).description
        } - ${(province || {}).description}`}
      />
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
