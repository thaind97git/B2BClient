import { Button, Select, Drawer } from "antd";
import React, { Fragment, useState } from "react";
import {
  R_BIDDING,
  R_GROUPED,
  R_NEGOTIATING,
  R_WAIT_FOR_AUCTION,
} from "../enums/requestStatus";
import ReactTableLayout from "../layouts/ReactTableLayout";
import {
  DATE_TIME_FORMAT,
  DEFAULT_DATE_RANGE,
  displayCurrency,
} from "../utils";
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
const { Option, OptGroup } = Select;
const connectToRedux = connect(
  createStructuredSelector({
    requestPagingData: GetRequestPagingData,
    requestPagingError: GetRequestPagingError,
  }),
  (dispatch) => ({
    getRequest: (pageIndex, pageSize, searchMessage, dateRange, status) => {
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
    title: "Group",
    dataIndex: "group",
    key: "group",
  },
  // {
  //   title: "Date Created",
  //   dataIndex: "dateCreated",
  //   key: "dateCreated",
  // },
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

function handleChange(value) {
  console.log(`selected ${value}`);
}

const statusFilter = [R_GROUPED, R_BIDDING, R_WAIT_FOR_AUCTION, R_NEGOTIATING];
const AdminRequestProcessingComponent = ({
  requestPagingData,
  requestPagingError,
  getRequest,
}) => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentRequestSelected, setCurrentRequestSelected] = useState({});
  const [category, setCategory] = useState("1");
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
  const dataSource = [
    {
      key: "4",
      price: displayCurrency(1200000),
      name: "IR Night Vision Hidden Camera Watch Sport Wear Watch Camera WIFI",
      quantity: 50,
      createdBy: "User 2",
      group: (
        <a
          rel="noreferrer"
          target="_blank"
          href={createLink(["aggregator", "group", "details?id=1"])}
        >
          Group IR Night Vision Hidden Camera Watch Sport - 23/10/2020
        </a>
      ),
      status: <RequestStatusComponent status={R_GROUPED} />,
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "5",
      price: displayCurrency(1190000),
      name: "IR Night Vision Hidden Camera Watch Sport Wear Watch Camera WIFI",
      category: "Mobile Phone",
      quantity: 30,
      group: (
        <a
          rel="noreferrer"
          target="_blank"
          href={createLink(["aggregator", "group", "details?id=1"])}
        >
          Group IR Night Vision Hidden Camera Watch Sport - 02/10/2020
        </a>
      ),
      status: <RequestStatusComponent status={R_GROUPED} />,
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "5",
      price: displayCurrency(1180000),
      name: "IR Night Vision Hidden Camera Watch Sport Wear Watch Camera WIFI",
      category: "Mobile Phone",
      quantity: 140,
      group: (
        <a
          rel="noreferrer"
          target="_blank"
          href={createLink(["aggregator", "group", "details?id=1"])}
        >
          Group IR Night Vision Hidden Camera Watch Sport - 02/10/2020
        </a>
      ),
      status: <RequestStatusComponent status={R_GROUPED} />,
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
  ];

  let requestData = [],
    totalCount = 0;
  if (requestPagingData) {
    requestData = requestPagingData.data;
    totalCount = requestPagingData.total;
  }
  return (
    <div>
      <ReactTableLayout
        // dispatchAction={getRequest}
        searchProps={{
          placeholder: "Search by product name",
          searchMessage,
          setSearchMessage,
          exElement: (
            <Fragment>
              <AllCategoryComponent
                onGetLastValue={(value) => setCategory(value)}
                size="large"
                isSearchStyle={false}
              />
            </Fragment>
          ),
          exCondition: [statusFilter, category],
        }}
        dateRangeProps={{
          dateRange,
          setDateRange,
        }}
        data={dataSource}
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
        <RequestDetailsComponent
          isSupplier={false}
          requestId={(currentRequestSelected || {}).id}
        />
      </Drawer>
    </div>
  );
};

export default connectToRedux(AdminRequestProcessingComponent);
