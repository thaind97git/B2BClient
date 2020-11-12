import { Button, Drawer, Row, Typography } from "antd";
import React, { Fragment, useState, useEffect } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE } from "../utils";
import AllCategoryComponent from "./AllCategoryComponent";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  getProductPaging,
  GetProductPagingData,
  GetProductPagingError,
} from "../stores/ProductState";
import AdminProductDetailsComponent from "./AdminProductDetailsComponent";
import { get } from "lodash/fp";
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    productPagingData: GetProductPagingData,
    productPagingError: GetProductPagingError,
  }),
  (dispatch) => ({
    getProduct: (pageIndex, pageSize, searchMessage, dateRange, category) => {
      dispatch(
        getProductPaging({
          pageIndex,
          pageSize,
          categoryID: category,
          productName: searchMessage,
        })
      );
    },
  })
);

const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Unit of measure",
    dataIndex: "unit",
    key: "unit",
  },
  // {
  //   title: "Date Created",
  //   dataIndex: "dateCreated",
  //   key: "dateCreated",
  // },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
  },
];

const AdminProductManagementComponent = ({
  productPagingData,
  productPagingError,
  getProduct,
}) => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [openDetails, setOpenDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [currentProductSelected, setCurrentProductSelected] = useState({});

  useEffect(() => {
    if (productPagingError || productPagingData) {
      setLoading(false);
    }
  }, [productPagingError, productPagingData]);

  const getProductTable = (productData = []) => {
    return (
      productData &&
      productData.length > 0 &&
      productData.map((product = {}) => ({
        key: product.id,
        name: product.productName,
        category: get("category.description")(product),
        unit: get("unitOfMeasure.description")(product),
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
  if (productPagingData) {
    productData = productPagingData.data;
    totalCount = productPagingData.total;
  }

  return (
    <div>
      <Row justify="space-between">
        <Title level={4}>Product List</Title>
        <Button onClick={() => {}} type="primary">
          <a href="/admin/product/create">Create new product</a>
        </Button>
      </Row>
      <ReactTableLayout
        loading={loading}
        dispatchAction={getProduct}
        searchProps={{
          placeholder: "Search by product name",
          searchMessage,
          setSearchMessage,
          exElement: (
            <Fragment>
              <AllCategoryComponent
                changeOnSelect={true}
                onGetLastValue={(value) => setCategory(value)}
                size="large"
                isSearchStyle={false}
              />
            </Fragment>
          ),
          exCondition: [category],
          isDateRange: false,
        }}
        dateRangeProps={{
          dateRange,
          setDateRange,
        }}
        data={getProductTable(productData || [])}
        columns={columns}
        totalCount={totalCount}
      />
      <Drawer
        width={640}
        title="Product details"
        placement={"right"}
        closable={true}
        onClose={() => setOpenDetails(false)}
        visible={openDetails}
        key={"right"}
      >
        {openDetails ? (
          <AdminProductDetailsComponent
            // setOpenDetails={setOpenDetails}
            productID={(currentProductSelected || {}).id}
          />
        ) : null}
      </Drawer>
    </div>
  );
};
export default connectToRedux(AdminProductManagementComponent);
