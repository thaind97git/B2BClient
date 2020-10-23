import React, { useState } from "react";
import { connect } from "react-redux";
import Router from "next/router";
import { compose } from "redux";
import { Button, Space, Typography, Row, Select, Input, Tooltip } from "antd";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE } from "../utils";
import GroupStatusComponent from "./Utils/GroupStatusComponent";
import {
  G_BIDDING,
  G_DONE,
  G_FAILED,
  G_NEGOTIATING,
  G_ORDERED,
  G_PENDING,
  G_WAIT_FOR_AUCTION,
} from "../enums/groupStatus";
import { createLink } from "../libs";

const { Title } = Typography;
const { Option, OptGroup } = Select;
const { Search } = Input;

const connectToRedux = connect();
/*createStructuredSelector({
        userLoginData: userLoginDataSelector,
    }),
    (dispatch) => ({
        loginUser: ({ email, password }) =>
            dispatch(userLogin({ email, password })),
    })*/

const enhance = compose(connectToRedux);
const displayGroupName = (name) =>
  name ? (name.length >= 40 ? name.slice(0, 40) : name) + " ..." : "";
const dataSource = [
  {
    id: "1",
    key: "1",
    name: "Group A7 Action Camera 4k HD720P - 02/10/2020",
    createdBy: "Aggregator 1",
    product: (
      <Tooltip title="A7 Action Camera 4k HD720P Sports Camera Waterproof video cam 2.0 inches LCD Screen 170 Lens Waterproof Sports Camera">
        <a
          rel="noreferrer"
          target="_blank"
          href={createLink(["product-details?productId=1"])}
        >
          {displayGroupName(
            "A7 Action Camera 4k HD720P Sports Camera Waterproof video cam 2.0 inches LCD Screen 170 Lens Waterproof Sports Camera"
          )}
        </a>
      </Tooltip>
    ),
    category: "Laptop",
    status: <GroupStatusComponent status={G_PENDING} />,
    dateCreated: "27/09/1999",
    actions: (
      <Space>
        <Button
          type="link"
          size="small"
          onClick={() => {
            Router.push("/aggregator/group/details?id=1");
          }}
        >
          View
        </Button>
      </Space>
    ),
  },
  {
    id: "2",
    key: "2",
    name: "Group A7 Action Camera 4k HD720P - 23/10/2020",
    createdBy: "Aggregator 2",
    product: (
      <Tooltip title="A7 Action Camera 4k HD720P Sports Camera Waterproof video cam 2.0 inches LCD Screen 170 Lens Waterproof Sports Camera">
        <a
          rel="noreferrer"
          target="_blank"
          href={createLink(["product-details?productId=1"])}
        >
          {displayGroupName(
            "A7 Action Camera 4k HD720P Sports Camera Waterproof video cam 2.0 inches LCD Screen 170 Lens Waterproof Sports Camera"
          )}
        </a>
      </Tooltip>
    ),
    category: "Mobile Phone",
    status: <GroupStatusComponent status={G_NEGOTIATING} />,
    dateCreated: "27/09/1999",
    actions: (
      <Space>
        <Button
          type="link"
          size="small"
          onClick={() => {
            Router.push("/aggregator/group/details?id=1");
          }}
        >
          View
        </Button>
      </Space>
    ),
  },
  {
    id: "2",
    key: "2",
    name: "Group Sally Hansen Xtreme Wear Daycream - 19-09-2020",
    createdBy: "Aggregator 3",
    product: (
      <Tooltip title="Sally Hansen Xtreme Wear Daycream">
        <a
          rel="noreferrer"
          target="_blank"
          href={createLink(["product-details?productId=1"])}
        >
          {displayGroupName("Sally Hansen Xtreme Wear Daycream")}
        </a>
      </Tooltip>
    ),
    category: "Cloth",
    status: <GroupStatusComponent status={G_PENDING} />,
    dateCreated: "27/09/1999",
    actions: (
      <Space>
        <Button
          type="link"
          size="small"
          onClick={() => {
            Router.push("/aggregator/group/details?id=1");
          }}
        >
          View
        </Button>
      </Space>
    ),
  },
  {
    id: "2",
    key: "2",
    name: "Group Apple Watch Sport Band (44mm) - 08-09-2020",
    createdBy: "Aggregator 2",
    product: (
      <Tooltip title="Apple Watch Sport Band (44mm)">
        <a
          rel="noreferrer"
          target="_blank"
          href={createLink(["product-details?productId=1"])}
        >
          {displayGroupName("Apple Watch Sport Band (44mm)")}
        </a>
      </Tooltip>
    ),
    category: "Keyboard",
    status: <GroupStatusComponent status={G_FAILED} />,
    dateCreated: "27/09/1999",
    actions: (
      <Space>
        <Button
          type="link"
          size="small"
          onClick={() => {
            Router.push("/aggregator/group/details?id=1");
          }}
        >
          View
        </Button>
      </Space>
    ),
  },
];

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
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Created By",
    dataIndex: "createdBy",
    key: "createdBy",
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

function handleChange(value) {
  console.log(`selected ${value}`);
}

const GroupRequestComponent = () => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  return (
    <div>
      <Row justify="space-between" align="middle">
        <Title level={3}>Group Management</Title>
      </Row>
      <ReactTableLayout
        dispatchAction={() => {}}
        searchProps={{
          placeholder: "Group Name or Created By",
          searchMessage,
          setSearchMessage,
          exElement: (
            <Space>
              <Select
                size="large"
                placeholder="Filter by category"
                style={{ width: 200 }}
                onChange={handleChange}
              >
                <OptGroup label="Category 1">
                  <Option value="jack">Sub-1 Category 1</Option>
                  <Option value="lucy">Sub-2 Category 1</Option>
                </OptGroup>
                <OptGroup label="Category 2">
                  <Option value="Yiminghe">Sub-1 Category 1</Option>
                </OptGroup>
              </Select>
            </Space>
          ),
        }}
        dateRangeProps={{
          dateRange,
          setDateRange,
        }}
        data={dataSource}
        columns={columns}
      />
    </div>
  );
};
export default enhance(GroupRequestComponent);
