import { Button, Row, Typography, Tag, Col } from "antd";
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
const { Title } = Typography;

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

const ProductStatus = ({ isDelete }) =>
  isDelete ? (
    <Tag color="error">De-Active</Tag>
  ) : (
    <Tag color="success">Active</Tag>
  );
const SupplierProductListingComponent = ({
  getProductBySupplier,
  productBySupplierData,
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
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  const getProductTable = (productData = []) => {
    return (
      productData &&
      productData.length > 0 &&
      productData.map((product = {}) => ({
        key: get("product.id")(product),
        productName: (
          <b
            onClick={() => {
              setCurrentProductSelected(product.product);
              setOpenDetails(true);
            }}
          >
            <a>{get("product.description")(product)}</a>
          </b>
          // <Button type="link">{get("product.description")(product)}</Button>
        ),
        dateCreated: (
          <Moment format={DATE_TIME_FORMAT}>
            {new Date(product.dateCreated)}
          </Moment>
        ),
        status: <ProductStatus isDelete={product.isDelete} />,
        action: product.isDelete ? (
          <Button
            onClick={() => {
              setCurrentProductSelected(product.product);
              setOpenDetails(true);
            }}
            size="small"
            type="primary"
          >
            Enable
          </Button>
        ) : (
          <Button
            onClick={() => {
              setCurrentProductSelected(product.product);
              setOpenDetails(true);
            }}
            size="small"
            type="primary"
            danger
          >
            Disable
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
        data={getProductTable(productData || [])}
        columns={columns}
        totalCount={totalCount}
      />
    </Row>
  );
};

export default connectToRedux(SupplierProductListingComponent);
