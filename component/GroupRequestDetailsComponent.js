import {
  Button,
  Card,
  Descriptions,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { Fragment, useState } from "react";
import { G_PENDING } from "../enums/groupStatus";
import ListingRequestForGroupComponent from "./ListingRequestForGroupComponent";
import ListingSupplierByCategoryComponent from "./ListingSupplierByCategoryComponent";
import GroupStatusComponent from "./Utils/GroupStatusComponent";
import Messenger from "./Chat/Messenger";
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

const SUPPLIER_CONTACT_DATA = [
  {
    name: "Supplier 1",
    email: "thaindse62642@fpt.edu.vn",
    phone: "0397471442",
    actions: (
      <Space>
        <Button size="small">Chat</Button>
        <Button size="small" type="primary">
          sales closing
        </Button>
        <Button size="small" danger>
          Remove
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
        <Button size="small">Chat</Button>
        <Button size="small" type="primary">
          sales closing
        </Button>
        <Button size="small" danger>
          Remove
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
        <Button size="small">Chat</Button>
        <Button size="small" type="primary">
          sales closing
        </Button>
        <Button size="small" danger>
          Remove
        </Button>
      </Space>
    ),
  },
];
const REQUEST_LIST = [
  {
    key: "1",
    price: "80$",
    category: "Iphone 7S",
    quantity: 20,
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    actions: (
      <Button size="small" danger>
        Remove
      </Button>
    ),
  },
  {
    key: "2",
    price: "80$",
    category: "Iphone 7S",
    quantity: 20,
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    actions: (
      <Button size="small" danger>
        Remove
      </Button>
    ),
  },
  {
    key: "3",
    price: "80$",
    category: "Iphone 7s",
    quantity: 20,
    createdBy: "User 1",
    dateCreated: "30/09/2020 02:07:26 PM",
    actions: (
      <Button size="small" danger>
        Remove
      </Button>
    ),
  },
];

const GroupRequestDetailsComponent = ({
  group = {
    id: 1,
    title: "Laptop Gaming Asus",
    category: "Laptop",
    dateCreated: "27/09/2020",
    dateUpdated: "28/09/2020",
    description: "2000 Mobile",
    reserveAuctionID: "None",
    status: G_PENDING,
  },
}) => {
  const [isOpenContact, setIsOpenContact] = useState(false);
  const [isOpenAddRequest, setIsOpenAddRequest] = useState(false);

  if (!group) {
    return null;
  }
  const {
    title,
    category,
    dateCreated,
    dateUpdated,
    reserveAuctionID,
    description,
    status,
  } = group;
  return (
    <Fragment>
      <Row justify="space-between">
        <Title level={4}>Group Name: {title}</Title>
        <Space>
          <Button danger type="primary">
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
            <Descriptions.Item label="Reserve Auction ID">
              {reserveAuctionID}
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
          bordered={false}
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
        title="Find Supplier"
        visible={isOpenContact}
      >
        <ListingSupplierByCategoryComponent category={category} />
      </Modal>
      <Modal
        onCancel={() => setIsOpenAddRequest(false)}
        title="Add Request"
        visible={isOpenAddRequest}
      >
        <ListingRequestForGroupComponent category={category} />
      </Modal>
    </Fragment>
  );
};

export default GroupRequestDetailsComponent;
