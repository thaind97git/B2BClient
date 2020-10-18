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
  Tooltip,
  Skeleton,
  Empty,
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
} from "../stores/ProductState";
import { get } from "lodash/fp";
const { Meta } = Card;
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    categoryData: GetCategoriesDataSelector,
    getProductByCategoryData: GetProductByCategoryData,
  }),
  (dispatch) => ({
    getCategories: () => dispatch(getCategories()),
    getProductByCategory: (
      id = "13bad386-dcce-46eb-b4e2-09bbc32cd2e7",
      pageSize,
      pageIndex
    ) => dispatch(getProductByCategory(id, pageSize, pageIndex)),
  })
);

const PRODUCT_DATA = [
  {
    productName: "Smartphone iPhone 8 Plus 64GB",
    unit: "Units",
    description: "This is the description",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/40/e4/3e/827ec438bb9f66f61896f5b7cea6aef7.jpg",
  },
  {
    productName: "Smartphone iPhone 8 Plus 64GB",
    unit: "Units",
    description: "This is the description",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/40/e4/3e/827ec438bb9f66f61896f5b7cea6aef7.jpg",
  },
  {
    productName: "Smartphone iPhone 8 Plus 64GB",
    unit: "Units",
    description: "This is the description",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/40/e4/3e/827ec438bb9f66f61896f5b7cea6aef7.jpg",
  },
  {
    productName: "Smartphone iPhone 8 Plus 64GB",
    unit: "Units",
    description: "This is the description",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/40/e4/3e/827ec438bb9f66f61896f5b7cea6aef7.jpg",
  },
  {
    productName: "Smartphone iPhone 8 Plus 64GB",
    unit: "Units",
    description: "This is the description",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/40/e4/3e/827ec438bb9f66f61896f5b7cea6aef7.jpg",
  },
  {
    productName: "Smartphone iPhone 8 Plus 64GB",
    unit: "Units",
    description: "This is the description",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/40/e4/3e/827ec438bb9f66f61896f5b7cea6aef7.jpg",
  },
  {
    productName: "Smartphone iPhone 8 Plus 64GB",
    unit: "Units",
    description: "This is the description",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/40/e4/3e/827ec438bb9f66f61896f5b7cea6aef7.jpg",
  },
  {
    productName: "Smartphone iPhone 8 Plus 64GB",
    unit: "Units",
    description: "This is the description",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/40/e4/3e/827ec438bb9f66f61896f5b7cea6aef7.jpg",
  },
  {
    productName: "Smartphone iPhone 8 Plus 64GB",
    unit: "Units",
    description: "This is the description",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/40/e4/3e/827ec438bb9f66f61896f5b7cea6aef7.jpg",
  },
  {
    productName: "Smartphone iPhone 8 Plus 64GB",
    unit: "Units",
    description: "This is the description",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/40/e4/3e/827ec438bb9f66f61896f5b7cea6aef7.jpg",
  },
  {
    productName: "Smartphone iPhone 8 Plus 64GB",
    unit: "Units",
    description: "This is the description",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/40/e4/3e/827ec438bb9f66f61896f5b7cea6aef7.jpg",
  },
  {
    productName: "Smartphone iPhone 8 Plus 64GB",
    unit: "Units",
    description: "This is the description",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/40/e4/3e/827ec438bb9f66f61896f5b7cea6aef7.jpg",
  },
];
const ProductCard = ({ product }) => {
  return (
    <Card
      id="product-card"
      size="small"
      hoverable
      bordered={false}
      style={{ margin: 3, height: 424 }}
      cover={
        <img
          style={{ padding: 8, maxHeight: 280, maxWidth: 280, margin: "auto" }}
          alt="example"
          src={product.image || "/static/images/default_product_img.png"}
        />
      }
    >
      <Meta
        title={
          <Tooltip title={product.productName}>{product.productName}</Tooltip>
        }
        description={
          <Tooltip
            title={
              <div
                dangerouslySetInnerHTML={{
                  __html: product.description,
                }}
              />
            }
          >
            <div
              dangerouslySetInnerHTML={{
                __html: product.description.slice(0, 35) + "...",
              }}
            />
          </Tooltip>
        }
      />
      <Divider />
      <Row justify="space-around">
        <span>Unit: {product.unit}</span>
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
  );
};
let tree = [];
const allCateTree = {
  title: "All Category",
  key: "all",
};
const pageSize = 12;
const ProductListHomePageComponent = ({
  getCategories,
  categoryData,
  getProductByCategory,
  getProductByCategoryData,
}) => {
  const [currentCategorySelected, setCurrentCategorySelected] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
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
    if ((currentCategorySelected || {}).id !== "all") {
      getProductByCategory(
        (currentCategorySelected || {}).id,
        pageSize,
        pageIndex
      );
    }
  }, [currentCategorySelected, getProductByCategory, pageIndex]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);
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
    // tree.unshift(allCateTree);
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
            height: 1339,
            overflow: "hidden",
            overflowY: "scroll",
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
            {productData && productData.length > 0 ? (
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
          #product-card ul {
            padding-left: 0px;
            margin-bottom: 0px;
          }
        `}
      </style>
    </div>
  );
};

export default connectToRedux(ProductListHomePageComponent);
