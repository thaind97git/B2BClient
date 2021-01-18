import React, { useState } from 'react';
import { Button, Modal, Select } from 'antd';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import SupplierSubmitNewBidComponent from './SupplierSubmitNewBidComponent';
import {
  GetAuctionHistory,
  GetAuctionHistoryData
} from '../stores/AuctionState';
import ReactTableLayout from '../layouts/ReactTableLayout';
import { useRouter } from 'next/router';
import { displayCurrency, getFileAttach, getShortContent } from '../utils';
const { Option } = Select;
const connectToRedux = connect(
  createStructuredSelector({
    historyData: GetAuctionHistoryData
  }),
  (dispatch) => ({
    getSupplierBiddingHistory: (
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
      )
  })
);

const SupplierAddNewBidComponent = ({
  getSupplierBiddingHistory,
  historyData
}) => {
  const [openSubmitBid, setOpenSubmitBid] = useState(false);
  const router = useRouter();
  const { id: auctionId } = router.query;
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
      title: 'Description',
      dataIndex: 'description'
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
          : 'N/A'
      };
    });
  };

  let histories = [],
    totalCount = 0;
  if (historyData) {
    histories = historyData.data;
    totalCount = historyData.total;
  }
  return (
    <div>
      <Modal
        footer={false}
        title="Submit new bid"
        centered
        visible={openSubmitBid}
        onOk={() => setOpenSubmitBid(false)}
        onCancel={() => setOpenSubmitBid(false)}
        width={840}
      >
        {openSubmitBid ? (
          <SupplierSubmitNewBidComponent
            callbackSubmitBid={() => {
              getSupplierBiddingHistory(1, 10, '', {}, auctionId, isDescending);
            }}
            setOpenSubmitBid={setOpenSubmitBid}
          />
        ) : null}
      </Modal>
      <Button
        onClick={() => {
          setOpenSubmitBid(true);
        }}
        type="primary"
        style={{
          marginBottom: 16
        }}
      >
        Add new bid
      </Button>
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
        dispatchAction={getSupplierBiddingHistory}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={renderData(histories)}
        columns={COLUMNS}
        totalCount={totalCount}
      />
    </div>
  );
};

export default connectToRedux(SupplierAddNewBidComponent);
