import { Col, Row, Typography } from "antd";
import React from "react";

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
const PRODUCT = {
  title: "Smartphone iPhone 8 Plus 64GB ",
  description: `<ul>
  <li >4.7-inch Retina HD display with True Tone</li>
  <li >IP67 water and dust resistant (maximum depth of 1 meter up to 30 minutes)</li>
  <li >12MP camera with OIS and 4K video</li>
  <li >7MP FaceTime HD camera with Retina Flash</li>
  <li >Touch ID for secure authentication and Apple Pay</li>
  <li >A11 Bionic with Neural Engine</li>
  <li >Wireless charging — works with Qi chargers</li>
  <li >iOS 12 with Screen Time, Group FaceTime, and even faster performance</li>
  <ul>`,
  unit: "Units",
  image:
    "https://salt.tikicdn.com/cache/280x280/ts/product/40/e4/3e/827ec438bb9f66f61896f5b7cea6aef7.jpg",
};
const ProductDetailComponent = ({ product = PRODUCT }) => {
  const { title, description, unit, image } = product;
  return (
    <Row style={{ width: "100%" }}>
      <Col style={{ padding: "12px 0px" }} span={24}>
        {/* Status: <RequestStatusComponent status={status} /> */}
      </Col>
      <Col span={24}>
        <Title level={5}>Product Information</Title>
      </Col>
      <DescriptionItem title="Product Name" content={title} />
      <DescriptionItem
        title="Description"
        content={
          <div
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        }
      />

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

export default ProductDetailComponent;
