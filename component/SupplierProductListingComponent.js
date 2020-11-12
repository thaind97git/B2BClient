import { Button, Row, Typography, Tag, Col, Drawer, Modal } from "antd";
import {
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Router from "next/router";
import React, { useEffect, useState } from "react";
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
import AdminProductDetailsComponent from "./AdminProductDetailsComponent";
import {
  activeSupplierProduct,
  deleteSupplierProduct,
  DeleteSupplierProductData,
} from "../stores/SupplierState";
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    productBySupplierData: GetProductBySupplierData,
    productBySupplierError: GetProductBySupplierError,
    deleteSupplierProductData: DeleteSupplierProductData,
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
    deleteSupplierProduct: (id) => dispatch(deleteSupplierProduct(id)),
    activeSupplierProduct: (id) => dispatch(activeSupplierProduct(id)),
  })
);

const ProductStatus = ({ isDelete }) =>
  isDelete ? (
    <Tag color="error">Deactivated</Tag>
  ) : (
    <Tag color="success">Activated</Tag>
  );
const SupplierProductListingComponent = ({
  getProductBySupplier,
  productBySupplierData,
  deleteSupplierProduct,
  activeSupplierProduct,
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
        ),
        dateCreated: (
          <Moment format={DATE_TIME_FORMAT}>
            {new Date(product.dateCreated)}
          </Moment>
        ),
        status: <ProductStatus isDelete={product.isDeleted} />,
        action: product.isDeleted ? (
          <Button
            onClick={() => {
              Modal.confirm({
                title: "Do you want active this product?",
                icon: <ExclamationCircleOutlined />,
                okText: "Active",
                cancelText: "Cancel",
                onOk: () => {
                  activeSupplierProduct((product.product || {}).id);
                },
              });
            }}
            size="small"
            type="primary"
          >
            Active
          </Button>
        ) : (
          <Button
            onClick={() => {
              Modal.confirm({
                title: "Do you want deactive this product?",
                icon: <ExclamationCircleOutlined />,
                okText: "Deactive",
                cancelText: "Cancel",
                onOk: () => {
                  deleteSupplierProduct((product.product || {}).id);
                },
              });
            }}
            size="small"
            type="primary"
            danger
          >
            Deactive
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
      <Row justify="space-between">
        <Drawer
          width={640}
          title="Product Details"
          placement={"right"}
          closable={true}
          onClose={() => setOpenDetails(false)}
          visible={openDetails}
          key={"product-details"}
        >
          <AdminProductDetailsComponent
            isSupplier
            productID={(currentProductSelected || {}).id}
          />
        </Drawer>
      </Row>
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
              changeOnSelect
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
