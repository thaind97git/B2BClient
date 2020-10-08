import { Button, Col, Divider, Row, Space, Typography, Upload } from "antd";
import React from "react";
import { R_PENDING } from "../enums/requestStatus";
import RequestStatusComponent from "./Utils/RequestStatusComponent";
const { Title } = Typography;
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
  preUnitPrice: "500,000 Vnd",
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
    details,
    attachments,
    certifi,
    shippingMethod,
    destination,
    leadTime,
    status,
  } = request || {};
  const AttachmentsDisplay = () => {
    return (
      <Upload
        showUploadList={{
          showPreviewIcon: false,
          showRemoveIcon: false,
        }}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={attachments}
        // onChange={onChange}
        // onPreview={onPreview}
      >
        {/* {fileList.length < 5 && '+ Upload'} */}
      </Upload>
    );
  };
  const leadTimeDisplay = `Ship in ${leadTime} day(s) after supplier receives the initial payment`;
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
      <DescriptionItem title="Preferred Unit Price" content={preUnitPrice} />
      <DescriptionItem title="Details" content={details} />
      <DescriptionItem title="Attachments" content={<AttachmentsDisplay />} />
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

export default RequestDetailsComponent;
