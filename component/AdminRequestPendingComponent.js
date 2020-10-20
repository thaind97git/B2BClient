import { Button, Col, Divider, Radio, Row, Select, Drawer } from "antd";
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
const { Option, OptGroup } = Select;

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
      console.log({ category });
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
}) => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [recordSelected, setRecordSelected] = useState([]);
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
  function handleChange(value) {
    setCategory(value);
  }
  const getRequestTable = (requestData = []) => {
    return (
      requestData &&
      requestData.length > 0 &&
      requestData.map((request = {}) => ({
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
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setRecordSelected(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };
  function onChange(checkedValues) {
    console.log("checked = ", checkedValues);
  }
  useEffect(() => {
    console.log(recordSelected);
  }, [recordSelected]);

  let requestData = [],
    totalCount = 0;
  if (requestPagingData) {
    requestData = requestPagingData.data;
    totalCount = requestPagingData.total;
  }
  return (
    <div>
      <Modal
        width={800}
        title="Create New Group"
        visible={openGroup}
        onOk={() => setOpenGroup(false)}
        onCancel={() => setOpenGroup(true)}
        footer={[
          <Button key="back" onClick={() => setOpenGroup(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => setOpenGroup(false)}
          >
            Submit
          </Button>,
        ]}
      >
        <GroupCreateComponent />
      </Modal>
      <Modal
        title="Listing Group"
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(true)}
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
                onClick={() => setModalVisible(false)}
              >
                Submit
              </Button>
            </Col>
          </Row>,
        ]}
      >
        <Radio.Group style={{ width: "100%" }} onChange={onChange}>
          <Row>
            <Col span={24}>
              <Radio value="A">
                <b>Group Iphone 6s 32Gb</b> created inside Iphone
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="B">
                <b>Group Iphone 8 64Gb</b> created inside Iphone
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="C">
                <b>Group Mackbook Air 2015</b> created inside Mackbook
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="D">
                <b>Group Mackbook Air 2018</b> created inside Mackbook
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio value="E">
                <b>Group Mackbook Air 2018</b> created inside Mackbook
              </Radio>
            </Col>
          </Row>
        </Radio.Group>
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
