import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  Modal,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import Router from "next/router";
import React, { Fragment, useState } from "react";
import { G_NEGOTIATING } from "../enums/groupStatus";
import ListingRequestForGroupComponent from "./ListingRequestForGroupComponent";
import ListingSupplierByCategoryComponent from "./ListingSupplierByCategoryComponent";
import RequestDetailsComponent from "./RequestDetailsComponent";
import UserProfileComponent from "./UserProfileComponent";
import GroupStatusComponent from "./Utils/GroupStatusComponent";
import { displayCurrency, getAveragePrice } from "../utils";
import { createLink } from "../libs";

const { Title } = Typography;
const groupRequestColumns = [
  // { title: "Product Name", dataIndex: "category", key: "category" },
  { title: "Preferred Unit Price", dataIndex: "price", key: "price" },
  { title: "Quantity", dataIndex: "quantity", key: "quantity" },
  { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
  { title: "Actions", dataIndex: "actions", key: "actions" },
];
const SUPPLIER_CONTACT = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Phone", dataIndex: "phone", key: "phone" },
  { title: "Is Ignore", dataIndex: "isIgnore", key: "isIgnore" },
  { title: "Actions", dataIndex: "actions", key: "actions" },
  { title: "", dataIndex: "remove", key: "remove" },
];

const GroupRequestDetailsComponent = ({
  group = {
    id: 1,
    title: "Group IR Night Vision Hidden Camera Watch Sport - 23/10/2020",
    category: <Tag color="processing">Action & Sports Camera</Tag>,
    dateCreated: "27/09/2020",
    dateUpdated: "28/09/2020",
    description:
      "This Group will focus about IR Night Vision Hidden Camera Watch Sport",
    quantity: "190 Units",
    minPrice: displayCurrency(1180000),
    maxPrice: displayCurrency(1200000),
    status: G_NEGOTIATING,
  },
}) => {
  const [isOpenContact, setIsOpenContact] = useState(false);
  const [isOpenAddRequest, setIsOpenAddRequest] = useState(false);
  const [openRequestDetail, setOpenRequestDetail] = useState(false);
  const [openSupplierDetail, setOpenSupplierDetail] = useState(false);
  const REQUEST_LIST = [
    {
      key: "1",
      price: displayCurrency(1190000),
      quantity: 50,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setOpenRequestDetail(true);
            }}
          >
            {" "}
            Details
          </Button>
        </Space>
      ),
    },
    {
      key: "2",
      price: displayCurrency(1180000),
      quantity: 140,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setOpenRequestDetail(true);
            }}
          >
            {" "}
            Details
          </Button>
        </Space>
      ),
    },
    {
      key: "3",
      price: displayCurrency(1200000),
      quantity: 30,
      createdBy: "User 1",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setOpenRequestDetail(true);
            }}
          >
            {" "}
            Details
          </Button>
        </Space>
      ),
    },
  ];
  const SUPPLIER_CONTACT_DATA = [
    {
      name: "Supplier 1",
      email: "thaindse62642@fpt.edu.vn",
      phone: "0397471442",
      isIgnore: (
        <Space style={{ color: "red" }}>
          <CloseCircleOutlined />
          Ignored
        </Space>
      ),
      actions: (
        <Space>
          <Button size="small" type="dashed">
            <a href="/aggregator/group/chat" target="_blank">
              Chat
            </a>
          </Button>
          <Button
            size="small"
            style={{ color: "green" }}
            onClick={() => {
              Router.push(
                `/aggregator/order/confirmation?groupID=${1}&isNegotiating=true`
              );
            }}
          >
            Closing deal
          </Button>

          <Button
            type="link"
            onClick={() => {
              setOpenSupplierDetail(true);
            }}
          >
            Details
          </Button>
        </Space>
      ),
      remove: (
        <Button size="small" danger>
          Remove
        </Button>
      ),
    },
    {
      name: "Supplier 2",
      email: "thaind97.dev@gmail.com",
      phone: "0397471441",
      isIgnore: (
        <Space style={{ color: "red" }}>
          <CloseCircleOutlined />
          Ignored
        </Space>
      ),
      actions: (
        <Space>
          <Button size="small" type="dashed">
            <a href="/aggregator/group/chat" target="_blank">
              Chat
            </a>
          </Button>
          <Button
            size="small"
            style={{ color: "green" }}
            onClick={() => {
              Router.push(
                `/aggregator/order/confirmation?groupID=${1}&isNegotiating=true`
              );
            }}
          >
            Closing deal
          </Button>
          <Button
            type="link"
            onClick={() => {
              setOpenSupplierDetail(true);
            }}
          >
            Details
          </Button>
        </Space>
      ),
      remove: (
        <Button size="small" danger>
          Remove
        </Button>
      ),
    },
    {
      name: "Supplier 3",
      email: "thaind97.info@gmail.com",
      phone: "0397471440",
      isIgnore: <span style={{ color: "green" }}>Negotiating</span>,
      actions: (
        <Space>
          <Button size="small" type="dashed">
            <a href="/aggregator/group/chat" target="_blank">
              Chat
            </a>
          </Button>
          <Button
            size="small"
            style={{ color: "green" }}
            onClick={() => {
              Router.push(
                `/aggregator/order/confirmation?groupID=${1}&isNegotiating=true`
              );
            }}
          >
            Closing deal
          </Button>
          <Button
            type="link"
            onClick={() => {
              setOpenSupplierDetail(true);
            }}
          >
            Details
          </Button>
        </Space>
      ),
      remove: (
        <Button size="small" danger>
          Remove
        </Button>
      ),
    },
  ];

  if (!group) {
    return null;
  }
  const {
    title,
    category,
    dateCreated,
    description,
    status,
    minPrice,
    maxPrice,
  } = group;
  return (
    <Fragment>
      <Drawer
        width={640}
        title="RFQ details"
        placement={"right"}
        closable={true}
        onClose={() => setOpenRequestDetail(false)}
        visible={openRequestDetail}
        key={"right"}
      >
        <RequestDetailsComponent
          // requestId="fd450a99-991b-4164-c2e5-08d8773db076"
          buttonActions={[
            {
              label: "Remove",
              buttonProps: {
                danger: true,
              },
            },
          ]}
        />
      </Drawer>
      <Drawer
        width={640}
        title="Supplier details"
        placement={"right"}
        closable={true}
        onClose={() => setOpenSupplierDetail(false)}
        visible={openSupplierDetail}
        key={"right"}
      >
        <UserProfileComponent isDrawer={true} />
      </Drawer>
      <Row justify="space-between">
        <Title level={4}>Group Name: {title}</Title>
        <Space>
          <Button
            danger
            type="primary"
            onClick={() => Router.push("/aggregator/bidding/create")}
          >
            Create Reverse Auction
          </Button>
        </Space>
      </Row>
      <Space direction="vertical">
        <Card
          title={<Title level={5}>Group Details</Title>}
          style={{ width: "100%" }}
        >
          <Descriptions>
            <Descriptions.Item label="Product Name" span={3}>
              <a
                rel="noreferrer"
                target="_blank"
                href={createLink(["product-details?productId=1"])}
              >
                <b>
                  IR Night Vision Hidden Camera Watch Sport Wear Watch Camera
                  WIFI
                </b>
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Category">{category}</Descriptions.Item>
            <Descriptions.Item label="Created date">
              {dateCreated}
            </Descriptions.Item>
            <Descriptions.Item label="Total Quantity">
              {REQUEST_LIST.reduce((prev, current) => {
                return prev + current.quantity;
              }, 0)}{" "}
              Units
            </Descriptions.Item>
            <Descriptions.Item label="Average price in unit">
              {displayCurrency(
                getAveragePrice([
                  { price: 1200000, quantity: 50 },
                  { price: 1190000, quantity: 30 },
                  { price: 1180000, quantity: 140 },
                ])
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Min RFQ price">
              {minPrice}
            </Descriptions.Item>
            <Descriptions.Item label="Max RFQ price">
              {maxPrice}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <GroupStatusComponent status={status} />
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {description}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card
          title={<Title level={5}>Request List</Title>}
          style={{ width: "100%" }}
        >
          <div>
            <Table
              bordered
              footer={() => (
                <Button
                  type="primary"
                  onClick={() => setIsOpenAddRequest(true)}
                >
                  Add Requests
                </Button>
              )}
              columns={groupRequestColumns}
              dataSource={REQUEST_LIST}
              rowKey="id"
            />
          </div>
        </Card>
        <Card
          title={<Title level={5}>Suppliers Contact</Title>}
          style={{ width: "100%" }}
        >
          <div>
            <Table
              footer={() => {
                return (
                  <Button type="primary" onClick={() => setIsOpenContact(true)}>
                    Add Suppliers
                  </Button>
                );
              }}
              bordered
              columns={SUPPLIER_CONTACT}
              dataSource={SUPPLIER_CONTACT_DATA}
              rowKey="id"
            />
          </div>
        </Card>
      </Space>
      <Modal
        width={1000}
        onCancel={() => setIsOpenContact(false)}
        onOk={() => setIsOpenContact(false)}
        title="Find Supplier"
        visible={isOpenContact}
        okText="Add"
      >
        <ListingSupplierByCategoryComponent category={category} />
      </Modal>
      <Modal
        width={800}
        onCancel={() => setIsOpenAddRequest(false)}
        onOk={() => setIsOpenAddRequest(false)}
        title={
          <div>
            Add Requests created inside{" "}
            <i>
              IR Night Vision Hidden Camera Watch Sport Wear Watch Camera WIFI
            </i>
          </div>
        }
        visible={isOpenAddRequest}
        okText="Add"
      >
        <ListingRequestForGroupComponent category={category} />
      </Modal>
    </Fragment>
  );
};

export default GroupRequestDetailsComponent;
