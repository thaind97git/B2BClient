import React, { useState } from "react";
import { connect } from "react-redux";
import Router from "next/router";
import { compose } from "redux";
import { Button, Typography, Row } from "antd";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DATE_TIME_FORMAT, DEFAULT_DATE_RANGE } from "../utils";
import GroupStatusComponent from "./Utils/GroupStatusComponent";
import { createLink } from "../libs";
import { createStructuredSelector } from "reselect";
import { getGroupPaging, GetGroupPagingData } from "../stores/GroupState";
import AllCategoryComponent from "./AllCategoryComponent";
import Moment from "react-moment";

const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    groupPagingData: GetGroupPagingData,
  }),
  (dispatch) => ({
    getGroupPaging: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange,
      categoryId
    ) =>
      dispatch(
        getGroupPaging({
          categoryId,
          productName: searchMessage,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
          pageIndex,
          pageSize,
        })
      ),
  })
);

const enhance = compose(connectToRedux);

const columns = [
  {
    title: "Group Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Product Name",
    dataIndex: "product",
    key: "product",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Date Created",
    dataIndex: "dateCreated",
    key: "dateCreated",
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
  },
];

const GroupRequestComponent = ({ getGroupPaging, groupPagingData }) => {
  const [searchMessage, setSearchMessage] = useState("");
  const [category, setCategory] = useState("1");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);

  const getGroupTable = (groupData = []) => {
    return (
      groupData &&
      groupData.length > 0 &&
      groupData.map((group = {}) => ({
        key: group.id,
        name: group.groupName,
        product: group.product.description,
        dateCreated: (
          <Moment format={DATE_TIME_FORMAT}>
            {new Date(group.dateCreated)}
          </Moment>
        ),
        status: <GroupStatusComponent status={group.groupStatus.id} />,
        actions: (
          <Button
            onClick={() => {
              Router.push(
                createLink(["aggregator", "group", `details?id=${group.id}`])
              );
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
  let groupData = [],
    total = 0;
  if (groupPagingData) {
    groupData = groupPagingData.data;
    total = groupPagingData.total;
  }
  return (
    <div>
      <Row justify="space-between" align="middle">
        <Title level={3}>Group Management</Title>
      </Row>
      <ReactTableLayout
        dispatchAction={getGroupPaging}
        searchProps={{
          placeholder: "Search By Group Name or Group Name",
          searchMessage,
          setSearchMessage,
          exElement: (
            <AllCategoryComponent
              onGetLastValue={(value) => {
                setCategory(value);
              }}
              size="large"
              isSearchStyle={false}
            />
          ),
          exCondition: [category],
        }}
        dateRangeProps={{
          dateRange,
          setDateRange,
        }}
        data={getGroupTable(groupData || [])}
        totalCount={total}
        columns={columns}
      />
    </div>
  );
};
export default enhance(GroupRequestComponent);
