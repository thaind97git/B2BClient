import { Button, Col, Row, Drawer } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import { R_PENDING } from "../enums/requestStatus";
import ReactTableLayout from "../layouts/ReactTableLayout";
import {
  DATE_TIME_FORMAT,
  DEFAULT_DATE_RANGE,
  displayCurrency,
} from "../utils";
import GroupCreateComponent from "./GroupCreateComponent";
import RequestStatusComponent from "./Utils/RequestStatusComponent";
import RequestDetailsComponent from "./RequestDetailsComponent";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  getRequestPaging,
  GetRequestPagingData,
  GetRequestPagingError,
} from "../stores/RequestState";
import Moment from "react-moment";
import { get } from "lodash/fp";
import AllCategoryComponent from "./AllCategoryComponent";
import ListingGroupByProductComponent from "./ListingGroupByProductComponent";
const connectToRedux = connect(
  createStructuredSelector({
    requestPagingData: GetRequestPagingData,
    requestPagingError: GetRequestPagingError,
  }),
  (dispatch) => ({
    getRequest: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange,
      status,
      category
    ) => {
      dispatch(
        getRequestPaging({
          pageSize,
          pageIndex,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
          productTitle: searchMessage,
          status,
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
    title: "Preferred Unit Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
  },

  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
  },
];

const statusFilter = [R_PENDING];

const AdminRequestManagement = ({
  requestPagingData,
  requestPagingError,
  getRequest,
  setDefaultTab,
}) => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [recordSelected, setRecordSelected] = useState([]);
  const [requestIdSelected, setRequestIdSelected] = useState([]);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentRequestSelected, setCurrentRequestSelected] = useState({});

  const [category, setCategory] = useState("1");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestPagingError || requestPagingData) {
      setLoading(false);
    }
  }, [requestPagingError, requestPagingData]);

  const getRequestTable = (requestData = []) => {
    return (
      requestData &&
      requestData.length > 0 &&
      requestData.map((request = {}) => ({
        productId: get("product.id")(request),
        key: request.id,
        price: displayCurrency(+request.preferredUnitPrice),
        name: request.product.description,
        quantity:
          +request.quantity || 0 + " " + get("product.unitType")(request),
        dueDate: (
          <Moment format={DATE_TIME_FORMAT}>{new Date(request.dueDate)}</Moment>
        ),
        status: <RequestStatusComponent status={request.requestStatus.id} />,
        actions: (
          <Button
            onClick={() => {
              setCurrentRequestSelected(request);
              setOpenDetails(true);
            }}
            size="small"
            type="link"
          >
            View
          </Button>
        ),
      }))
    );
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRecordSelected(selectedRows);
      const requestIds = selectedRows.map((row) => row.key);
      setRequestIdSelected(requestIds);
      setCurrentProductId((selectedRows[0] || {}).productId);
    },
    getCheckboxProps: (record) => ({
      disabled:
        recordSelected.length !== 0
          ? record.productId !== get("[0].productId")(recordSelected)
          : false,
      name: record.name,
    }),
  };

  let requestData = [],
    totalCount = 0;
  if (requestPagingData) {
    requestData = requestPagingData.data;
    totalCount = requestPagingData.total;
  }
  return (
    <div>
      <Modal
        width={1000}
        title="Create New Group"
        visible={openGroup}
        onOk={() => setOpenGroup(false)}
        onCancel={() => setOpenGroup(false)}
        footer={[
          <Button key="back" onClick={() => setOpenGroup(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            form="group-create"
            htmlType="submit"
          >
            Submit
          </Button>,
        ]}
      >
        {openGroup ? (
          <GroupCreateComponent
            requestIds={[requestIdSelected]}
            productId={currentProductId}
          />
        ) : null}
      </Modal>
      <Modal
        closable
        width={1000}
        title={`Listing Group inside ${(recordSelected[0] || {}).name}`}
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Row justify="space-between">
            <Col>
              <Button type="primary" onClick={() => setOpenGroup(true)}>
                Create new group
              </Button>
            </Col>
            <Col>
              <Button key="back" onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  setDefaultTab("2");
                }}
              >
                Submit
              </Button>
            </Col>
          </Row>,
        ]}
      >
        {modalVisible ? (
          <ListingGroupByProductComponent productId={currentProductId} />
        ) : null}
      </Modal>
      <Row justify="end">
        <Button
          onClick={() => setModalVisible(true)}
          type="primary"
          disabled={recordSelected.length > 0 ? false : true}
        >
          Choose Group to Add
        </Button>
      </Row>
      <ReactTableLayout
        dispatchAction={getRequest}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        searchProps={{
          placeholder: "Search by product name",
          searchMessage,
          setSearchMessage,
          exElement: (
            <AllCategoryComponent
              onGetLastValue={(value) => setCategory(value)}
              size="large"
              isSearchStyle={false}
            />
          ),
          exCondition: [statusFilter, category],
        }}
        dateRangeProps={{
          dateRange,
          setDateRange,
        }}
        data={getRequestTable(requestData || [])}
        columns={columns}
        totalCount={totalCount}
      />
      <Drawer
        width={640}
        title="RFQ details"
        placement={"right"}
        closable={true}
        onClose={() => setOpenDetails(false)}
        visible={openDetails}
        key={"right"}
      >
        {openDetails ? (
          <RequestDetailsComponent
            setOpenDetails={setOpenDetails}
            requestId={(currentRequestSelected || {}).id}
            isSupplier={false}
          />
        ) : null}
      </Drawer>
      {/* <Table dataSource={dataSource} columns={columns} /> */}
    </div>
  );
};

export default connectToRedux(AdminRequestManagement);
