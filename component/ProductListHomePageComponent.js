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
} from "antd";
import Search from "antd/lib/input/Search";
import Router from "next/router";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  getCategories,
  GetCategoriesDataSelector,
} from "../stores/CategoryState";
const { Meta } = Card;
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    categoryData: GetCategoriesDataSelector,
  }),
  (dispatch) => ({
    getCategories: () => dispatch(getCategories()),
  })
);

const PRODUCT_DATA = [
  {
    productName: "Iphone 8 Plus 64Gb",
    unit: "Units",
    description: "This is the description",
    image:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  },
  {
    productName: "Iphone 8 Plus 64Gb",
    unit: "Units",
    description: "This is the description",
    image:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  },
  {
    productName: "Iphone 8 Plus 64Gb",
    unit: "Units",
    description: "This is the description",
    image:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  },
  {
    productName: "Iphone 8 Plus 64Gb",
    unit: "Units",
    description: "This is the description",
    image:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  },
  {
    productName: "Iphone 8 Plus 64Gb",
    unit: "Units",
    description: "This is the description",
    image:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  },
  {
    productName: "Iphone 8 Plus 64Gb",
    unit: "Units",
    description: "This is the description",
    image:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  },
  {
    productName: "Iphone 8 Plus 64Gb",
    unit: "Units",
    description: "This is the description",
    image:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  },
];
const ProductCard = ({ product }) => {
  return (
    <Card
      size="small"
      hoverable
      bordered={false}
      style={{ margin: 3 }}
      cover={<img style={{ padding: 8 }} alt="example" src={product.image} />}
    >
      <Meta
        title={
          <Tooltip title={product.productName}>{product.productName}</Tooltip>
        }
        description={
          <Tooltip title={product.description}>{product.description}</Tooltip>
        }
      />
      <Divider />
      <Row justify="space-around">
        <span>Unit: {product.unit}</span>
        <a target="_blank" href="/buyer/rfq/create?productId=1">
          <Button
            onClick={() => {
              Router.push(``);
            }}
            size="small"
            type="primary"
          >
            Submit RFQ
          </Button>
        </a>
      </Row>
    </Card>
  );
};
function onChange(pageNumber) {
  console.log("Page: ", pageNumber);
}
let tree = [];
const allCateTree = {
  title: "All Category",
  key: "all",
};
const ProductListHomePageComponent = ({
  productList = PRODUCT_DATA,
  getCategories,
  categoryData,
}) => {
  const [currentCategorySelected, setCurrentCategorySelected] = useState({
    name: allCateTree.title,
    id: allCateTree.key,
  });
  const onSelect = (selectedKeys, info) => {
    setCurrentCategorySelected({
      name: info.node.title,
      id: info.node.key,
    });
  };

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
    tree.unshift(allCateTree);
  }
  return (
    <div>
      <Row>
        <Col
          span={5}
          style={{ background: "white", boxShadow: "0 0 20px rgba(0,0,0,.1)" }}
        >
          <Row>
            <Title level={4} style={{ padding: "16px 0px 8px 16px" }}>
              ALL CATEGORIES
            </Title>
          </Row>
          <Row>
            <Tree
              style={{ height: "100%" }}
              defaultCheckedKeys={"all"}
              defaultSelectedKeys={["all"]}
              onSelect={onSelect}
              treeData={tree}
            />
          </Row>
        </Col>
        <Col span={19}>
          <Row>
            <Col span={24}>
              <Row justify="space-between" align="middle">
                <Col span={16} style={{ paddingLeft: 24 }}>
                  Products in {currentCategorySelected.name}
                </Col>
                <Col span={8}>
                  <Search
                    placeholder={`Search in ${currentCategorySelected.name}`}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Divider style={{ marginBottom: 8, marginTop: 8 }} />
            </Col>
            {productList.map((product, index) => (
              <Col span={6} sm={12} md={6} key={index}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Row style={{ marginTop: 16 }} justify="end">
        <Pagination
          showQuickJumper
          defaultCurrent={2}
          total={500}
          onChange={onChange}
        />
      </Row>
    </div>
  );
};

export default connectToRedux(ProductListHomePageComponent);
