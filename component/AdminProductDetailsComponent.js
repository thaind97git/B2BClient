import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Empty,
  Row,
  Skeleton,
  Space,
  Typography,
  Image,
} from "antd";
import {
  getProductDetails,
  GetProductDetailsData,
  GetProductDetailsError,
  GetProductDetailsResetter,
} from "../stores/ProductState";
import { get } from "lodash/fp";
import { connect } from "react-redux";
import Router from "next/router";
import { createStructuredSelector } from "reselect";
import { fallbackImage, getProductImage } from "../utils";
const { Title } = Typography;
const connectToRedux = connect(
  createStructuredSelector({
    productDetailData: GetProductDetailsData,
    productDetailError: GetProductDetailsError,
  }),
  (dispatch) => ({
    getProduct: (id) => dispatch(getProductDetails(id)),
    resetData: () => dispatch(GetProductDetailsResetter),
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
const AdminProductDetailsComponent = ({
  getProduct,
  productDetailData,
  productDetailError,
  productID,
  resetData,
  isSupplier = false,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  useEffect(() => {
    if (productID) {
      getProduct(productID);
    }
  }, [productID, getProduct]);

  useEffect(() => {
    if (productDetailError || productDetailData) {
      setLoading(false);
    }
  }, [productDetailData, productDetailError]);

  if (loading) {
    return <Skeleton active />;
  }
  if (!productDetailData) {
    return (
      <Empty
        style={{ padding: "180px 0px" }}
        description="Can not find any product !"
      />
    );
  }
  return (
    <Row style={{ width: "100%" }}>
      <link
        rel="stylesheet"
        type="text/css"
        href="/static/assets/image-gallery.css"
      />
      {!isSupplier && (
        <Col span={24} style={{ marginBottom: 12 }}>
          <Space>
            <Button
              onClick={() => {
                Router.push(`/admin/product/update?id=${productID}`);
              }}
              size="small"
              label="Edit"
            >
              Edit
            </Button>
          </Space>
        </Col>
      )}
      <Col span={24}>
        <Title level={5}>Product Basic Information</Title>
      </Col>
      <DescriptionItem
        title="Product Name"
        content={(productDetailData || {}).productName}
      />
      <DescriptionItem
        title="Unit of measure"
        content={get("unitOfMeasure.description")(productDetailData)}
      />
      <DescriptionItem
        title="Description"
        content={
          <div
            dangerouslySetInnerHTML={{
              __html: (productDetailData || {}).description,
            }}
          />
        }
      />
      <Col span={24}>
        <Title level={5}>Product Image</Title>
      </Col>
      <Col span={24} justify="space-between">
        {productDetailData.images ? (
          productDetailData.images.map((image) => (
            <Col span={8}>
              <Image src={getProductImage(image)} fallback={fallbackImage} />
            </Col>
          ))
        ) : (
          <Image
            width={200}
            height={200}
            src="error"
            fallback={fallbackImage}
          />
        )}
      </Col>
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
export default connectToRedux(AdminProductDetailsComponent);
