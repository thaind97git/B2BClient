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
import { G_WAITING } from "../enums/groupStatus";
import ListingRequestForGroupComponent from "./ListingRequestForGroupComponent";
import ListingSupplierByCategoryComponent from "./ListingSupplierByCategoryComponent";
import GroupStatusComponent from "./Utils/GroupStatusComponent";
import Messenger from "./Chat/Messenger";
const { Title } = Typography;
const groupRequestColumns = [
  { title: "Id", dataIndex: "id", key: "id" },
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Quantity", dataIndex: "quantity", key: "quantity" },
  { title: "Price", dataIndex: "price", key: "price" },
  {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: () => <a>Delete</a>,
  },
];
const REQUEST_LIST = [
  {
    id: "123",
    name: "Buyer1",
    quantity: "1",
    price: "3000",
    description: "1 Laptop",
  },
  {
    id: "124",
    name: "Buyer2",
    quantity: "5",
    price: "5000",
    description: "5 Laptop",
  },
  {
    id: "125",
    name: "Buyer3",
    quantity: "6",
    price: "5333",
    description: "6 Laptop",
  },
];

const GroupRequestDetailsComponent = ({
  group = {
    id: 1,
    title: "Iphone 20x",
    category: "Mobile Phone",
    dateCreated: "27/09/2020",
    dateUpdated: "28/09/2020",
    description: "2000 Mobile",
    reserveAuctionID: "None",
    status: G_WAITING,
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
        <Title level={4}>{title}</Title>
        <Button type="primary" onClick={() => setIsOpenContact(true)}>
          Contact to Suppliers
        </Button>
      </Row>
      <Space direction="vertical">
        <Card
          title={<Title level={5}>Group Details</Title>}
          bordered={false}
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
          bordered={false}
          style={{ width: "100%" }}
        >
          <div>
            <Table
              footer={() => (
                <Button
                  type="primary"
                  onClick={() => setIsOpenAddRequest(true)}
                >
                  Add Requests
                </Button>
              )}
              columns={groupRequestColumns}
              expandable={{
                expandedRowRender: (record) => (
                  <p style={{ margin: 0 }}>{record.description}</p>
                ),
              }}
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
          <Messenger />
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
