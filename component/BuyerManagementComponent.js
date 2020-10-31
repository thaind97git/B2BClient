import { Button, Drawer, Row, Select, Space, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE } from "../utils";
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

import { get } from "lodash/fp";
import {
  getBuyerPaging,
  GetBuyerPagingData,
  GetBuyerPagingError,
} from "../stores/BuyerState";
import { banUser, unBanUser } from "../stores/SupplierState";
import UserStatusComponent from "./Utils/UserStatusComponent";
import { U_ACTIVE, U_BANNED } from "../enums/accountStatus";
import Modal from "antd/lib/modal/Modal";
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
    banBuyer: ({ id, description }) =>
      dispatch(banUser({ id, description, isSupplier: false })),
    unBanBuyer: ({ id }) => dispatch(unBanUser({ id, isSupplier: false })),
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
      ? buyerData.map((buyer = {}) => {
          const buyerStatus = get("userStatus.id")(buyer);
          return {
            key: buyer.id,
            email: (
              <Button
                onClick={() => {
                  setCurrentBuyerSelected(buyer);
                  setOpenDetails(true);
                }}
                size="small"
                type="link"
              >
                {buyer.email}
              </Button>
            ),
            fullName: `${buyer.firstName} ${buyer.lastName}`,
            companyName: buyer.companyName,
            phoneNumber: buyer.phoneNumber,
            status: <UserStatusComponent status={buyerStatus} />,
            actions: (
              <Space>
                {+buyerStatus === U_ACTIVE && (
                  <Button
                    type="primary"
                    danger
                    onClick={() => {
                      Modal.confirm({
                        title: "Do you want ban this account?",
                        icon: <ExclamationCircleOutlined />,
                        okText: "Ban",
                        cancelText: "Cancel",
                        onOk: () => {
                          banBuyer({ id: buyer.id });
                        },
                      });
                    }}
                    size="small"
                  >
                    Ban
                  </Button>
                )}
                {+buyerStatus === U_BANNED && (
                  <Button
                    type="primary"
                    onClick={() => {
                      Modal.confirm({
                        title: "Do you want active this account?",
                        icon: <ExclamationCircleOutlined />,
                        okText: "Active",
                        cancelText: "Cancel",
                        onOk: () => {
                          unBanBuyer({ id: buyer.id });
                        },
                      });
                    }}
                    size="small"
                  >
                    Active
                  </Button>
                )}
              </Space>
            ),
          };
        })
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
