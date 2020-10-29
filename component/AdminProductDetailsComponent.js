import React, { Fragment, useState, useEffect } from "react";
import {
    Button,
    Col,
    Divider,
    Empty,
    Modal,
    Row,
    Skeleton,
    Space,
    Tag,
    Typography
} from "antd";
import ImageGallery from "react-image-gallery";
import {
    getProductDetails,
    GetProductDetailsData,
    GetProductDetailsError,
} from "../stores/ProductState";
import { get } from "lodash/fp";
import { connect } from "react-redux";
import Router from "next/router";
import { createStructuredSelector } from "reselect";
const { Title } = Typography;
const connectToRedux = connect(
    createStructuredSelector({
        productDetailData: GetProductDetailsData,
        productDetailError: GetProductDetailsError,
    }),
    (dispatch) => ({
        getProduct: (id) => dispatch(getProductDetails(id)),
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
    productID
}) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getProduct(productID);
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
            <Col span={24}>
                <Space>
                    <Button
                        onClick={() => {
                            // typeof button.action === "function" && button.action();
                        }}
                        size="small"
                        label="Edit"
                        action={() =>
                            Router.push(
                                ``
                            )}
                    >
                        Edit
                    </Button>
                </Space>
            </Col>
            <Col span={24}>
                <Title level={5}>Product Image</Title>
            </Col>
            <Col span={24}>
            <ImageGallery
                items={
                    productDetailData.images
                        ? productDetailData.images.map((image) => ({
                            original: `${process.env.API_SERVER_URL}/api/Product/ProductImage/${image}`,
                            thumbnail: `${process.env.API_SERVER_URL}/api/Product/ProductImage/${image}`,
                        }))
                        : [
                            {
                                original: `/static/images/default_product_img.jpg`,
                                thumbnail: `/static/images/default_product_img.jpg`,
                            },
                        ]
                }
                showPlayButton={false}
                autoPlay={false}
            />
            </Col>
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
                content={(productDetailData || {}).description}
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
        </Row>)
}
export default connectToRedux(AdminProductDetailsComponent);