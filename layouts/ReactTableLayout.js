import React, { forwardRef, useState, useEffect } from "react";
import { doDispatchAction } from "../utils";
import cx from "classnames";
import SearchTableComponent from "../component/SearchTableComponent";

import DateRangePickerComponent from "../component/DateRangePickerComponent";
import { Button, Dropdown, Menu, Pagination, Row, Space, Table } from "antd";
import { DownOutlined } from "@ant-design/icons";

const PAGE_SIZE_DEFAULT = 10,
  PAGE_DEFAULT = 0;

// const useStyles = makeStyles((theme) => ({
//   searchSection: {
//     paddingTop: theme.spacing(1),
//     background: "white",
//   },
//   dateRangeMobile: {
//     [theme.breakpoints.down("xs")]: {
//       marginTop: theme.spacing(2),
//       marginBottom: theme.spacing(2),
//     },
//   },
//   dateRange: {
//     padding: `0px ${theme.spacing(1)}px`,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   searchMobile: {
//     [theme.breakpoints.down("xs")]: {
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//     },
//   },
//   dividerMobile: {
//     display: "block",
//     [theme.breakpoints.up("sm")]: {
//       display: "none",
//     },
//   },
// }));

function itemRender(current, type, originalElement) {
  if (type === "prev") {
    return <a>Previous</a>;
  }
  if (type === "next") {
    return <a>Next</a>;
  }
  return originalElement;
}
const { SubMenu, Item } = Menu;
const menu = (
  <Menu>
    <Item key="1">Bags & Shoes </Item>
    <SubMenu title="Category 1">
      <Item>Lip Care</Item>
      <Item>Products for Men</Item>
      <Item>Feminine Hygiene & Sexual Assistance</Item>
      <Item>Teeth care</Item>
      <Item>Makeup Accessories</Item>
    </SubMenu>
    <SubMenu title="Category 2">
      <Item>Lip Care</Item>
      <Item>Products for Men</Item>
      <Item>Feminine Hygiene & Sexual Assistance</Item>
      <Item>Teeth care</Item>
      <Item>Makeup Accessories</Item>
    </SubMenu>
    <SubMenu title="Category 3">
      <Item>Lip Care</Item>
      <Item>Products for Men</Item>
      <Item>Feminine Hygiene & Sexual Assistance</Item>
      <Item>Teeth care</Item>
      <Item>Makeup Accessories</Item>
    </SubMenu>
    <SubMenu title="Category 4">
      <Item>Lip Care</Item>
      <Item>Products for Men</Item>
      <Item>Feminine Hygiene & Sexual Assistance</Item>
      <Item>Teeth care</Item>
      <Item>Makeup Accessories</Item>
    </SubMenu>
  </Menu>
);
const ReactTableLayout = ({
  data = [],
  columns = [],
  dispatchAction,
  totalCount,
  pageSize = PAGE_SIZE_DEFAULT,
  t,
  page = PAGE_DEFAULT,
  style = {},
  options = {},
  components = {},
  searchProps = {},
  dateRangeProps = {},
  hasAction = true,
  hasPaging = true,

  ...others
}) => {
  const {
    searchMessage,
    setSearchMessage,
    placeholder,
    exCondition,
    exElement,
  } = searchProps;
  const { dateRange, setDateRange } = dateRangeProps;
  // const classes = useStyles();
  const [pageSizeTable, setPageSizeTable] = useState(pageSize);
  const [pageIndex, setPageIndex] = useState(page);
  const [isFetchPaging, setIsFetchPaging] = useState(true);
  const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   if (hasPaging && !hasAction && isFetchPaging) {
  //     doDispatchAction(dispatchAction());
  //     setIsFetchPaging(false);
  //   }
  // }, [hasAction, hasPaging, dispatchAction, isFetchPaging]);

  // useEffect(() => {
  //   if (hasAction && hasPaging) {
  //     doDispatchAction(
  //       dispatchAction(
  //         pageIndex,
  //         pageSizeTable,
  //         searchMessage,
  //         dateRange,
  //         exCondition
  //       )
  //     );
  //   }
  // }, [
  //   pageSizeTable,
  //   pageIndex,
  //   dateRange,
  //   searchMessage,
  //   dispatchAction,
  //   exCondition,
  //   hasAction,
  //   hasPaging,
  // ]);

  useEffect(() => {
    console.log({ dateRange });
  }, [dateRange]);

  return (
    <div>
      {hasAction && (
        <Row
          justify="space-between"
          style={{ padding: "6px 4px" }}
          // direction="column"
          // className={cx(classes.searchSection, "shadow")}
        >
          <Row xs={24} sm={12} lg={14}>
            <SearchTableComponent
              searchMessage={searchMessage}
              setSearchMessage={setSearchMessage}
              placeholder={placeholder}
              dispatchAction={dispatchAction}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </Row>
          <Row item xs={24} sm={12} lg={10}>
            <Space>
              {exElement}
              <DateRangePickerComponent
                t={t}
                small
                setDateRange={setDateRange}
              />
            </Space>
          </Row>
        </Row>
      )}
      <Table
        bordered
        onShowSizeChange={(current, pageSize) => {
          console.log(current, pageSize);
          setPageSizeTable(pageSize);
        }}
        onChange={(pageIndex) => {
          setPageIndex(pageIndex);
        }}
        pagination={false}
        dataSource={data}
        columns={columns}
        {...others}
      />
      <Pagination
        style={{ marginTop: 24 }}
        total={totalCount || 200}
        itemRender={itemRender}
      />
      {/* <MaterialTable
        {...others}
        style={Object.assign(
          {},
          {
            width: '100%',
            boxShadow:
              '0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1)'
          },
          style
        )}
        options={Object.assign(
          {},
          {
            search: false,
            showTitle: false,
            paginationType: 'stepped',
            pageSize: pageSize,
            padding: 'dense',
            paging: hasPaging ? true : false
          },
          options
        )}
        components={Object.assign(
          {},
          {
            Toolbar: () => <div></div>
          },
          components
        )}
        
        totalCount={totalCount}
        page={pageIndex}
        onChangePage={pageIndex => {
          setPageIndex(pageIndex);
        }}
        onChangeRowsPerPage={pageSize => {
          setPageSizeTable(pageSize);
        }}
        columns={columns.map(
          ({ headerStyle = {}, cellStyle = {}, ...others }) => ({
            headerStyle: Object.assign(
              {},
              {
                textTransform: 'uppercase',
                fontWeight: 'bold'
              },
              headerStyle
            ),
            cellStyle: Object.assign({}, { whiteSpace: 'nowrap' }, cellStyle),
            ...others
          })
        )}
        data={data}
      /> */}
    </div>
  );
};

export default ReactTableLayout;
