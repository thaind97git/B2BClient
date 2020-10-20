import React, { useState, useEffect } from "react";
import { doDispatchAction } from "../utils";
import SearchTableComponent from "../component/SearchTableComponent";

import DateRangePickerComponent from "../component/DateRangePickerComponent";
import { Pagination, Row, Space, Table } from "antd";

const PAGE_SIZE_DEFAULT = 10,
  PAGE_DEFAULT = 1;

function itemRender(current, type, originalElement) {
  if (type === "prev") {
    return <a>Previous</a>;
  }
  if (type === "next") {
    return <a>Next</a>;
  }
  return originalElement;
}
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
    exCondition = [],
    exElement,
  } = searchProps;
  const otherCondition = exCondition.join(",");
  const { dateRange, setDateRange } = dateRangeProps;
  const [pageSizeTable, setPageSizeTable] = useState(pageSize);
  const [pageIndex, setPageIndex] = useState(page);
  // const [isFetchPaging, setIsFetchPaging] = useState(true);
  // const [visible, setVisible] = useState(false);
  // const [conditions, setConditions] = useState(exCondition);

  // useEffect(() => {
  //   if (hasPaging && !hasAction && isFetchPaging) {
  //     doDispatchAction(dispatchAction());
  //     setIsFetchPaging(false);
  //   }
  // }, [hasAction, hasPaging, dispatchAction, isFetchPaging]);

  useEffect(() => {
    if (hasAction && hasPaging) {
      doDispatchAction(
        dispatchAction(
          pageIndex,
          pageSizeTable,
          searchMessage,
          dateRange,
          otherCondition
        )
      );
    }
  }, [
    pageSizeTable,
    pageIndex,
    dateRange,
    searchMessage,
    dispatchAction,
    otherCondition,
    hasAction,
    hasPaging,
  ]);

  console.log({ totalCount });

  return (
    <div style={{ width: "100%" }}>
      {hasAction && (
        <Row justify="space-between" style={{ padding: "6px 4px" }}>
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
        pagination={false}
        dataSource={data}
        columns={columns}
        {...others}
      />
      {hasPaging && (
        <Pagination
          showSizeChanger
          current={pageIndex}
          onShowSizeChange={(current, pageSize) => {
            setPageSizeTable(pageSize);
          }}
          onChange={(pageIndex) => {
            setPageIndex(pageIndex);
          }}
          style={{ marginTop: 24 }}
          total={totalCount}
          itemRender={itemRender}
        />
      )}
    </div>
  );
};

export default ReactTableLayout;
