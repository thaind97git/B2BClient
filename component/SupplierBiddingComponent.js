import React, { Fragment, useEffect, useState } from 'react';
import { Empty, Row, Select, Space, Tabs } from 'antd';
import { ApartmentOutlined, ClusterOutlined } from '@ant-design/icons';
import SupplierBiddingItemComponent from './SupplierBiddingItemComponent';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  auctionFilter,
  AuctionFilterData,
  AuctionFilterError,
  AuctionFilterResetter,
  ResponseAuctionInvitationData,
  ResponseAuctionInvitationResetter
} from '../stores/AuctionState';
import AllCategoryComponent from './AllCategoryComponent';
import {
  B_ACTIVE,
  B_CANCELED,
  B_CLOSED,
  B_DONE,
  B_FAILED,
  B_FEATURE
} from '../enums/biddingStatus';
import { DEFAULT_PAGING_INFO } from '../utils';

const { TabPane } = Tabs;
const { Option } = Select;
const connectToRedux = connect(
  createStructuredSelector({
    auctionFilterData: AuctionFilterData,
    auctionFilterError: AuctionFilterError,
    responseInvitationData: ResponseAuctionInvitationData
  }),
  (dispatch) => ({
    auctionFilter: ({
      pageIndex,
      pageSize,
      searchMessage,
      status,
      categoryId,
      isInvitation,
      isDescending
    }) =>
      dispatch(
        auctionFilter({
          pageIndex,
          pageSize,
          name: searchMessage,
          status,
          categoryId,
          isInvitation,
          orderByDateDescending: isDescending
        })
      ),
    resetResponseInvitation: () => dispatch(ResponseAuctionInvitationResetter),
    resetAuctionFilter: () => dispatch(AuctionFilterResetter)
  })
);
const callAuctionFilter = ({
  key,
  auctionFilter,
  page,
  pageSize,
  categoryId,
  isDescending
}) => {
  let isInvitation, status;
  if (key === '1') {
    isInvitation = true;
    status = [B_FEATURE];
  } else if (key === '2') {
    isInvitation = 'false';
    status = [B_FEATURE, B_ACTIVE];
  } else {
    status = [B_CLOSED, B_CANCELED, B_FAILED, B_DONE];
  }
  auctionFilter({
    pageIndex: page,
    pageSize,
    categoryId,
    isInvitation,
    isDescending,
    status
  });
};

const SupplierBiddingComponent = ({
  auctionFilter,
  auctionFilterData,
  responseInvitationData,
  resetResponseInvitation,
  resetAuctionFilter
}) => {
  const [currentTab, setCurrentTab] = useState('1');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(DEFAULT_PAGING_INFO.page);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGING_INFO.pageSize);
  const [isDescending, setIsDescending] = useState('true');

  useEffect(() => {
    callAuctionFilter({
      key: currentTab,
      auctionFilter,
      page,
      pageSize,
      categoryId: category,
      isDescending
    });
  }, [currentTab, page, pageSize, category, isDescending, auctionFilter]);

  useEffect(() => {
    if (!!responseInvitationData) {
      callAuctionFilter({
        key: currentTab,
        auctionFilter,
        page,
        pageSize,
        categoryId: category,
        isDescending
      });
      resetResponseInvitation();
    }
  }, [responseInvitationData]);
  let auctionData = [],
    totalCount;
  if (auctionFilterData) {
    auctionData = auctionFilterData.data;
    totalCount = auctionFilterData.total;
  }
  return (
    <Fragment>
      <Row justify="end">
        <Space>
          <AllCategoryComponent
            onGetLastValue={(value) => setCategory(value)}
            size="large"
            isSearchStyle={false}
          />
          <Select
            size="large"
            onChange={(value) => setIsDescending(value)}
            placeholder="Sort by"
            style={{
              width: '200px',
              margin: '0 4px'
            }}
          >
            <Option value={'true'}>Newest</Option>
            <Option value={'false'}>Oldest</Option>
          </Select>
        </Space>
      </Row>
      <Tabs
        defaultActiveKey="1"
        onChange={(key) => {
          resetAuctionFilter();
          setCurrentTab(key);
        }}
      >
        <TabPane
          tab={
            <span>
              <ApartmentOutlined />
              Event invitations
            </span>
          }
          key="1"
        >
          {!!auctionData && auctionData.length > 0 ? (
            auctionData.map((event, index) => {
              return new Date(event.auctionStartTime) > Date.now() ? (
                <SupplierBiddingItemComponent
                  bidding={event}
                  key={index}
                  isInvitation={true}
                />
              ) : null;
            })
          ) : (
            <Empty description="Empty record" />
          )}
        </TabPane>
        <TabPane
          tab={
            <span>
              <ClusterOutlined />
              Accepted events
            </span>
          }
          key="2"
        >
          {!!auctionData && auctionData.length > 0 ? (
            auctionData.map((event, index) => (
              <SupplierBiddingItemComponent bidding={event} key={index} />
            ))
          ) : (
            <Empty description="Empty record" />
          )}
        </TabPane>
        <TabPane
          tab={
            <span>
              <ClusterOutlined />
              Closed events
            </span>
          }
          key="3"
        >
          {!!auctionData && auctionData.length > 0 ? (
            auctionData.map((event, index) => (
              <SupplierBiddingItemComponent
                closed
                bidding={event}
                key={index}
              />
            ))
          ) : (
            <Empty description="Empty record" />
          )}
        </TabPane>
      </Tabs>
    </Fragment>
  );
};

export default connectToRedux(SupplierBiddingComponent);
