import { Button, Select, Drawer, Row, Typography } from "antd";
import React, { Fragment, useState } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE, displayCurrency } from "../utils";
import RequestStatusComponent from "./Utils/RequestStatusComponent";
import RequestDetailsComponent from "./RequestDetailsComponent";
import {
  R_CANCELED,
  R_DONE,
  R_ORDERED,
  R_REJECTED,
} from "../enums/requestStatus";
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
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "2",
      name: "Iphone 5",
      category: "Mobile Phone",
      unit: "units",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "3",
      name: "Iphone 5",
      category: "Mobile Phone",
      unit: "units",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "4",
      name: "Iphone 5",
      category: "Mobile Phone",
      unit: "units",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "5",
      name: "Iphone 5",
      category: "Mobile Phone",
      unit: "units",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
    {
      key: "6",
      name: "Iphone 5",
      category: "Mobile Phone",
      unit: "units",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: (
        <Button onClick={() => setOpenDetails(true)} size="small" type="link">
          View
        </Button>
      ),
    },
  ];
  return (
    <div>
      <Row justify="space-between">
        <Title level={4}>Product List</Title>
        <Button onClick={() => {}} type="primary">
          <a href="/admin/product/create" target="_blank">
            Create new product
          </a>
        </Button>
      </Row>
      <ReactTableLayout
        dispatchAction={() => {}}
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
      <Drawer
        width={640}
        title="RFQ details"
        placement={"right"}
        closable={true}
        onClose={() => setOpenDetails(false)}
        visible={openDetails}
        key={"right"}
      >
        <RequestDetailsComponent isSupplier={false} />
      </Drawer>
    </div>
  );
};
export default AdminProductManagementComponent;
