import React, { useEffect, useState } from "react";
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
import ProductDetailComponent from "./ProductDetailComponent";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  getProductPaging,
  GetProductPagingData,
  GetProductPagingError,
} from "../stores/ProductState";
import SupplierProductOptionComponent from "./SupplierProductOptionComponent";
import { DEFAULT_PAGING_INFO, fallbackImage } from "../utils";
import { get } from "lodash/fp";
import AdminProductDetailsComponent from "./AdminProductDetailsComponent";
const { Title } = Typography;
const connectToRedux = connect(
  createStructuredSelector({
    getProductPagingData: GetProductPagingData,
    getProductPagingError: GetProductPagingError,
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
  })
);
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

const recordInOnePage = 10;

const SupplierProductComponent = ({
  getProductPaging,
  getProductPagingData,
  getProductPagingError,
}) => {
  const [currentCateSelected, setCurrentCateSelected] = useState("");
  const [openDetails, setOpenDetails] = useState(false);
  const [category, setCategory] = useState("all");
  const [searchMessage, setSearchMessage] = useState("");
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGING_INFO.page);
  const pageSize = DEFAULT_PAGING_INFO.pageSize;
  const [firstLoad, setFirstLoad] = useState(true);
  const [currentProductIdSelected, setCurrentProductIdSelected] = useState(
    null
  );

  const [loading, setLoading] = useState(false);

  const [openOption, setOpenOption] = useState(false);

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
      pageSize,
      pageIndex,
    });
  }, [pageIndex]);

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

  if (loading) {
    return <Skeleton active />;
  }

  return (
    <div>
      <Modal
        title="Create Quotations"
        centered
        visible={openOption}
        onOk={() => setOpenOption(false)}
        onCancel={() => setOpenOption(false)}
        width={1000}
      >
        <SupplierProductOptionComponent />
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
            productID={currentProductIdSelected}
          />
        ) : null}
      </Drawer>
      <Row>
        <Col span={24}>
          <Row style={{ marginBottom: 32 }} justify="center">
            <Col span={22} id="search-product">
              <Title level={5}>Search product inside system</Title>
              <Search
                value={searchMessage}
                addonBefore={
                  <AllCategoryComponent
                    onGetLastValue={(value) => {
                      setCategory(value);
                    }}
                    onGetLabel={(label) => {
                      setCurrentCateSelected(label);
                    }}
                  />
                }
                placeholder="Product name"
                enterButton="Search"
                size="large"
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
              <div>{currentCateSelected}</div>
            </Col>
          </Row>
        </Col>
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
                        Unit: <b>{get("unitOfMeasure.description")(item)}</b>
                      </div>,
                      <Button
                        onClick={() => {
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
                            src={item.images[0]}
                            fallback={fallbackImage}
                          />
                        }
                        title={
                          <b
                            onClick={() => {
                              setCurrentProductIdSelected(item.id);
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
              onChange={(page) => setPageIndex(page)}
            />
          </Row>
        </Col>
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
