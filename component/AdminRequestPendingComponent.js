import {
  Button,
  Col,
  Divider,
  Radio,
  Row,
  Select,
  Drawer,
  Tag,
  Collapse,
} from "antd";
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
import { createLink } from "../libs";
const { Panel } = Collapse;
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
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setRecordSelected(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled:
        recordSelected.length !== 0
          ? record.productId !== get("[0].productId")(recordSelected)
          : false,
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
        width={1000}
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
        closable
        width={1000}
        title="Listing Group inside IR Night Vision Hidden Camera Watch Sport Wear Watch Camera WIFI"
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
                onClick={() => {
                  setDefaultTab("2");
                  setModalVisible(false);
                }}
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
              <Radio style={{ width: "100%" }} value="A">
                <b>IR Night Vision Hidden Camera Watch Sport - 02/10/2020</b>{" "}
                created inside{" "}
                <Tag color="processing">Action & Sports Camera</Tag>
                <div>
                  <Collapse bordered={false} defaultActiveKey={[]}>
                    <Panel header="More details" key="1">
                      <ul>
                        <li>
                          Total RFQ added: <b>5</b>
                        </li>
                        <li>
                          Total quantity: <b>80 Pieces</b>
                        </li>
                        <li>
                          Min RFQ price: <b>{displayCurrency(1950000)}</b>
                        </li>
                        <li>
                          Max RFQ price: <b>{displayCurrency(2000000)}</b>
                        </li>
                        <li>
                          Note: <i>N/A</i>
                        </li>
                        <li>
                          <a
                            rel="noreferrer"
                            target="_blank"
                            href={createLink([
                              "aggregator",
                              "group",
                              "details?id=1",
                            ])}
                          >
                            View details
                          </a>
                        </li>
                      </ul>
                    </Panel>
                  </Collapse>
                </div>
              </Radio>
            </Col>
            <Divider />
            <Col span={24}>
              <Radio style={{ width: "100%" }} value="B">
                <b>IR Night Vision Hidden Camera Watch Sport - 23/10/2020</b>{" "}
                created inside{" "}
                <Tag color="processing">Action & Sports Camera</Tag>
                <div>
                  <Collapse bordered={false} defaultActiveKey={[]}>
                    <Panel header="More details" key="1">
                      <ul>
                        <li>
                          Total RFQ added: <b>3</b>
                        </li>
                        <li>
                          Total quantity: <b>130 Pieces</b>
                        </li>
                        <li>
                          Min RFQ price: <b>{displayCurrency(1850000)}</b>
                        </li>
                        <li>
                          Max RFQ price: <b>{displayCurrency(1900000)}</b>
                        </li>
                        <li>
                          Note: <i>N/A</i>
                        </li>
                        <li>
                          <a
                            rel="noreferrer"
                            target="_blank"
                            href={createLink([
                              "aggregator",
                              "group",
                              "details?id=1",
                            ])}
                          >
                            View details
                          </a>
                        </li>
                      </ul>
                    </Panel>
                  </Collapse>
                </div>
              </Radio>
            </Col>
            <Divider />
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
