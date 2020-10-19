import { Button, Select, Drawer, Row, Typography } from "antd";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE, displayCurrency } from "../utils";
import { createLink } from "../libs";
const { Option, OptGroup } = Select;
const { Title } = Typography;

const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Unit of measure",
    dataIndex: "unit",
    key: "unit",
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
const AdminProductManagementComponent = () => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [openDetails, setOpenDetails] = useState(false);

  const dataSource = [
    {
      key: "1",
      name: "Iphone 5",
      category: "Mobile Phone",
      unit: "units",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Link href={createLink(["admin", "product", `details?id=${1}`])}>
          View
        </Link>
      ),
    },
    {
      key: "2",
      name: "Iphone 5",
      category: "Mobile Phone",
      unit: "units",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Link href={createLink(["admin", "product", `details?id=${1}`])}>
          View
        </Link>
      ),
    },
    {
      key: "3",
      name: "Iphone 5",
      category: "Mobile Phone",
      unit: "units",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Link href={createLink(["admin", "product", `details?id=${1}`])}>
          View
        </Link>
      ),
    },
    {
      key: "4",
      name: "Iphone 5",
      category: "Mobile Phone",
      unit: "units",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Link href={createLink(["admin", "product", `details?id=${1}`])}>
          View
        </Link>
      ),
    },
    {
      key: "5",
      name: "Iphone 5",
      category: "Mobile Phone",
      unit: "units",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Link href={createLink(["admin", "product", `details?id=${1}`])}>
          View
        </Link>
      ),
    },
    {
      key: "6",
      name: "Iphone 5",
      category: "Mobile Phone",
      unit: "units",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Link href={createLink(["admin", "product", `details?id=${1}`])}>
          View
        </Link>
      ),
    },
  ];
  return (
    <div>
      <Row justify="space-between">
        <Title level={4}>Product List</Title>
        <Button onClick={() => { }} type="primary">
          <a href="/admin/product/create" target="_blank">
            Create new product
          </a>
        </Button>
      </Row>
      <ReactTableLayout
        dispatchAction={() => { }}
        searchProps={{
          placeholder: "Search by product name",
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
export default AdminProductManagementComponent;
