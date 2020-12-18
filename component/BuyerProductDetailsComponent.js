import {
  Col,
  Row,
  Button,
  Empty,
  Tag,
  Skeleton,
  Breadcrumb,
  Tooltip
} from 'antd';
import { ProfileOutlined } from '@ant-design/icons';
import Router, { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getProductDetails,
  GetProductDetailsData,
  GetProductDetailsError
} from '../stores/ProductState';
import { get } from 'lodash/fp';
import { getNounQuantity, getProductImage, getShortContent } from '../utils';

const connectToRedux = connect(
  createStructuredSelector({
    productDetailData: GetProductDetailsData,
    productDetailError: GetProductDetailsError
  }),
  (dispatch) => ({
    getProduct: (id) => dispatch(getProductDetails(id))
  })
);
const renderBreadcrumb = (categories = []) => {
  return [categories]?.map((category) => {
    return (
      <Fragment>
        <Breadcrumb.Item key={category.id}>
          <a href={`/home-category?categoryId=${category.id}`}>
            {category.description}
          </a>
        </Breadcrumb.Item>{' '}
        {category?.subCategory && renderBreadcrumb(category?.subCategory)}
      </Fragment>
    );
  });
};
const BuyerProductDetailsComponent = ({
  getProduct,
  productDetailData,
  productDetailError
}) => {
  const router = useRouter();
  const id = router.query.id;
  const [loading, setLoading] = useState(true);

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
    <Fragment>
      <section className="py-3">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="/">Home</a>
            </Breadcrumb.Item>
            {renderBreadcrumb(productDetailData.rootCategory || [])}
            <Breadcrumb.Item>
              <Tooltip title={productDetailData?.productName}>
                {getShortContent(productDetailData?.productName, 80)}
              </Tooltip>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </section>

      <section
        className="section-content bg-white padding-y"
        style={{ paddingTop: 32, paddingBottom: 160 }}
      >
        <div className="container">
          <div className="row">
            <aside className="col-md-6">
              <div className="card">
                <article className="gallery-wrap">
                  <div className="img-big-wrap">
                    <div>
                      {' '}
                      <a href="#">
                        <img
                          alt=""
                          src={getProductImage(productDetailData?.images?.[0])}
                        />
                      </a>
                    </div>
                  </div>
                  <div className="thumbs-wrap">
                    <a href="#" className="item-thumb">
                      <img
                        alt=""
                        src={getProductImage(productDetailData?.images?.[0])}
                      />
                    </a>
                  </div>
                </article>
              </div>
            </aside>
            <main className="col-md-6">
              <article className="product-info-aside">
                <h2 className="title mt-3">
                  {productDetailData?.productName}{' '}
                </h2>

                <div className="rating-wrap my-3">
                  <span className="text-muted d-flex align-items-center">
                    <img
                      src="/static/images/grouping.png"
                      alt="ordering"
                      width={18}
                    />{' '}
                    <span>&nbsp;</span>
                    {productDetailData?.orderingQuantity}
                    <span>&nbsp;</span>
                    <span>
                      {getNounQuantity(
                        productDetailData?.orderingQuantity,
                        productDetailData?.unitOfMeasure?.description
                      )}{' '}
                      Ordering in the system
                    </span>
                  </span>
                </div>

                <dl className="row">
                  <dt className="col-sm-3">Category</dt>
                  <dd className="col-sm-9">
                    <a href="#">
                      <Tag color="processing">
                        {(productDetailData || {}).category.description}
                      </Tag>
                    </a>
                  </dd>

                  <dt className="col-sm-3">Unit</dt>
                  <dd className="col-sm-9">
                    {get('unitOfMeasure.description')(productDetailData)}
                  </dd>
                </dl>
                <div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: (productDetailData || {}).description
                    }}
                  />
                </div>

                <div className="form-row  mt-4">
                  <div className="form-group col-md">
                    <Button
                      onClick={() => {
                        Router.push(
                          `/buyer/rfq/create?productId=${productDetailData.id}`
                        );
                      }}
                      size="middle"
                      type="primary"
                    >
                      Submit RFQ
                    </Button>
                  </div>
                </div>
              </article>
            </main>
          </div>
        </div>
      </section>
      {/* <Row id="buyer-product-details" justify="center">
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
      </Row> */}
    </Fragment>
  );
};
export default connectToRedux(BuyerProductDetailsComponent);
