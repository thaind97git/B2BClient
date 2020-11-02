import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Col,
  Drawer,
  Image,
  List,
  Modal,
  Pagination,
  Row,
  Skeleton,
  Typography,
} from "antd";
import AllCategoryComponent from "./AllCategoryComponent";
import Search from "antd/lib/input/Search";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  getProductPaging,
  GetProductPagingData,
  GetProductPagingError,
} from "../stores/ProductState";
import SupplierProductOptionComponent from "./SupplierProductOptionComponent";
import {
  DEFAULT_PAGING_INFO,
  doFunctionWithEnter,
  fallbackImage,
  getProductImage,
} from "../utils";
import { get, toString } from "lodash/fp";
import AdminProductDetailsComponent from "./AdminProductDetailsComponent";
import {
  supplierRegisterProduct,
  SupplierRegisterProductData,
  supplierUpdateQuotation,
  SupplierUpdateQuotationData,
} from "../stores/SupplierState";
const { Title } = Typography;
const connectToRedux = connect(
  createStructuredSelector({
    getProductPagingData: GetProductPagingData,
    getProductPagingError: GetProductPagingError,
    registerProductData: SupplierRegisterProductData,
    updateQuotationData: SupplierUpdateQuotationData,
  }),
  (dispatch) => ({
    getProductPaging: ({ categoryID, productName, pageSize, pageIndex }) =>
      dispatch(
        getProductPaging({
          categoryID,
          productName,
          pageIndex,
          pageSize,
        })
      ),
    supplierRegisterProduct: ({ productId, description }) =>
      dispatch(supplierRegisterProduct({ productId, description })),
    supplierUpdateQuotation: ({ id, description }) =>
      dispatch(supplierUpdateQuotation({ id, description })),
  })
);
const SupplierProductComponent = ({
  getProductPaging,
  getProductPagingData,
  getProductPagingError,
  registerProductData,
  supplierRegisterProduct,
  updateQuotationData,
  supplierUpdateQuotation,
}) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [category, setCategory] = useState("all");
  const [searchMessage, setSearchMessage] = useState("");
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGING_INFO.page);
  const pageSize = DEFAULT_PAGING_INFO.pageSize;
  const [firstLoad, setFirstLoad] = useState(true);
  const [currentProductSelected, setCurrentProductSelected] = useState(null);

  const [loading, setLoading] = useState(false);

  const [openOption, setOpenOption] = useState(false);
  const [quotations, setQuotations] = useState([]);
  useEffect(() => {
    if (registerProductData) {
      setOpenOption(false);
    }
  }, [registerProductData]);

  useEffect(() => {
    if (firstLoad) {
      setLoading(true);
      getProductPaging({
        categoryID: "",
        productName: "",
        pageIndex,
        pageSize,
      });
      setFirstLoad(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    getProductPaging({
      categoryID: category,
      productName: searchMessage,
      pageIndex,
      pageSize,
    });
  }, [category]);

  useEffect(() => {
    if (getProductPagingData || getProductPagingError) {
      setLoading(false);
    }
  }, [getProductPagingData, getProductPagingError]);

  let productData = [],
    totalCount = 0;
  if (getProductPagingData) {
    productData = getProductPagingData.data;
    totalCount = getProductPagingData.total;
  }

  return (
    <div>
      <Modal
        title="Create Quotations"
        centered
        visible={openOption}
        onOk={() => {
          console.log({ json: toString(quotations) });
          supplierRegisterProduct({
            productId: (currentProductSelected || {}).id,
            description: JSON.stringify(quotations),
          });
        }}
        onCancel={() => setOpenOption(false)}
        width={1000}
      >
        {openOption ? (
          <SupplierProductOptionComponent
            unitLabel={get("unitOfMeasure.description")(currentProductSelected)}
            onGetQuotation={(quotations) => {
              setQuotations(quotations);
            }}
          />
        ) : null}
      </Modal>
      <Drawer
        width={640}
        title="Product details"
        placement={"right"}
        closable={true}
        onClose={() => setOpenDetails(false)}
        visible={openDetails}
        key={"product-details"}
      >
        {openDetails ? (
          <AdminProductDetailsComponent
            isSupplier
            productID={(currentProductSelected || {}).id}
          />
        ) : null}
      </Drawer>
      <Row>
        <Col span={24}>
          <Row style={{ marginBottom: 32 }} justify="center">
            <Col span={22} id="search-product">
              <Title level={5}>Search product inside system</Title>
              <Search
                onChange={(event) => setSearchMessage(event.target.value)}
                value={searchMessage}
                addonBefore={
                  <AllCategoryComponent
                    changeOnSelect
                    onGetLastValue={(value) => {
                      setCategory(value);
                    }}
                  />
                }
                placeholder="Product name"
                enterButton="Search"
                size="large"
                onKeyPress={(event) =>
                  doFunctionWithEnter(event, () => {
                    setLoading(true);
                    getProductPaging({
                      categoryID: category,
                      productName: searchMessage,
                      pageSize,
                      pageIndex,
                    });
                  })
                }
                onSearch={(value) => {
                  if (value) {
                    setLoading(true);
                    getProductPaging({
                      categoryID: category,
                      productName: searchMessage,
                      pageSize,
                      pageIndex,
                    });
                  }
                  setSearchMessage(value);
                }}
              />
            </Col>
          </Row>
        </Col>
        {loading ? (
          <Skeleton active />
        ) : (
          <Fragment>
            <Col span={24}>
              <Row justify="center">
                <Col id="list-product-supplier" span={22}>
                  <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={productData || []}
                    renderItem={(item, index) => (
                      <List.Item
                        key={index}
                        actions={[
                          <div>
                            <b>{get("unitOfMeasure.description")(item)}</b>
                          </div>,
                          <Button
                            onClick={() => {
                              setCurrentProductSelected(item);
                              setOpenOption(true);
                            }}
                            size="small"
                            type="primary"
                          >
                            Register Sell product
                          </Button>,
                        ]}
                      >
                        <Skeleton
                          avatar
                          title={false}
                          loading={item.loading}
                          active
                        >
                          <List.Item.Meta
                            avatar={
                              <Image
                                width={200}
                                height={200}
                                src={getProductImage(item.images[0])}
                                fallback={fallbackImage}
                              />
                            }
                            title={
                              <b
                                onClick={() => {
                                  setCurrentProductSelected(item);
                                  setOpenDetails(true);
                                }}
                              >
                                <a>{item.productName}</a>
                              </b>
                            }
                            description={
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: item.description,
                                }}
                              />
                            }
                          />
                        </Skeleton>
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={22}>
              <Row style={{ marginTop: 24 }} justify="center">
                <Pagination
                  current={pageIndex}
                  total={totalCount}
                  pageSize={DEFAULT_PAGING_INFO.pageSize}
                  onChange={(page) => {
                    setLoading(true);
                    getProductPaging({
                      categoryID: category,
                      productName: searchMessage,
                      pageSize,
                      pageIndex: page,
                    });
                    setPageIndex(page);
                  }}
                />
              </Row>
            </Col>
          </Fragment>
        )}
      </Row>
      <style jsx global>
        {`
          #list-product-supplier .ant-list-item-meta {
            align-items: center;
          }
          #list-product-supplier ul li {
            list-style: outside;
          }
        `}
      </style>
    </div>
  );
};
export default connectToRedux(SupplierProductComponent);
