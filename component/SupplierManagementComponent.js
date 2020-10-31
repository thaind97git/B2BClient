import { Button, Drawer, Popover, Row, Select, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import {
  DATE_TIME_FORMAT,
  DEFAULT_DATE_RANGE,
  displayCurrency,
} from "../utils";
import RequestStatusComponent from "./Utils/RequestStatusComponent";
import {
  R_BIDDING,
  R_CANCELED,
  R_DONE,
  R_GROUPED,
  R_NEGOTIATING,
  R_ORDERED,
  R_PENDING,
  R_REJECTED,
  R_WAIT_FOR_AUCTION,
} from "../enums/requestStatus";
import RequestDetailsComponent from "./RequestDetailsComponent";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Moment from "react-moment";
import { get } from "lodash/fp";
import {
  banUser,
  getSupplierPaging,
  GetSupplierPagingData,
  GetSupplierPagingError,
  unBanUser,
} from "../stores/SupplierState";
const { Option } = Select;
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    supplierPagingData: GetSupplierPagingData,
    supplierPagingError: GetSupplierPagingError,
  }),
  (dispatch) => ({
    getSupplierPaging: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange,
      status
    ) => {
      dispatch(
        getSupplierPaging({
          pageSize,
          pageIndex,
          email: searchMessage,
          status: [status],
        })
      );
    },
    banSupplier: ({ id, description }) =>
      dispatch(banUser({ id, description })),
    unBanSupplier: (id) => dispatch(unBanUser({ id })),
  })
);

const columns = [
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Full Name",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Company Name",
    dataIndex: "companyName",
    key: "companyName",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
  },
];

const SupplierManagementComponent = ({
  getSupplierPaging,
  supplierPagingData,
  supplierPagingError,
  banSupplier,
  unBanSupplier,
}) => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentRequestSelected, setCurrentSupplierSelected] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supplierPagingError || supplierPagingData) {
      setLoading(false);
    }
  }, [supplierPagingError, supplierPagingData]);

  function handleChange(value) {
    setStatus(value);
  }
  const getSupplierTable = (supplierData = []) => {
    return supplierData
      ? supplierData.map((supplier = {}) => ({
          key: supplier.id,
          email: supplier.email,
          fullName: `${supplier.firstName} ${supplier.lastName}`,
          companyName: supplier.companyName,
          phoneNumber: supplier.phoneNumber,
          status: <RequestStatusComponent status={null} />,
          actions: (
            <Space>
              <Button type="primary" danger onClick={() => {}} size="small">
                Ban
              </Button>
              <Button type="primary" onClick={() => {}} size="small">
                UnBan
              </Button>
              <Button
                onClick={() => {
                  setCurrentSupplierSelected(supplier);
                  setOpenDetails(true);
                }}
                size="small"
                type="link"
              >
                View
              </Button>
            </Space>
          ),
        }))
      : [];
  };

  let supplierData = [],
    totalCount = 0;
  if (!!supplierPagingData && !supplierPagingError) {
    supplierData = supplierPagingData.data;
    totalCount = supplierPagingData.total;
  }
  return (
    <div>
      <Row justify="space-between">
        <Drawer
          width={640}
          title="Supplier Details"
          placement={"right"}
          closable={true}
          onClose={() => setOpenDetails(false)}
          visible={openDetails}
          key={"right"}
        >
          {openDetails ? (
            <RequestDetailsComponent
              setOpenDetails={setOpenDetails}
              requestId={currentRequestSelected.id}
            />
          ) : null}
        </Drawer>
        <Title level={4}>Supplier Management</Title>
      </Row>
      <ReactTableLayout
        totalCount={totalCount}
        loading={loading}
        dispatchAction={getSupplierPaging}
        searchProps={{
          placeholder: "Search by email",
          searchMessage,
          setSearchMessage,
          exElement: (
            <Select
              size="large"
              placeholder="Filter by status"
              style={{ width: 200 }}
              onChange={handleChange}
              defaultValue=""
            >
              <Option value="">All Status</Option>
              <Option value={R_PENDING}>Pending</Option>
              <Option value={R_DONE}>Done</Option>
              <Option value={R_REJECTED}>Rejected</Option>
              <Option value={R_CANCELED}>Canceled</Option>
              <Option value={R_ORDERED}>Ordered</Option>
              <Option value={R_BIDDING}>Bidding</Option>
              <Option value={R_WAIT_FOR_AUCTION}>Wait for Auction</Option>
              <Option value={R_GROUPED}>Grouping</Option>
              <Option value={R_NEGOTIATING}>Negotiating</Option>
            </Select>
          ),
          exCondition: [status],
        }}
        dateRangeProps={{
          dateRange,
          setDateRange,
        }}
        data={getSupplierTable(supplierData || [])}
        columns={columns}
      />
    </div>
  );
};

export default connectToRedux(SupplierManagementComponent);
