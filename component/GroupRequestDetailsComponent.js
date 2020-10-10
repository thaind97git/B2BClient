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
} from "antd";
import Modal from "antd/lib/modal/Modal";
import Router from "next/router";
import React, { Fragment, useState } from "react";
import { G_NEGOTIATING } from "../enums/groupStatus";
import ListingRequestForGroupComponent from "./ListingRequestForGroupComponent";
import ListingSupplierByCategoryComponent from "./ListingSupplierByCategoryComponent";
import RequestDetailsComponent from "./RequestDetailsComponent";
import UserProfileComponent from "./UserProfileComponent";
import GroupStatusComponent from "./Utils/GroupStatusComponent";

const { Title } = Typography;
const groupRequestColumns = [
  { title: "Product Name", dataIndex: "category", key: "category" },
  { title: "Preferred Unit Price", dataIndex: "price", key: "price" },
  { title: "Quantity", dataIndex: "quantity", key: "quantity" },
  { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
  { title: "Actions", dataIndex: "actions", key: "actions" },
];
const SUPPLIER_CONTACT = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Phone", dataIndex: "phone", key: "phone" },
  { title: "Actions", dataIndex: "actions", key: "actions" },
];

const GroupRequestDetailsComponent = ({
  group = {
    id: 1,
    title: "Iphone 7S",
    category: <Tag color="processing">Iphone</Tag>,
    dateCreated: "27/09/2020",
    dateUpdated: "28/09/2020",
    description: "This Group will focus about Iphone 7S 64Gb",
    quantity: "60 Units",
    priceInUnit: "6,700,000 đ",
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
      price: "7,000,000 đ",
      category: "Iphone 7S 64Gb",
      quantity: 20,
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
      price: "6,800,000 đ",
      category: "Iphone 7S 64Gb",
      quantity: 20,
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
      price: "6,500,000 đ",
      category: "Iphone 7s 64Gb",
      quantity: 20,
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
      actions: (
        <Space>
          <Button size="small" type="dashed">
            <a href="/aggregator/group/chat" target="_blank">
              Chat
            </a>
          </Button>
          <Button size="small" style={{ color: "green" }}>
            Closing sales
          </Button>
          <Button size="small" danger>
            Remove
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
    },
    {
      name: "Supplier 2",
      email: "thaind97.dev@gmail.com",
      phone: "0397471441",
      actions: (
        <Space>
          <Button size="small" type="dashed">
            <a href="/aggregator/group/chat" target="_blank">
              Chat
            </a>
          </Button>
          <Button size="small" style={{ color: "green" }}>
            Closing sales{" "}
          </Button>
          <Button size="small" danger>
            Remove
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
    },
    {
      name: "Supplier 3",
      email: "thaind97.info@gmail.com",
      phone: "0397471440",
      actions: (
        <Space>
          <Button size="small" type="dashed">
            <a href="/aggregator/group/chat" target="_blank">
              Chat
            </a>
          </Button>
          <Button size="small" style={{ color: "green" }}>
            Closing sales
          </Button>
          <Button size="small" danger>
            Remove
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
    },
  ];

  if (!group) {
    return null;
  }
  const {
    title,
    category,
    dateCreated,
    dateUpdated,
    description,
    status,
    priceInUnit,
    quantity,
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
          <Button type="primary" onClick={() => setIsOpenContact(true)}>
            Add Suppliers
          </Button>
        </Space>
      </Row>
      <Space direction="vertical">
        <Card
          title={<Title level={5}>Group Details</Title>}
          style={{ width: "100%" }}
        >
          <Descriptions>
            <Descriptions.Item label="Category">{category}</Descriptions.Item>
            <Descriptions.Item label="Created date">
              {dateCreated}
            </Descriptions.Item>
            <Descriptions.Item label="Updated Date">
              {dateUpdated}
            </Descriptions.Item>
            <Descriptions.Item label="Quantity">{quantity}</Descriptions.Item>
            <Descriptions.Item label="Average price in unit">
              {priceInUnit}
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
              bordered
              columns={SUPPLIER_CONTACT}
              dataSource={SUPPLIER_CONTACT_DATA}
              rowKey="id"
            />
          </div>
        </Card>
      </Space>
      <Modal
        onCancel={() => setIsOpenContact(false)}
        onOk={() => setIsOpenContact(false)}
        title="Find Supplier"
        visible={isOpenContact}
        okText="Add"
      >
        <ListingSupplierByCategoryComponent category={category} />
      </Modal>
      <Modal
        width={600}
        onCancel={() => setIsOpenAddRequest(false)}
        onOk={() => setIsOpenAddRequest(false)}
        title="Add Request"
        visible={isOpenAddRequest}
        okText="Add"
      >
        <ListingRequestForGroupComponent category={category} />
      </Modal>
    </Fragment>
  );
};

export default GroupRequestDetailsComponent;
