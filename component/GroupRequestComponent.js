import React, { useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Button, Typography } from "antd";
import { Row } from "antd";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { DEFAULT_DATE_RANGE } from "../utils";
import Link from "next/link";
import { createLink } from "../libs";
import GroupStatusComponent from "./Utils/GroupStatusComponent";
import { G_BIDDING, G_CANCELED, G_DONE, G_WAITING } from "../enums/groupStatus";

const { Title } = Typography;

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
    name: (
      <Link href={createLink(["admin", "group", "details?id=1"])}>
        Laptop Gaming Asus
      </Link>
    ),
    createdBy: "Aggregator 1",
    category: "Apple",
    status: <GroupStatusComponent status={G_WAITING} />,
    dateCreated: "27/09/1999",
  },
  {
    id: "2",
    key: "2",
    name: (
      <Link href={createLink(["admin", "group", "details?id=1"])}>
        Iphone 12
      </Link>
    ),
    createdBy: "Aggregator 2",
    category: "Apple",
    status: <GroupStatusComponent status={G_BIDDING} />,
    dateCreated: "27/09/1999",
  },
  {
    id: "2",
    key: "2",
    name: (
      <Link href={createLink(["admin", "group", "details?id=1"])}>
        Iphone 12
      </Link>
    ),
    createdBy: "Aggregator 2",
    category: "Apple",
    status: <GroupStatusComponent status={G_CANCELED} />,
    dateCreated: "27/09/1999",
  },
  {
    id: "2",
    key: "2",
    name: (
      <Link href={createLink(["admin", "group", "details?id=1"])}>
        Iphone 12
      </Link>
    ),
    createdBy: "Aggregator 2",
    category: "Apple",
    status: <GroupStatusComponent status={G_DONE} />,
    dateCreated: "27/09/1999",
  },
];

const columns = [
  {
    title: "Group Name",
    dataIndex: "name",
    key: "name",
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

const GroupRequestComponent = () => {
  const [searchMessage, setSearchMessage] = useState("");
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  return (
    <div>
      <Row justify="space-between" align="middle">
        <Title level={3}>Group Management</Title>
        <Title>
          <Button type="primary">Create new group</Button>
        </Title>
      </Row>
      <ReactTableLayout
        searchProps={{
          searchMessage,
          setSearchMessage,
          // exElement: (
          //   <Fragment>
          //     <Select
          //       size="large"
          //       placeholder="Filter by category"
          //       style={{ width: 200 }}
          //       onChange={handleChange}
          //     >
          //       <OptGroup label="Category 1">
          //         <Option value="jack">Sub-1 Category 1</Option>
          //         <Option value="lucy">Sub-2 Category 1</Option>
          //       </OptGroup>
          //       <OptGroup label="Category 2">
          //         <Option value="Yiminghe">Sub-1 Category 1</Option>
          //       </OptGroup>
          //     </Select>
          //   </Fragment>
          // ),
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
