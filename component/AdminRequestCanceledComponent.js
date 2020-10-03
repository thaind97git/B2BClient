import { Button, Select, Tag } from "antd";
import React, { Fragment, useState } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE } from "../utils";
import { CloseCircleOutlined } from "@ant-design/icons";
const { Option, OptGroup } = Select;
const dataSource = [
  {
    key: "1",
    fromPrice: "60$",
    toPrice: "80$",
    category: (
      <Button type="link" href="#">
        Apple
      </Button>
    ),
    createdBy: "User 1",
    status: (
      <Tag icon={<CloseCircleOutlined />} color="error">
        Canceled
      </Tag>
    ),
    dateCreated: "30/09/2020 02:07:26 PM",
  },
  {
    key: "2",
    fromPrice: "60$",
    toPrice: "80$",
    category: (
      <Button type="link" href="#">
        Apple
      </Button>
    ),
    createdBy: "User 1",
    status: (
      <Tag icon={<CloseCircleOutlined />} color="error">
        Canceled
      </Tag>
    ),
    dateCreated: "30/09/2020 02:07:26 PM",
  },
  {
    key: "3",
    fromPrice: "60$",
    toPrice: "80$",
    category: (
      <Button type="link" href="#">
        Apple
      </Button>
    ),
    createdBy: "User 2",
    status: (
      <Tag icon={<CloseCircleOutlined />} color="error">
        Canceled
      </Tag>
    ),
    dateCreated: "30/09/2020 02:07:26 PM",
  },
  {
    key: "4",
    fromPrice: "60$",
    toPrice: "80$",
    category: (
      <Button type="link" href="#">
        Apple
      </Button>
    ),
    createdBy: "User 2",
    status: <Tag color="#f50">Rejected</Tag>,
    dateCreated: "30/09/2020 02:07:26 PM",
  },
  {
    key: "5",
    fromPrice: "60$",
    toPrice: "80$",
    category: (
      <Button type="link" href="#">
        Apple
      </Button>
    ),
    createdBy: "User 3",
    status: <Tag color="#f50">Rejected</Tag>,
    dateCreated: "30/09/2020 02:07:26 PM",
  },
];

const columns = [
  {
    title: "From Price",
    dataIndex: "fromPrice",
    key: "fromPrice",
  },
  {
    title: "To Price",
    dataIndex: "toPrice",
    key: "toPrice",
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
  // {
  //   title: "Group",
  //   dataIndex: "group",
  //   key: "group",
  // },
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
];
function handleChange(value) {
  console.log(`selected ${value}`);
}
const AdminRequestCanceledComponent = () => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  return (
    <div>
      <ReactTableLayout
        searchProps={{
          searchMessage,
          setSearchMessage,
          exElement: (
            <Fragment>
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
            </Fragment>
          ),
        }}
        dateRangeProps={{
          dateRange,
          setDateRange,
        }}
        data={dataSource}
        columns={columns}
      />
      {/* <Table dataSource={dataSource} columns={columns} /> */}
    </div>
  );
};

export default AdminRequestCanceledComponent;
