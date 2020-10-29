import { Button, Select, Drawer, Row, Typography } from "antd";
import Link from "next/link";
import React, { Fragment, useState, useEffect } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE, displayCurrency } from "../utils";
import { createLink } from "../libs";
import AllCategoryComponent from "./AllCategoryComponent";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  getProductPaging,
  GetProductPagingData,
  GetProductPagingError,
} from "../stores/ProductState";
import AdminProductDetailsComponent from "./AdminProductDetailsComponent"
import { get } from "lodash/fp";
const { Option, OptGroup } = Select;
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    productPagingData: GetProductPagingData,
    productPagingError: GetProductPagingError,
  }),
  (dispatch) => ({
    getProduct: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange,
      category
    ) => {
      dispatch(
        getProductPaging({
          pageIndex,
          pageSize,
          categoryID: category,
          productName: searchMessage
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
  {
    title: "Date Created",
    dataIndex: "dateCreated",
    key: "dateCreated",
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
  },
];
function handleChange(value) {
  console.log(`selected ${value}`);
}
const AdminProductManagementComponent = ({
  productPagingData,
  productPagingError,
  getProduct
}
) => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [openDetails, setOpenDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [currentProductSelected, setCurrentProductSelected] = useState({});

  function handleChange(value) {
    setCategory(value);
  }

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
        dateCreated: "30/09/2020 02:07:26 PM",
        actions:
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
        ,
      }))
    );
  };

  let productData = [],
    totalCount = 0;
  if (productPagingData) {
    productData = productPagingData.data;
    totalCount = productPagingData.total;
  }
  getProductPaging({});
  // const dataSource = [
  //   {
  //     key: "1",
  //     name: "Apple Watch Sport Band (44mm) - Cyprus Green - Regular",
  //     category: "Mobile Phone",
  //     unit: "units",
  //     dateCreated: "30/09/2020 02:07:26 PM",
  //     actions: <Link href="#">View</Link>,
  //   },
  //   {
  //     key: "2",
  //     name: "Sally Hansen Xtreme Wear Daycream",
  //     category: "Cords",
  //     unit: "Chains",
  //     dateCreated: "30/09/2020 02:07:26 PM",
  //     actions: <Link href="#">View</Link>,
  //   },
  //   {
  //     key: "3",
  //     name: "BEST PENTIUM PRO GOLD CERAMIC CPU SCRAP / HIGH GRADE CPU SCRAP",
  //     category: "CPUs",
  //     unit: "units",
  //     dateCreated: "30/09/2020 02:07:26 PM",
  //     actions: <Link href="#">View</Link>,
  //   },
  //   {
  //     key: "4",
  //     name: "Factory price is high quality and cheap Single Head Cutting Saw",
  //     category: "Building Material Making Machinery Parts",
  //     unit: "units",
  //     dateCreated: "30/09/2020 02:07:26 PM",
  //     actions: <Link href="#">View</Link>,
  //   },
  //   {
  //     key: "5",
  //     name:
  //       "7Inch 2 din touch screen Car Multimedia MP5 player with Bluetooth functions",
  //     category: "Auto Electrical Systems",
  //     unit: "Pieces",
  //     dateCreated: "30/09/2020 02:07:26 PM",
  //     actions: <Link href="#">View</Link>,
  //   },
  // ];
  return (
    <div>
      <Row justify="space-between">
        <Title level={4}>Product List</Title>
        <Button onClick={() => { }} type="primary">
          <a href="/admin/product/create">Create new product</a>
        </Button>
      </Row>
      <ReactTableLayout
        dispatchAction={getProduct}
        searchProps={{
          placeholder: "Search by product name",
          searchMessage,
          setSearchMessage,
          exElement: (
            <Fragment>
              <AllCategoryComponent
                onGetLastValue={(value) => setCategory(value)}
                size="large"
                isSearchStyle={false} />
            </Fragment>
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
            setOpenDetails={setOpenDetails}
            productId={(currentProductSelected || {}).id}
          />
        ) : null}
      </Drawer>
    </div>
  );
};
export default connectToRedux(AdminProductManagementComponent);
