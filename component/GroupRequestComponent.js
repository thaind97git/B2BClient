import React, { useState } from "react";
import { connect } from "react-redux";
import Router from "next/router";
import { compose } from "redux";
import { Button, Space, Typography, Row, Select, Input } from "antd";
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

const dataSource = [
  {
    id: "1",
    key: "1",
    name: "Laptop Gaming Asus",
    createdBy: "Aggregator 1",
    product: "Laptop Gaming Asus RTZ 12000",
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
    name: "Iphone 12",
    createdBy: "Aggregator 2",
    product: "Iphone 12",
    category: "Mobile Phone",
    status: <GroupStatusComponent status={G_BIDDING} />,
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
    name: "Jean for men",
    createdBy: "Aggregator 3",
    product: "Blue Jean",
    category: "Cloth",
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
  {
    id: "2",
    key: "2",
    name: "Keyboard gaming",
    createdBy: "Aggregator 2",
    product: "Keyboard Razor Z2",
    category: "Keyboard",
    status: <GroupStatusComponent status={G_DONE} />,
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
    name: "Gaming Mouse",
    createdBy: "Aggregator 8",
    product: "Razor Mouse",
    category: "Mouse",
    status: <GroupStatusComponent status={G_ORDERED} />,
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
    name: "Headphone for listen to music",
    createdBy: "Aggregator 2",
    product: "Headphone G18",
    category: "HeadPhone",
    status: <GroupStatusComponent status={G_WAIT_FOR_AUCTION} />,
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
    name: "Watch Ben 10",
    createdBy: "Aggregator 14",
    product: "Watch from Ben",
    category: "Watch",
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
        searchProps={{
          searchMessage,
          setSearchMessage,
          exElement: (
            <div>
              <Search
                placeholder="Created By"
                onSearch={(value) => console.log(value)}
                style={{ width: 200 }}
                size="large"
              />
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
            </div>
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
