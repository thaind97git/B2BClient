import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Drawer,
  List,
  Modal,
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
  getProductByCategory,
  GetProductByCategoryData,
  GetProductByCategoryError,
} from "../stores/ProductState";
import SupplierProductOptionComponent from "./SupplierProductOptionComponent";
const { Title } = Typography;
const connectToRedux = connect(
  createStructuredSelector({
    getProductByCategoryData: GetProductByCategoryData,
    getProductByCategoryError: GetProductByCategoryError,
  }),
  (dispatch) => ({
    getProductByCategory: (id, pageSize, pageIndex) =>
      dispatch(getProductByCategory(id, pageSize, pageIndex)),
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
  getProductByCategory,
  getProductByCategoryData,
  getProductByCategoryError,
}) => {
  const [currentCateSelected, setCurrentCateSelected] = useState("");
  const [openDetails, setOpenDetails] = useState(false);
  const [category, setCategory] = useState("all");
  const [searchMessage, setSearchMessage] = useState("");
  const [pageSize, setPageSize] = useState(recordInOnePage);
  const pageIndex = 1;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);

  const [openOption, setOpenOption] = useState(false);

  useEffect(() => {
    if (getProductByCategoryData) {
      const newData = data.concat(getProductByCategoryData.data);
      setLoading(false);
      setData(newData);
      setList(newData);
      window.dispatchEvent(new Event("resize"));
    }
  }, [getProductByCategoryData]);

  const onLoadMore = () => {
    if (searchMessage) {
      setLoading(true);
      setList(
        data.concat(
          [...new Array(recordInOnePage)].map(() => ({
            loading: true,
            name: {},
          }))
        )
      );
      getProductByCategory(category, pageSize, pageIndex);
    }
  };
  let totalCount = 0;
  if (getProductByCategoryData) {
    totalCount = getProductByCategoryData.total;
  }

  const loadMore =
    list.length < totalCount && !loading ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button type="primary" onClick={onLoadMore}>
          Loading more
        </Button>
      </div>
    ) : null;
  return (
    <div>
      <Modal
        title="Create options"
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
        key={"right"}
      >
        <ProductDetailComponent />
      </Drawer>
      <Row>
        <Col span={24}>
          <Row style={{ marginBottom: 32 }} justify="center">
            <Col span={18} id="search-product">
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
                    getProductByCategory(category, pageSize, pageIndex);
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
            <Col id="list-product-supplier" span={18}>
              <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={LIST_PRODUCT}
                renderItem={(item, index) => (
                  <List.Item
                    key={index}
                    actions={
                      !item.loading && [
                        <Button
                          onClick={() => setOpenOption(true)}
                          size="small"
                          type="primary"
                        >
                          Register Sell product
                        </Button>,
                      ]
                    }
                  >
                    <Skeleton
                      avatar
                      title={false}
                      loading={item.loading}
                      active
                    >
                      <List.Item.Meta
                        avatar={
                          <img
                            style={{ padding: 8 }}
                            alt="example"
                            src={item.image}
                          />
                        }
                        title={
                          <b onClick={() => setOpenDetails(true)}>
                            <a href="#">{item.title}</a>
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
                      <div>
                        Unit: <b>{item.unit}</b>
                      </div>
                    </Skeleton>
                  </List.Item>
                )}
              />
              {/* <Row justify="center">
                <Button
                  style={{ marginTop: 40 }}
                  type="primary"
                  onClick={() => {
                    setPageSize((prev) => prev + recordInOnePage);
                  }}
                >
                  Load more
                </Button>
              </Row> */}
            </Col>
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
