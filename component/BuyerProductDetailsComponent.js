import {
  Col,
  Divider,
  Row,
  Typography,
  Button,
  Empty,
  Tag,
  Skeleton
} from 'antd';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getProductDetails,
  GetProductDetailsData,
  GetProductDetailsError
} from '../stores/ProductState';
import { get } from 'lodash/fp';
import { getDefaultProductImage, getProductImage } from '../utils';

const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    productDetailData: GetProductDetailsData,
    productDetailError: GetProductDetailsError
  }),
  (dispatch) => ({
    getProduct: (id) => dispatch(getProductDetails(id))
  })
);

const DescriptionItem = ({ title, content }) => (
  <Col span={24}>
    <Row className="site-description-item-profile-wrapper">
      <Col span={5}>
        <p className="site-description-item-profile-p-label">{title}:</p>
      </Col>
      <Col span={19}>
        <b>{content}</b>
      </Col>
    </Row>
  </Col>
);

const BuyerProductDetailsComponent = ({
  getProduct,
  productDetailData,
  productDetailError
}) => {
  const router = useRouter();
  const id = router.query.id;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const mobileNav = document.getElementById("mobile-nav");
    // if (mobileNav) {
    //   document.body.removeChild(mobileNav);
    // }
    // const mobileNavToggle = document.getElementById("mobile-nav-toggle");
    // if (mobileNavToggle) {
    //   document.body.removeChild(mobileNavToggle);
    // }
  }, []);

  useEffect(() => {
    getProduct(id);
  }, [id, getProduct]);
  useEffect(() => {
    if (productDetailError || productDetailData) {
      setLoading(false);
    }
  }, [productDetailData, productDetailError]);

  if (loading) {
    return (
      <Row>
        <Col span={16}>
          <Skeleton active />
        </Col>
      </Row>
    );
  }

  if (!productDetailData) {
    return (
      <Empty
        style={{ padding: '180px 0px' }}
        description="Can not find any product !"
      />
    );
  }
  return (
    <Row id="buyer-product-details" justify="center">
      <link
        rel="stylesheet"
        type="text/css"
        href="/static/assets/image-gallery.css"
      />
      <Col span={16}>
        <Row
          style={{ paddingBottom: 24 }}
          justify="space-between"
          align="middle"
        >
          <Button
            onClick={() => {
              Router.push('/');
            }}
            type="link"
          >
            {' '}
            {'< Back to product list'}
          </Button>
        </Row>
        <Row>
          <Col span={9}>
            <ImageGallery
              items={
                productDetailData.images
                  ? productDetailData.images.map((image) => ({
                      original: `${getProductImage(image)}`,
                      thumbnail: `${getProductImage(image)}`
                    }))
                  : [
                      {
                        original: getDefaultProductImage(),
                        thumbnail: getDefaultProductImage()
                      }
                    ]
              }
              showPlayButton={false}
              autoPlay={false}
            />
          </Col>
          <Col span={1} align="middle">
            <Divider type="vertical" style={{ height: '78vh' }} />
          </Col>
          <Col span={14}>
            <Row justify="space-between" align="middle">
              <Title level={4}>{(productDetailData || {}).productName}</Title>
            </Row>
            {get('category.description')(productDetailData) && (
              <DescriptionItem
                title="Category"
                content={
                  <Tag color="processing">
                    {(productDetailData || {}).category.description}
                  </Tag>
                }
              />
            )}
            <DescriptionItem
              title="Unit"
              content={get('unitOfMeasure.description')(productDetailData)}
            />
            <Divider />
            <i>
              <div
                dangerouslySetInnerHTML={{
                  __html: (productDetailData || {}).description
                }}
              />
            </i>
            <Row>
              <Col style={{ margin: '60px 0px' }} span={6}>
                <Button
                  onClick={() => {
                    Router.push(
                      `/buyer/rfq/create?productId=${productDetailData.id}`
                    );
                  }}
                  size="middle"
                  type="primary"
                  style={{ width: '100%' }}
                >
                  Submit RFQ
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <style jsx global>
        {`
          #buyer-product-details {
            width: 100%;
            background: #fff;
            padding: 60px 0px;
          }
          #buyer-product-details ul li {
            list-style: inside;
          }
        `}
      </style>
    </Row>
  );
};
export default connectToRedux(BuyerProductDetailsComponent);
