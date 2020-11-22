import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Pagination,
  Divider,
  Empty,
  Popover,
  Spin
} from 'antd';
import Search from 'antd/lib/input/Search';
import Router from 'next/router';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  getProductByCategory,
  GetProductByCategoryData,
  GetProductByCategoryError,
  getProductSuggest,
  GetProductSuggestData
} from '../stores/ProductState';
import CategoryHomePageComponent from './CategoryHomePageComponent';
import {
  DEFAULT_PAGING_INFO,
  getDefaultProductImage,
  getProductImage
} from '../utils';
const { Meta } = Card;

const connectToRedux = connect(
  createStructuredSelector({
    getProductByCategoryData: GetProductByCategoryData,
    getProductByCategoryError: GetProductByCategoryError,
    getProductSuggestData: GetProductSuggestData
  }),
  (dispatch) => ({
    getProductByCategory: (id, pageSize, pageIndex, name) =>
      dispatch(getProductByCategory(id, pageSize, pageIndex, name)),
    getProductSuggest: (pageIndex, pageSize) =>
      dispatch(getProductSuggest({ pageIndex, pageSize }))
  })
);

const ProductCard = ({ product }) => {
  return (
    <Popover
      id="popover-product-card"
      placement="rightTop"
      content={
        <i>
          <div
            dangerouslySetInnerHTML={{
              __html: product.description
            }}
          />
        </i>
      }
      title={product.productName}
    >
      <Card
        id="product-card"
        size="small"
        hoverable
        bordered={false}
        style={{ margin: 3, height: 419 }}
        cover={
          <img
            style={{
              padding: 8,
              maxHeight: 280,
              maxWidth: 280,
              margin: 'auto'
            }}
            alt="example"
            src={getProductImage(
              !!product.images && product.images.length > 0
                ? product.images[0]
                : getDefaultProductImage()
            )}
          />
        }
      >
        <Meta
          onClick={() => {
            Router.push(`/product-details?id=${product.id}`);
          }}
          title={product.productName}
        />

        <Divider />
        <Row justify="space-around">
          <span>Unit: {product.unitOfMeasure.description}</span>
          <Button
            onClick={() => {
              Router.push(`/buyer/rfq/create?productId=${product.id}`);
            }}
            size="small"
            type="primary"
          >
            Submit RFQ
          </Button>
        </Row>
      </Card>
    </Popover>
  );
};
const pageSize = 12;
const ProductListHomePageComponent = ({
  getProductByCategory,
  getProductByCategoryData,
  getProductByCategoryError,
  getProductSuggest,
  getProductSuggestData
}) => {
  const [currentCategorySelected, setCurrentCategorySelected] = useState({});
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [isCategorySelected, setIsCategorySelected] = useState(false);

  const onSelect = (selectedKeys, info) => {
    setIsCategorySelected(true);
    setCurrentCategorySelected({
      name: info.node.title,
      id: info.node.key
    });
    getProductByCategory(info.node.key, pageSize, 1, searchValue);
    setLoading(true);
  };

  useEffect(() => {
    if (!isCategorySelected) {
      getProductSuggest(pageIndex, pageSize);
    }
  }, [isCategorySelected, getProductSuggest, pageIndex]);

  useEffect(() => {
    if (
      (currentCategorySelected || {}).id &&
      (currentCategorySelected || {}).id !== 'all' &&
      isCategorySelected
    ) {
      getProductByCategory(
        (currentCategorySelected || {}).id,
        pageSize,
        pageIndex
      );
      setLoading(true);
      // setFirstCall(false);
    }
  }, [
    pageIndex,
    currentCategorySelected,
    getProductByCategory,
    isCategorySelected
  ]);

  useEffect(() => {
    setPageIndex(1);
  }, [currentCategorySelected]);

  useEffect(() => {
    if (getProductByCategoryError || getProductByCategoryData) {
      setLoading(false);
    }
  }, [getProductByCategoryData, getProductByCategoryError]);

  const onChange = (pageNumber) => {
    setPageIndex(pageNumber);
    getProductByCategory(
      (currentCategorySelected || {}).id,
      pageSize,
      pageNumber,
      searchValue
    );
    setLoading(true);
  };
  let productData = [],
    count = 0;
  if (!isCategorySelected) {
    if (getProductSuggestData) {
      productData = getProductByCategoryData.data;
      count = getProductByCategoryData.total;
    }
  } else {
    if (!!getProductByCategoryData) {
      productData = getProductByCategoryData.data;
      count = getProductByCategoryData.total;
    }
  }
  return (
    <div>
      <Row>
        <Col
          span={5}
          style={{
            background: 'white',
            boxShadow: '0 0 20px rgba(0,0,0,.1)',
            minHeight: 600,
            maxHeight: 1339,
            overflow: 'hidden',
            overflowY: 'auto'
          }}
        >
          <CategoryHomePageComponent
            setCurrentCategorySelected={setCurrentCategorySelected}
            onSelect={onSelect}
          />
        </Col>
        <Col span={19}>
          <Row>
            <Col span={24}>
              <Row justify="space-between" align="middle">
                <Col span={16} style={{ paddingLeft: 24 }}>
                  Products in {(currentCategorySelected || {}).name}
                </Col>
                <Col span={8}>
                  <Search
                    value={searchValue || ''}
                    onChange={(event) => setSearchValue(event.target.value)}
                    onSearch={(value) => {
                      setPageIndex(DEFAULT_PAGING_INFO.page);
                      !!value &&
                        getProductByCategory(
                          (currentCategorySelected || {}).id,
                          pageSize,
                          pageIndex,
                          value
                        );
                    }}
                    placeholder={`Search in ${
                      (currentCategorySelected || {}).name
                    }`}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Divider style={{ marginBottom: 8, marginTop: 8 }} />
            </Col>
            {loading ? (
              <Row
                justify="center"
                align="middle"
                style={{ height: 400, margin: 'auto' }}
              >
                <Spin />
              </Row>
            ) : productData && productData.length > 0 ? (
              productData.map((product, index) => (
                <Col span={6} sm={12} md={6} key={index}>
                  <ProductCard product={product} />
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Row justify="center">
                  <Empty />
                </Row>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
      <Row style={{ marginTop: 16 }} justify="end">
        <Pagination
          pageSize={pageSize}
          current={pageIndex}
          showSizeChanger={false}
          total={count}
          onChange={onChange}
        />
      </Row>
      <style jsx global>
        {`
          #popover-product-card {
            width: 360px;
          }
          #popover-product-card ul {
            padding-left: 8px;
            margin-bottom: 0px;
          }
          #popover-product-card ul li {
            list-style: outside;
          }
          #product-card ul {
            padding-left: 0px;
            margin-bottom: 0px;
          }

          #product-card .ant-card-meta-title {
            -webkit-line-clamp: 2;
            white-space: unset;
            display: -webkit-box;
            -webkit-box-orient: vertical;
          }
          #product-card.ant-card-hoverable {
            cursor: default;
          }
          #product-card .ant-card-meta-title:hover {
            cursor: pointer;
            text-decoration: underline;
          }
          #product-card .ant-card-meta {
            height: 50px;
          }
          #product-card .ant-card-cover {
            height: 280px;
          }
        `}
      </style>
    </div>
  );
};

export default connectToRedux(ProductListHomePageComponent);
