import { Button, Select, Drawer, Row, Typography } from "antd";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE, displayCurrency } from "../utils";
import { createLink } from "../libs";
import AllCategoryComponent from "./AllCategoryComponent";
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
      name: "Apple Watch Sport Band (44mm) - Cyprus Green - Regular",
      category: "Mobile Phone",
      unit: "units",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: <Link href="#">View</Link>,
    },
    {
      key: "2",
      name: "Sally Hansen Xtreme Wear Daycream",
      category: "Cords",
      unit: "Chains",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: <Link href="#">View</Link>,
    },
    {
      key: "3",
      name: "BEST PENTIUM PRO GOLD CERAMIC CPU SCRAP / HIGH GRADE CPU SCRAP",
      category: "CPUs",
      unit: "units",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: <Link href="#">View</Link>,
    },
    {
      key: "4",
      name: "Factory price is high quality and cheap Single Head Cutting Saw",
      category: "Building Material Making Machinery Parts",
      unit: "units",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: <Link href="#">View</Link>,
    },
    {
      key: "5",
      name:
        "7Inch 2 din touch screen Car Multimedia MP5 player with Bluetooth functions",
      category: "Auto Electrical Systems",
      unit: "Pieces",
      dateCreated: "30/09/2020 02:07:26 PM",
      actions: <Link href="#">View</Link>,
    },
  ];
  return (
    <div>
      <Row justify="space-between">
        <Title level={4}>Product List</Title>
        <Button onClick={() => {}} type="primary">
          <a href="/admin/product/create">Create new product</a>
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
              <AllCategoryComponent size="large" isSearchStyle={false} />
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
    </div>
  );
};
export default AdminProductManagementComponent;
