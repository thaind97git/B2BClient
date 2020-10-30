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
import ListingSupplierByProductComponent from "./ListingSupplierByProductComponent";
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
import {
  getSupplierByGroupId,
  GetSupplierByGroupIdData,
  GetSupplierByGroupIdError,
} from "../stores/SupplierState";
import ReactTableLayout from "../layouts/ReactTableLayout";

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
    supplierByGroupIdData: GetSupplierByGroupIdData,
    supplierByGroupIdError: GetSupplierByGroupIdError,
  }),
  (dispatch) => ({
    getGroupDetails: (id) => dispatch(getGroupDetails(id)),
    getRequestByGroupId: (pageIndex, pageSize, groupId) =>
      dispatch(getRequestByGroupId({ pageIndex, pageSize, groupId })),
    getSupplierByGroupId: ({ groupId, pageIndex, pageSize }) =>
      dispatch(getSupplierByGroupId({ groupId, pageIndex, pageSize })),
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
  getSupplierByGroupId,
  supplierByGroupIdData,
  supplierByGroupIdError,
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
      getSupplierByGroupId({ groupId });
    }
  }, [groupId, getGroupDetails, getSupplierByGroupId]);

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

  const getSupplierTable = (supplierData = []) =>
    supplierData &&
    supplierData.length > 0 &&
    supplierData.map((supplier = {}) => ({
      key: supplier.id,
      price: displayCurrency(+supplier.preferredUnitPrice),
      name: supplier.product.description,
      quantity: +supplier.quantity || 0,
      dueDate: (
        <Moment format={DATE_TIME_FORMAT}>{new Date(supplier.dueDate)}</Moment>
      ),
      status: <RequestStatusComponent status={supplier.supplierStatus.id} />,
      actions: (
        <Button
          onClick={() => {
            setCurrentRequestSelected(supplier);
            setOpenRequestDetail(true);
          }}
          size="small"
          type="link"
        >
          View
        </Button>
      ),
    }));

  let requestData = [],
    totalRequest = 0,
    supplierData = [],
    totalSupplier = 0;
  if (supplierByGroupIdData) {
    supplierData = supplierByGroupIdData.data;
    totalSupplier = supplierByGroupIdData.total;
  }
  if (requestByGroupIdData) {
    requestData = requestByGroupIdData.data;
    totalRequest = requestByGroupIdData.total;
  }

  return (
    <Fragment>
      <Drawer
        width={640}
        title="RFQ details"
        placement={"right"}
        closable={true}
        onClose={() => setOpenRequestDetail(false)}
        visible={openRequestDetail}
        key={"rfq-details"}
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
        key={"supplier-details"}
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
              <b>
                {quantity} {unit}
              </b>
            </Descriptions.Item>
            <Descriptions.Item label="Average price in unit">
              <b>{displayCurrency(Math.floor(averagePrice))}</b>
            </Descriptions.Item>
            <Descriptions.Item label="Min RFQ price">
              <b>{displayCurrency(minPrice)}</b>
            </Descriptions.Item>
            <Descriptions.Item label="Max RFQ price">
              <b>{displayCurrency(maxPrice)}</b>
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
            <ReactTableLayout
              hasAction={false}
              dispatchAction={getRequestByGroupId}
              searchProps={{
                exCondition: [groupId],
              }}
              data={getRequestTable(requestData || [])}
              columns={groupRequestColumns}
              totalCount={totalRequest}
              footer={() => (
                <Button
                  type="primary"
                  onClick={() => setIsOpenAddRequest(true)}
                >
                  Add Requests
                </Button>
              )}
            />
            {/* <Table
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
              dataSource={getRequestTable(requestData || [])}
              rowKey="id"
            /> */}
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
        {isOpenContact ? (
          <ListingSupplierByProductComponent productId={productId} />
        ) : null}
      </Modal>
      <Modal
        width={800}
        onCancel={() => setIsOpenAddRequest(false)}
        onOk={() => setIsOpenAddRequest(false)}
        title={
          <div>
            Add Requests created inside <i>{productName}</i>
          </div>
        }
        visible={isOpenAddRequest}
        okText="Add"
      >
        {isOpenAddRequest ? (
          <ListingRequestForGroupComponent productId={productId} />
        ) : null}
      </Modal>
    </Fragment>
  );
};

export default connectToRedux(GroupRequestDetailsComponent);
