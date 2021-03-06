import React, { useState, useEffect } from 'react';
import { doDispatchAction } from '../utils';
import SearchTableComponent from '../component/SearchTableComponent';

import DateRangePickerComponent from '../component/DateRangePickerComponent';
import { Col, Pagination, Row, Space, Table } from 'antd';

const PAGE_SIZE_DEFAULT = 10,
  PAGE_DEFAULT = 1;

function itemRender(current, type, originalElement) {
  if (type === 'prev') {
    return <a>Previous</a>;
  }
  if (type === 'next') {
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
    isDateRange = true,
    isSearch = true,
    placeholderDateRange = ['Start date', 'End date']
  } = searchProps;
  const otherCondition = exCondition.join('~');
  const { dateRange, setDateRange } = dateRangeProps;
  const [pageSizeTable, setPageSizeTable] = useState(pageSize);
  const [pageIndex, setPageIndex] = useState(page);

  useEffect(() => {
    if (hasPaging && !hasAction) {
      typeof dispatchAction === 'function' &&
        doDispatchAction(
          dispatchAction(pageIndex, pageSizeTable, ...otherCondition.split('~'))
        );
    }
  }, [
    hasAction,
    hasPaging,
    dispatchAction,
    otherCondition,
    pageIndex,
    pageSizeTable
  ]);

  useEffect(() => {
    if (hasAction && hasPaging) {
      typeof dispatchAction === 'function' &&
        doDispatchAction(
          dispatchAction(
            pageIndex,
            pageSizeTable,
            searchMessage,
            dateRange,
            ...otherCondition.split('~')
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
    hasPaging
  ]);

  return (
    <div style={{ width: '100%' }}>
      {hasAction && (
        <Row justify="space-between" style={{ padding: '6px 4px' }}>
          <Col xs={24} sm={12} lg={10}>
            {isSearch && (
              <SearchTableComponent
                searchMessage={searchMessage}
                setSearchMessage={setSearchMessage}
                placeholder={placeholder}
                dispatchAction={dispatchAction}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            )}
          </Col>
          <Col xs={24} sm={12} lg={14}>
            <Row justify="end">
              <Space>
                {exElement}
                {isDateRange && (
                  <DateRangePickerComponent
                    placeholder={placeholderDateRange}
                    small
                    setDateRange={setDateRange}
                  />
                )}
              </Space>
            </Row>
          </Col>
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
        <Row justify="end">
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
        </Row>
      )}
    </div>
  );
};

export default ReactTableLayout;
