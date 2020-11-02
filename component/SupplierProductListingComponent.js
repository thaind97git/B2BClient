import { Button, Row, Select, Typography, Badge, Tag, Col } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import Router from "next/router";
import React, { useState } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DATE_TIME_FORMAT, DEFAULT_DATE_RANGE } from "../utils";
import AllCategoryComponent from "./AllCategoryComponent";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  getProductBySupplier,
  GetProductBySupplierData,
  GetProductBySupplierError,
} from "../stores/ProductState";
import Moment from "react-moment";
import { get } from "lodash/fp";
const { Option } = Select;
const { Title } = Typography;
const LIST_PRODUCT = [
  {
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
  },
  {
    title: "Qiaodan basketball shoes low wear wear shock absorbing sneakers",
    description: `<ul>
    <li >Insole: textile.</li>
    <li >Material: Leather, synthetic and/or textile upper adds a midfoot strap for a secure fit.</li>
    <li >Sole: Synthetic</li>
    <li >Closure: Lace-Up</li>
    <ul>`,
    unit: "Units",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/78/af/fa/13279b32b80b8f6c02191effa89ecfed.jpg",
  },
  {
    title: "Sally Hansen Xtreme Wear Daycream",
    description: `<ul>
    <li >Xtreme Colour + Shine!</li>
    <li >Fun, trendy shades to match your mood.</li>
    <li >Sally Hansen Hard as Nails Xtreme Wear offers extreme strength and shine. Now with a new look &amp; feel! Match your manicure to your mood with fun, trendy shades. Collect them all and change your nail color as often as you like. Available in the hottest, most wanted shades. Long-lasting color is chip-resistant, fade-resistant and waterproof</li>
    <ul>`,
    unit: "Units",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/7e/8c/3b/63ff95d026b2cfe9725f6d66059e2a5d.jpg",
  },
  {
    title: "SMART WATCH T500 SERI 5",
    description: `<ul>
    <li >GPS</li>
    <li >Retina display</li>
    <li >Swimproof</li>
    <li >Optical heart sensor</li>
    <li >Store music, podcasts and audiobooks</li>
    <li >Elevation</li>
    <ul>`,
    unit: "Units",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/a3/4e/64/66b2694dd563e3c5e9e48a8f7216045c.jpg",
  },
  {
    title: "Apple Watch Sport Band (44mm) - Cyprus Green - Regular",
    description: `<ul>
    <li >Made from a custom high-performance fluoroelastomer, the Sport Band is durable and strong, yet surprisingly soft.</li>
    <li >The smooth, dense material drapes elegantly across your wrist and feels comfortable next to your skin.</li>
    <li >An innovative pin-and-tuck closure ensures a clean fit.</li>
    <ul>`,
    unit: "Units",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/9f/1f/1b/10e76ca677c4d8d080bb4be1e8491119.jpg",
  },
];

const connectToRedux = connect(
  createStructuredSelector({
    productBySupplierData: GetProductBySupplierData,
    productBySupplierError: GetProductBySupplierError,
  }),
  (dispatch) => ({
    getProductBySupplier: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange,
      category
    ) =>
      dispatch(
        getProductBySupplier({
          pageIndex,
          pageSize,
          productName: searchMessage,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
          category,
        })
      ),
  })
);
const SupplierProductListingComponent = ({
  getProductBySupplier,
  productBySupplierData,
  productBySupplierError,
}) => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [category, setCategory] = useState("all");
  const [openDetails, setOpenDetails] = useState(false);
  const [currentProductSelected, setCurrentProductSelected] = useState({});
  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Date Register",
      dataIndex: "dateCreated",
      key: "dateCreated",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },

    {
      title: "Details",
      dataIndex: "details",
      key: "details",
    },
  ];

  const DATA = LIST_PRODUCT.map((product) => {
    return {
      productName: product.title,
      dateCreated: "30/10/2020 2:02:00 PM",
      status: <Tag color="success">Active</Tag>,
      details: <Button type="link">Views</Button>,
    };
  });

  const getProductTable = (productData = []) => {
    return (
      productData &&
      productData.length > 0 &&
      productData.map((product = {}) => ({
        productId: get("product.id")(product),
        key: product.id,
        productName: product.name,
        quantity:
          +product.quantity || 0 + " " + get("product.unitType")(product),
        dueDate: (
          <Moment format={DATE_TIME_FORMAT}>{new Date(product.dueDate)}</Moment>
        ),
        status: <productStatusComponent status={product.productStatus.id} />,
        actions: (
          <Button
            onClick={() => {
              setCurrentProductSelected(product);
              setOpenDetails(true);
            }}
            size="small"
            type="link"
          >
            View
          </Button>
        ),
      }))
    );
  };

  let productData = [],
    totalCount = 0;
  if (productBySupplierData) {
    productData = productBySupplierData.data;
    totalCount = productBySupplierData.total;
  }

  return (
    <Row>
      <Col span={24}>
        <Row justify="space-between">
          <Title level={4}>Product Company Management</Title>
          <Button
            icon={<ShoppingCartOutlined />}
            onClick={() => Router.push("/supplier/product/register")}
            type="primary"
          >
            Register other product
          </Button>
        </Row>
      </Col>
      <ReactTableLayout
        dispatchAction={getProductBySupplier}
        searchProps={{
          placeholder: "Search by product name",
          searchMessage,
          setSearchMessage,
          exElement: (
            <AllCategoryComponent
              onGetLastValue={(value) => setCategory(value)}
              size="large"
              isSearchStyle={false}
            />
          ),
          exCondition: [category],
        }}
        dateRangeProps={{
          dateRange,
          setDateRange,
        }}
        data={DATA}
        columns={columns}
      />
    </Row>
  );
};

export default connectToRedux(SupplierProductListingComponent);
