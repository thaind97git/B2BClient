import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Row,
  Space,
  Table,
  Typography,
  Modal,
  Empty,
  Skeleton,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import Router from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import ListingRequestForGroupComponent from "./ListingRequestForGroupComponent";
import ListingSupplierByCategoryComponent from "./ListingSupplierByCategoryComponent";
import RequestDetailsComponent from "./RequestDetailsComponent";
import UserProfileComponent from "./UserProfileComponent";
import GroupStatusComponent from "./Utils/GroupStatusComponent";
import { DATE_TIME_FORMAT, displayCurrency } from "../utils";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  GetGroupDetailsData,
  getGroupDetails,
  GetGroupDetailsResetter,
  GetGroupDetailsError,
} from "../stores/GroupState";
import {
  getRequestByGroupId,
  getRequestByGroupIdData,
  getRequestByGroupIdError,
} from "../stores/RequestState";
import Moment from "react-moment";
import RequestStatusComponent from "./Utils/RequestStatusComponent";

const { Title } = Typography;
const groupRequestColumns = [
  // { title: "Product Name", dataIndex: "category", key: "category" },
  { title: "Preferred Unit Price", dataIndex: "price", key: "price" },
  { title: "Quantity", dataIndex: "quantity", key: "quantity" },
  { title: "Due Date", dataIndex: "dueDate", key: "dueDate" },
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

const connectToRedux = connect(
  createStructuredSelector({
    groupDetailsData: GetGroupDetailsData,
    groupDetailsError: GetGroupDetailsError,
    requestByGroupIdData: getRequestByGroupIdData,
    requestByGroupIdError: getRequestByGroupIdError,
  }),
  (dispatch) => ({
    getGroupDetails: (id) => dispatch(getGroupDetails(id)),
    getRequestByGroupId: (id) => dispatch(getRequestByGroupId(id)),
    resetData: () => dispatch(GetGroupDetailsResetter),
  })
);

const GroupRequestDetailsComponent = ({
  getGroupDetails,
  groupDetailsData,
  resetData,
  groupDetailsError,
  getRequestByGroupId,
  requestByGroupIdData,
}) => {
  const [isOpenContact, setIsOpenContact] = useState(false);
  const [isOpenAddRequest, setIsOpenAddRequest] = useState(false);
  const [openRequestDetail, setOpenRequestDetail] = useState(false);
  const [openSupplierDetail, setOpenSupplierDetail] = useState(false);
  const [currentRequestSelected, setCurrentRequestSelected] = useState({});

  const [loading, setLoading] = useState(true);
  const groupId = Router.query.id;

  useEffect(() => {
    if (!!groupId) {
      getGroupDetails(groupId);
      getRequestByGroupId(groupId);
    }
  }, [groupId, getGroupDetails, getRequestByGroupId]);

  useEffect(() => {
    if (groupDetailsData || groupDetailsError) {
      setLoading(false);
    }
  }, [groupDetailsData, groupDetailsError]);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

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

  if (loading) {
    return <Skeleton active />;
  }

  if (!groupDetailsData || groupDetailsError) {
    return <Empty description="Can not find any group!" />;
  }
  const {
    groupName,
    category,
    dateCreated,
    description,
    groupStatus,
    minPrice,
    maxPrice,
    quantity,
    averagePrice,
    product,
  } = groupDetailsData;

  const { id: status } = groupStatus || {};
  const { productName, id: productId, unitOfMeasure } = product || {};
  const { description: unit } = unitOfMeasure || {};
  const getRequestTable = (requestData = []) =>
    requestData &&
    requestData.length > 0 &&
    requestData.map((request = {}) => ({
      key: request.id,
      price: displayCurrency(+request.preferredUnitPrice),
      name: request.product.description,
      quantity: +request.quantity || 0,
      dueDate: (
        <Moment format={DATE_TIME_FORMAT}>{new Date(request.dueDate)}</Moment>
      ),
      status: <RequestStatusComponent status={request.requestStatus.id} />,
      actions: (
        <Button
          onClick={() => {
            setCurrentRequestSelected(request);
            setOpenRequestDetail(true);
          }}
          size="small"
          type="link"
        >
          View
        </Button>
      ),
    }));

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
          isSupplier={false}
          requestId={currentRequestSelected.id}
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
        <Title level={4}>Group Name: {groupName}</Title>
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
                href={`/product-details?id=${productId}`}
              >
                <b>{productName}</b>
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <GroupStatusComponent status={status} />
            </Descriptions.Item>
            <Descriptions.Item label="Created date">
              {dateCreated}
            </Descriptions.Item>
            <Descriptions.Item label="Total Quantity">
              {quantity} {unit}
            </Descriptions.Item>
            <Descriptions.Item label="Average price in unit">
              {displayCurrency(Math.floor(averagePrice))}
            </Descriptions.Item>
            <Descriptions.Item label="Min RFQ price">
              {displayCurrency(minPrice)}
            </Descriptions.Item>
            <Descriptions.Item label="Max RFQ price">
              {displayCurrency(maxPrice)}
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
              dataSource={getRequestTable((requestByGroupIdData || {}).data)}
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

export default connectToRedux(GroupRequestDetailsComponent);
