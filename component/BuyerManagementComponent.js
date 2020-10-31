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
import {
  getRequestPaging,
  GetRequestPagingData,
  GetRequestPagingError,
} from "../stores/RequestState";
import Moment from "react-moment";
import { get } from "lodash/fp";
import {
  getBuyerPaging,
  GetBuyerPagingData,
  GetBuyerPagingError,
} from "../stores/BuyerState";
import { banUser, unBanUser } from "../stores/SupplierState";
const { Option } = Select;
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    buyerPagingData: GetBuyerPagingData,
    buyerPagingError: GetBuyerPagingError,
  }),
  (dispatch) => ({
    getBuyerPaging: (pageIndex, pageSize, searchMessage, dateRange, status) => {
      dispatch(
        getBuyerPaging({
          pageSize,
          pageIndex,
          email: searchMessage,
          status: [status],
        })
      );
    },
    banBuyer: ({ id, description }) => dispatch(banUser({ id, description })),
    unBanBuyer: (id) => dispatch(unBanUser({ id })),
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

const BuyerManagementComponent = ({
  getBuyerPaging,
  buyerPagingData,
  buyerPagingError,
  banBuyer,
  unBanBuyer,
}) => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentRequestSelected, setCurrentBuyerSelected] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (buyerPagingError || buyerPagingData) {
      setLoading(false);
    }
  }, [buyerPagingError, buyerPagingData]);

  function handleChange(value) {
    setStatus(value);
  }
  const getBuyerTable = (buyerData = []) => {
    return buyerData
      ? buyerData.map((buyer = {}) => ({
          key: buyer.id,
          email: buyer.email,
          fullName: `${buyer.firstName} ${buyer.lastName}`,
          companyName: buyer.companyName,
          phoneNumber: buyer.phoneNumber,
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
                  setCurrentBuyerSelected(buyer);
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

  let buyerData = [],
    totalCount = 0;
  if (!!buyerPagingData && !buyerPagingError) {
    buyerData = buyerPagingData.data;
    totalCount = buyerPagingData.total;
  }
  return (
    <div>
      <Row justify="space-between">
        <Drawer
          width={640}
          title="Buyer Details"
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
        <Title level={4}>Buyer Management</Title>
      </Row>
      <ReactTableLayout
        totalCount={totalCount}
        loading={loading}
        dispatchAction={getBuyerPaging}
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
        data={getBuyerTable(buyerData || [])}
        columns={columns}
      />
    </div>
  );
};

export default connectToRedux(BuyerManagementComponent);
