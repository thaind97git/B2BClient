import { Button, Drawer, Select, Space } from 'antd';
import React, { useState } from 'react';

import { displayCurrency, getFileAttach, getShortContent } from '../utils';
import Router, { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  GetAuctionHistoryData,
  GetAuctionHistory,
  getAuctionDetails,
  GetAuctionDetailsData
} from '../stores/AuctionState';
import ReactTableLayout from '../layouts/ReactTableLayout';
import { B_CLOSED, B_DONE } from '../enums/biddingStatus';
import UserProfileComponent from './UserProfileComponent';
import BiddingDocumentDetailsComponent from './BiddingDocumentDetailsComponent';
import { SUPPLIER } from '../enums/accountRoles';
const { Option } = Select;

const connectToRedux = connect(
  createStructuredSelector({
    auctionHistoryData: GetAuctionHistoryData,
    auctionDetailsData: GetAuctionDetailsData
  }),
  (dispatch) => ({
    getAuctionHistory: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange,
      auctionId,
      isDescending
    ) =>
      dispatch(
        GetAuctionHistory({
          pageIndex,
          pageSize,
          reverseAuctionId: auctionId,
          priceDescending: isDescending
        })
      ),
    getAuctionDetails: (id) => dispatch(getAuctionDetails(id))
  })
);

const BiddingResultListComponent = ({
  getAuctionHistory,
  auctionHistoryData,
  auctionDetailsData
}) => {
  const router = useRouter();
  const { id: auctionId } = router.query;
  const [openDetailsSupplier, setOpenDetailsSupplier] = useState(false);
  const [openBiddingDetails, setOpenBiddingDetails] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState({});
  const [currentDocument, setCurrentDocument] = useState({});
  const [isDescending, setIsDescending] = useState(false);

  const COLUMNS = [
    {
      title: 'Price',
      dataIndex: 'price',
      width: '30%'
    },
    {
      title: 'Files Attach',
      dataIndex: 'fileAttach'
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName'
    },
    {
      title: 'Actions',
      dataIndex: 'actions'
    }
  ];

  const renderData = (histories) => {
    return histories?.map((history) => {
      return {
        key: history.id,
        price: displayCurrency(history.bid),
        fileAttach: history.fileName ? (
          <a href={getFileAttach(history.id)} target="_blank" rel="noreferrer">
            {history.fileName}
          </a>
        ) : (
          'N/A'
        ),
        description: history.description
          ? getShortContent(history.description)
          : 'N/A',
        supplierName: (
          <Button
            type="link"
            size="small"
            onClick={() => {
              setOpenDetailsSupplier(true);
              setCurrentSupplier(history.supplier);
            }}
          >
            {`${history.supplier.firstName} ${history.supplier.lastName}`}
          </Button>
        ),
        actions: (
          <Space>
            {auctionDetailsData?.reverseAuctionStatus?.id === B_CLOSED && (
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  Router.push(
                    `/aggregator/order/confirmation-auction?reverseAuctionId=${auctionId}&bidId=${history.id}`
                  );
                }}
              >
                Closing deal
              </Button>
            )}
            <Button
              type="link"
              size="small"
              onClick={() => {
                setOpenBiddingDetails(true);
                setCurrentDocument(history);
              }}
            >
              View
            </Button>
          </Space>
        )
      };
    });
  };

  let histories = [],
    totalCount = 0;
  if (auctionHistoryData) {
    histories = auctionHistoryData.data;
    totalCount = auctionHistoryData.total;
  }
  return (
    <div>
      <Drawer
        width={640}
        title="Supplier Details"
        placement={'right'}
        closable={true}
        onClose={() => setOpenDetailsSupplier(false)}
        visible={openDetailsSupplier}
        key={'aggregator-drawer'}
      >
        {openDetailsSupplier ? (
          <UserProfileComponent
            isDrawer
            userId={(currentSupplier || {}).id}
            isAdmin
            role={SUPPLIER}
          />
        ) : null}
      </Drawer>
      <Drawer
        width={640}
        title="Supplier Bidding Documents"
        placement={'right'}
        closable={true}
        onClose={() => setOpenBiddingDetails(false)}
        visible={openBiddingDetails}
        key={'aggregator-drawer'}
      >
        {openBiddingDetails ? (
          <BiddingDocumentDetailsComponent
            document={currentDocument}
          />
        ) : null}
      </Drawer>
      <ReactTableLayout
        searchProps={{
          isDateRange: false,
          isSearch: false,
          exElement: (
            <Select
              size="large"
              placeholder="Filter by status"
              style={{ width: 140 }}
              onChange={(value) => setIsDescending(value)}
              defaultValue={isDescending}
            >
              <Option value={true}>Descending</Option>
              <Option value={false}>Ascending</Option>
            </Select>
          ),
          exCondition: [auctionId, isDescending]
        }}
        dispatchAction={getAuctionHistory}
        bordered
        dataSource={renderData(histories)}
        columns={COLUMNS}
        totalCount={totalCount}
      />
    </div>
  );
};

export default connectToRedux(BiddingResultListComponent);
