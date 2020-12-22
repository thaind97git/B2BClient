import {
  Collapse,
  Row,
  Table,
  Typography,
  List,
  Button,
  Col,
  Tag,
  Modal
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  CaretRightOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { DATE_TIME_FORMAT, displayCurrency, getUtcTime } from '../utils';
import Router, { useRouter } from 'next/router';
import SignalR from '../libs/signalR';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  GetAuctionHistoryData,
  GetAuctionHistory,
  getAuctionDetails
} from '../stores/AuctionState';
import { get } from 'lodash/fp';
import moment from 'moment';
import ScrollToBottom from 'react-scroll-to-bottom';
import { B_ACTIVE, B_CLOSED, B_DONE, B_FUTURE } from '../enums/biddingStatus';
import Countdown from 'antd/lib/statistic/Countdown';
const { Panel } = Collapse;
const { Link, Title } = Typography;

const signalR = new SignalR({
  hubDomain: 'reverseAuctionHub'
});
signalR.startConnection();

const connectToRedux = connect(
  createStructuredSelector({
    auctionHistoryData: GetAuctionHistoryData
  }),
  (dispatch) => ({
    getAuctionHistory: (id) => dispatch(GetAuctionHistory(id)),
    getAuctionDetails: (id) => dispatch(getAuctionDetails(id))
  })
);

const columns = [
  {
    title: <b>CURRENT VALUE</b>,
    dataIndex: 'currentValue',
    key: 'currentValue',
    render: (text) => displayCurrency(text)
  },
  {
    title: <b># BIDS</b>,
    dataIndex: 'noBids',
    key: 'noBids'
  },
  {
    title: <b>BEST BID VALUE</b>,
    dataIndex: 'bestBid',
    key: 'bestBid',
    render: (text) => <Link>{displayCurrency(text)}</Link>
  },
  {
    title: <b>LEAD SUPPLIER</b>,
    dataIndex: 'leadSupplier',
    key: 'leadSupplier'
  },
  {
    title: <b>SAVING OFFERED</b>,
    dataIndex: 'savingOffered',
    key: 'savingOffered',
    render: (text, row) => {
      const saving = row.currentValue - row.bestBid;
      const percentageSaving = (saving / row.currentValue) * 100;
      return (
        <span>
          {displayCurrency(saving)} (
          <span style={{ color: 'green' }}>
            {percentageSaving ? percentageSaving.toFixed(2) : 0} %
          </span>
          )
        </span>
      );
    }
  },
  {
    title: <b># ACTIVE SUPPLIER</b>,
    dataIndex: 'active',
    key: 'active'
  }
];

const getActiveSupplier = ({ biddingHistory = [] }) => {
  let suppliers = [];
  biddingHistory.forEach((bid = {}) => {
    const supId = (bid.supplier || {}).id;
    if (!suppliers.includes(supId)) {
      suppliers.push(supId);
    }
  });
  return suppliers.length;
};
const getRecordHistory = ({ auctionData = [] }) => {
  return (
    (auctionData &&
      auctionData.map((auction) => {
        let result = `${moment
          .utc(auction.dateCreated)
          .local()
          .format(DATE_TIME_FORMAT)} - ${get('supplier.description')(
          auction
        )} placed a bid of ${displayCurrency(auction.price)}.`;
        return result;
      })) ||
    []
  );
};

const BiddingResultListComponent = ({
  getAuctionHistory,
  auctionHistoryData,
  auction,
  reverseAuctionId,
  getAuctionDetails
}) => {
  const [biddingHistory, setBiddingHistory] = useState([]);
  const [result, setResult] = useState({});
  const [firstTime, setFirstTime] = useState(true);
  const [newHistory, setNewHistory] = useState(null);
  const [isEnd, setIsEnd] = useState(false);
  const router = useRouter();
  const { id: auctionId } = router.query;
  const [deadline, setDeadLine] = useState(null);
  function onFinish() {
    console.log('finished');
    Modal.info({
      keyboard: false,
      title: 'Reverse Auction has ended',
      icon: <ExclamationCircleOutlined />,
      // content: 'Click  re',
      okText: 'Refresh',
      cancelText: false,
      onOk: () => {
        getAuctionDetails(auctionId);
      }
    });
  }
  useEffect(() => {
    if (auction && firstTime) {
      const { id } = auction;
      getAuctionHistory(id);
      setFirstTime(false);
    }
  }, [auction, getAuctionHistory, firstTime]);

  // Set history at the first load
  useEffect(() => {
    if (auctionHistoryData && auction) {
      setBiddingHistory(auctionHistoryData);
      const lastBid = auctionHistoryData[auctionHistoryData.length - 1] || {};
      const src = {
        currentValue: auction.currentPrice,
        noBids: auctionHistoryData.length,
        bestBid: Math.floor(lastBid.price),
        leadSupplier: (lastBid.supplier || {}).description,
        active: getActiveSupplier({ biddingHistory: auctionHistoryData })
      };
      setResult(src);
    }
  }, [auctionHistoryData, auction]);

  useEffect(() => {
    if (biddingHistory && biddingHistory.length > 0 && !firstTime) {
      const lastBid = biddingHistory[biddingHistory.length - 1] || {};
      const src = {
        currentValue: auction.currentPrice,
        noBids: biddingHistory.length,
        bestBid: Math.floor(lastBid.price),
        leadSupplier: (lastBid.supplier || {}).description,
        active: getActiveSupplier({ biddingHistory })
      };
      setResult(src);
    }
  }, [biddingHistory, firstTime, auction.currentPrice]);

  useEffect(() => {
    if (!!newHistory) {
      if (newHistory.actualDuration) {
        setDeadLine(
          new Date(getUtcTime(auction?.auctionStartTime)).getTime() +
            1000 * 60 * newHistory?.actualDuration
        );
      }
      const lastHistory = !!biddingHistory
        ? biddingHistory?.[biddingHistory?.length - 1]
        : null;
      if (!lastHistory) {
        console.log('Empty history');
        setBiddingHistory([newHistory]);
      } else if (
        lastHistory.reverseAuctionHistoryId !==
          newHistory.reverseAuctionHistoryId &&
        newHistory.reverseAuctionId === auction.id
      ) {
        const cloneHistory = [...biddingHistory];
        setBiddingHistory([...cloneHistory, newHistory]);
      }
      setNewHistory(null);
      console.log('-----End-----');
    }
  }, [newHistory]);

  useEffect(() => {
    if (auction && auction.actualDuration && auction.auctionStartTime) {
      setDeadLine(
        new Date(getUtcTime(auction.auctionStartTime)).getTime() +
          1000 * 60 * auction.actualDuration
      );
    }
  }, [auction]);

  useEffect(() => {
    signalR.onListen('NewBid', (history) => {
      console.log('-----Start-----');
      console.log('[Aggregator] Received new bid ');
      if (!!history) {
        setNewHistory(history);
      }
    });
  }, []);
  useEffect(() => {
    signalR.onListen('AuctionClosed', (id) => {
      console.log('Closed ne: ', id, auction?.id);
      if (id === auction?.id) {
        setIsEnd(true);
      }
    });
  }, [auction]);

  // useEffect(() => {
  //   if (isEnd) {
  //     Modal.info({
  //       keyboard: false,
  //       title: 'Reverse Auction has ended',
  //       icon: <ExclamationCircleOutlined />,
  //       // content: 'Click  re',
  //       okText: 'Refresh',
  //       cancelText: false,
  //       onOk: () => {
  //         getAuctionDetails(auctionId);
  //       }
  //     });
  //     setIsEnd(false);
  //   }
  // }, [isEnd]);
  return (
    <Row style={{ width: '100%' }}>
      <Row justify="end" style={{ width: '100%', marginBottom: 8 }}>
        <Col>
          {auction?.reverseAuctionStatus?.id === B_ACTIVE ? (
            <div style={{ position: 'relative' }}>
              <Tag color="blue">
                <Row align="middle">
                  <Title style={{ fontWeight: 500, marginBottom: 0 }} level={5}>
                    Time Remaining:{' '}
                  </Title>
                  <span>&nbsp;</span>
                  {deadline && (
                    <Countdown title="" value={deadline} onFinish={onFinish} />
                  )}
                </Row>
              </Tag>
            </div>
          ) : auction?.reverseAuctionStatus?.id === B_FUTURE ? (
            <Tag
              style={{ display: 'flex', alignItems: 'center' }}
              color="warning"
            >
              Event has not started yet!
            </Tag>
          ) : (
            [B_DONE, B_CLOSED].includes(auction?.reverseAuctionStatus?.id) && (
              <Tag style={{ display: 'flex', alignItems: 'center' }}>
                Event has been closed!
              </Tag>
            )
          )}
        </Col>
      </Row>
      <Collapse
        style={{ width: '100%', marginBottom: 40 }}
        bordered={false}
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        className="site-collapse-custom-collapse"
      >
        <Panel
          header="Live Reverse Auction Feed"
          key="1"
          className="site-collapse-custom-panel"
        >
          <ScrollToBottom>
            <div style={{ height: 200 }}>
              <List
                size="small"
                dataSource={getRecordHistory({
                  auctionData: biddingHistory || []
                })}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </div>
          </ScrollToBottom>
        </Panel>
      </Collapse>
      <Table
        pagination={false}
        style={{ width: '100%' }}
        columns={columns}
        dataSource={[result]}
      />
      <Row justify="start" style={{ marginTop: 32 }}>
        <Button
          disabled={
            get('reverseAuctionStatus.id')(auction) === B_CLOSED ? false : true
          }
          type="primary"
          onClick={() => {
            Router.push(
              `/aggregator/order/confirmation-auction?reverseAuctionId=${reverseAuctionId}`
            );
          }}
        >
          Create Order
        </Button>
      </Row>
    </Row>
  );
};

export default connectToRedux(BiddingResultListComponent);
