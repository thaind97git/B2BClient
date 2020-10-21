import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Pagination,
  Tree,
  Typography,
  Divider,
  Skeleton,
  Empty,
  Popover,
  Spin,
} from "antd";
import Search from "antd/lib/input/Search";
import Router from "next/router";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  getCategories,
  GetCategoriesDataSelector,
} from "../stores/CategoryState";
import {
  getProductByCategory,
  GetProductByCategoryData,
  GetProductByCategoryError,
} from "../stores/ProductState";
import { get } from "lodash/fp";
const { Meta } = Card;
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    categoryData: GetCategoriesDataSelector,
    getProductByCategoryData: GetProductByCategoryData,
    getProductByCategoryError: GetProductByCategoryError,
  }),
  (dispatch) => ({
    getCategories: () => dispatch(getCategories()),
    getProductByCategory: (id, pageSize, pageIndex) =>
      dispatch(getProductByCategory(id, pageSize, pageIndex)),
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
              __html: product.description,
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
              margin: "auto",
            }}
            alt="example"
            src={
              !!product.images && product.images.length > 0
                ? process.env.API_SERVER_URL +
                  "/api/Product/ProductImage/" +
                  product.images[0]
                : "/static/images/default_product_img.png"
            }
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
let tree = [];
const pageSize = 12;
const ProductListHomePageComponent = ({
  getCategories,
  categoryData,
  getProductByCategory,
  getProductByCategoryData,
  getProductByCategoryError,
}) => {
  const [currentCategorySelected, setCurrentCategorySelected] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const onSelect = (selectedKeys, info) => {
    setCurrentCategorySelected({
      name: info.node.title,
      id: info.node.key,
    });
  };

  useEffect(() => {
    if (!!categoryData) {
      const firstCate = get("[0]")(categoryData);
      setCurrentCategorySelected({
        name: firstCate.description,
        id: firstCate.id,
      });
    }
  }, [categoryData]);

  useEffect(() => {
    if (
      (currentCategorySelected || {}).id &&
      (currentCategorySelected || {}).id !== "all"
    ) {
      getProductByCategory(
        (currentCategorySelected || {}).id,
        pageSize,
        pageIndex
      );
      setLoading(true);
    }
  }, [currentCategorySelected, getProductByCategory, pageIndex]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    if (getProductByCategoryError || getProductByCategoryData) {
      setLoading(false);
    }
  }, [getProductByCategoryData, getProductByCategoryError]);
  if (!!categoryData) {
    const mapData = (categoryData) => {
      const resultTmp = categoryData.map((category) => {
        let obj = {};
        obj.title = category.description;
        obj.key = category.id;
        if (!category.isItem) {
          obj.children = mapData(category.subCategories);
        }
        return obj;
      });
      return resultTmp;
    };
    tree = mapData(categoryData);
  }
  const onChange = (pageNumber) => {
    setPageIndex(pageNumber);
  };
  let productData = [],
    totalPage = 0;
  if (!!getProductByCategoryData) {
    productData = getProductByCategoryData.data;
    totalPage = getProductByCategoryData.total;
  }
  return (
    <div>
      <Row>
        <Col
          span={5}
          style={{
            background: "white",
            boxShadow: "0 0 20px rgba(0,0,0,.1)",
            minHeight: 600,
            maxHeight: 1339,
            overflow: "hidden",
            overflowY: "auto",
          }}
        >
          <Row>
            <Title level={4} style={{ padding: "16px 0px 8px 16px" }}>
              ALL CATEGORIES
            </Title>
          </Row>
          <Row>
            {tree.length === 0 ? (
              <Skeleton active />
            ) : (
              <Tree
                style={{ height: "100%" }}
                defaultCheckedKeys={get("[0].id")(categoryData)}
                defaultSelectedKeys={[get("[0].id")(categoryData)]}
                onSelect={onSelect}
                treeData={tree}
              />
            )}
          </Row>
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
                    value={searchValue || ""}
                    onChange={(event) => setSearchValue(event.target.value)}
                    // onSearch={(value) =>
                    //   getProductByCategory(
                    //     (currentCategorySelected || {}).id,
                    //     pageSize,
                    //     pageIndex,
                    //     value
                    //   )
                    // }
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
                style={{ height: 400, margin: "auto" }}
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
          showSizeChanger={false}
          showQuickJumper
          // defaultCurrent={2}
          total={totalPage}
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
