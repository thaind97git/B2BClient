import { Button, Drawer, Row, Typography, Cascader } from "antd";
import React, { Fragment, useState, useEffect } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE } from "../utils";
import Router from "next/router";
import { connect } from "react-redux";
// import { createStructuredSelector } from "reselect";
// import {
//   getProductPaging,
//   GetProductPagingData,
//   GetProductPagingError,
// } from "../stores/ProductState";
import AdminProductDetailsComponent from "./AdminProductDetailsComponent";
import FeedbackStatusComponent from "./Utils/FeedbackStatusComponent";
import { get } from "lodash/fp";
const { Title } = Typography;

let optionType = [
  {
    label: "All Type",
    value: "all",
  },
  {
    label: "System",
    value: "system",
  },
  {
    label: "Order",
    value: "order",
  },
  {
    label: "RFQ",
    value: "rfq",
  },
  {
    label: "Auction",
    value: "auction",
  }
];

const connectToRedux = connect(
  //   createStructuredSelector({
  //     productPagingData: GetProductPagingData,
  //     productPagingError: GetProductPagingError,
  //   }),
  //   (dispatch) => ({
  //     getProduct: (pageIndex, pageSize, searchMessage, dateRange, category) => {
  //       dispatch(
  //         getProductPaging({
  //           pageIndex,
  //           pageSize,
  //           categoryID: category,
  //           productName: searchMessage,
  //         })
  //       );
  //     },
  //   })
);

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "User",
    dataIndex: "user",
    key: "user",
  },
  {
    title: "Date created",
    dataIndex: "dateCreated",
    key: "dateCreated",
  },
  {
    title: "Date updated",
    dataIndex: "dateUpdated",
    key: "dateUpdated",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  // {
  //   title: "Date Created",
  //   dataIndex: "dateCreated",
  //   key: "dateCreated",
  // },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
  },
];

const AdminFeedbackManagementComponent = ({
  // productPagingData,
  // productPagingError,
  // getProduct,
}) => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [openDetails, setOpenDetails] = useState(false);
  // const [loading, setLoading] = useState(true);
  const [type, setType] = useState("all");

  //   useEffect(() => {
  //     if (productPagingError || productPagingData) {
  //       setLoading(false);
  //     }
  //   }, [productPagingError, productPagingData]);

  const getFeedbackTable = (feedbackData = []) => {
    return (
      feedbackData &&
      feedbackData.length > 0 &&
      feedbackData.map((feedback = {}) => ({
        key: feedback.id,
        title: feedback.title,
        dateCreated: feedback.dateCreated,
        dateUpdated: feedback.dateUpdated,
        user: feedback.user,
        status: (<FeedbackStatusComponent status={feedback.status}></FeedbackStatusComponent>),
        actions: (
          <Button
            onClick={() => {
              Router.push(`/admin/feedback/detail?id=${feedback.id}`);
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

  let feedbackData = [{ title: "123", id: "1", user: "quanghnd@gmail.com", dateCreated: "October 22, 2020 17:00 GTM", dateUpdated: "October 22, 2020 17:00 GTM", status: 0 }, { title: "123", id: "2", user: "duyquanghoang@gmail.com", dateCreated: "October 22, 2020 17:00 GTM", dateUpdated: "October 22, 2020 17:00 GTM", status: 1 }],
    totalCount = 0;
  //   if (productPagingData) {
  //     productData = productPagingData.data;
  //     totalCount = productPagingData.total;
  //   }

  return (
    <div>
      <Row justify="space-between">
        <Title level={4}>Feedback List</Title>
      </Row>
      <ReactTableLayout
        // loading={loading}
        // dispatchAction={getProduct}
        searchProps={{
          placeholder: "Search",
          searchMessage,
          setSearchMessage,
          exElement: (
            <Fragment>
              <Cascader
                placeholder="Select category"
                style={{width: "130px", margin: "-5px -14px", height: 35 }}
                options={optionType}
                // onChange={onChange}
                defaultValue={["all"]}
                // {...other}
              />
              <style jsx global>
                {`
          #search-product .ant-input.ant-cascader-input {
            height: 44px;
          }
        `}
              </style>
            </Fragment>
          ),
          exCondition: [type],
          isDateRange: false,
        }}
        dateRangeProps={{
          dateRange,
          setDateRange,
        }}
        data={getFeedbackTable(feedbackData || [])}
        columns={columns}
        totalCount={totalCount}
      />
    </div>
  );
};
export default connectToRedux(AdminFeedbackManagementComponent);
