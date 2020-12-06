import {
  Card,
  Col,
  DatePicker,
  Empty,
  Row,
  Skeleton,
  Space,
  Table,
  Tabs,
  Tag,
  Typography
} from 'antd';
import React, { useState , useEffect} from 'react';
import LeaderboardAggregatorComponent from './LeaderboardAggregatorComponent';
import LeaderboardBuyerComponent from './LeaderboardBuyerComponent';
import LeaderboardProductComponent from './LeaderboardProductComponent';
import LeaderboardSupplierComponent from './LeaderboardSupplierComponent';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  GetRFQStatisticData,
  getRFQStatistic,
  GetRFQStatisticResetter,
  GetRFQStatisticError,
  GetAuctionStatisticData,
  getAuctionStatistic,
  GetAuctionStatisticError,
  GetAuctionStatisticResetter
} from '../stores/DashboardState';
let G2Plot;
if (process.browser) {
  G2Plot = require('@ant-design/charts');
}
const { Title } = Typography;
const { TabPane } = Tabs;

const connectToRedux = connect(
  createStructuredSelector({
    rfqStatictic: GetRFQStatisticData,
    rfqStaticticError: GetRFQStatisticError,
    auctionStatictic: GetAuctionStatisticData,
    auctionStaticticError: GetAuctionStatisticError
  }),
  (dispatch) => ({
    getRFQStatistic: (fromDate) => dispatch(getRFQStatistic(fromDate)),
    getAuctionStatistic: (fromDate) => dispatch(getAuctionStatistic(fromDate)),
    resetDataRFQ: () => {
      dispatch(GetRFQStatisticResetter);
    },
    resetDataAuction: () => {
      dispatch(GetAuctionStatisticResetter);
    }
  })
);

const getRFQStatisticDataPie = (dataRFQ = []) => {
  return (
    dataRFQ &&
    dataRFQ.length > 0 &&
    dataRFQ.map((status = {}) => ({
      type: status?.requestStatus?.description,
      value: status?.total
    }))
  );
};

const getAuctionStatisticDataPie = (dataAuction = []) => {
  return (
    dataAuction &&
    dataAuction.length > 0 &&
    dataAuction.map((status = {}) => ({
      type: status?.reverseAuctionStatus?.description,
      value: status?.total
    }))
  );
};

const dataAuction = [
  { type: 'Closed', value: 30 },
  { type: 'Failed', value: 50 },
  { type: 'Done', value: 40 },
  { type: 'Canceled', value: 50 }
];

const AdminDashBoardComponent = ({
  rfqStatictic,
  rfqStaticticError,
  getRFQStatistic,
  resetDataRFQ,
  auctionStatictic,
  auctionStaticticError,
  getAuctionStatistic,
  resetDataAuction
}) => {
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(null);

  useEffect(() => {
    setLoading(true);
    getRFQStatistic(null);
    getAuctionStatistic(null);
  }, [getRFQStatistic, getAuctionStatistic]);

  useEffect(() => {
    if (
      rfqStatictic ||
      rfqStaticticError ||
      auctionStatictic ||
      auctionStaticticError
    ) {
      setLoading(false);
    }
  }, [
    rfqStatictic,
    rfqStaticticError,
    auctionStatictic,
    auctionStaticticError
  ]);

  useEffect(() => {
    return () => {
      resetDataRFQ();
      resetDataAuction();
    };
  }, [resetDataRFQ, resetDataAuction]);

  if (loading) {
    return <Skeleton active />;
  }

  const configRequest = {
    width: 380,
    autoFit: false,
    appendPadding: 10,
    data: getRFQStatisticDataPie(rfqStatictic),
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0,
    meta: {
      value: {
        formatter: (v) => v>1?`${v} RFQs`:`${v} RFQ`
      }
    },
    label: {
      type: 'inner',
      offset: '-50%',
      autoRotate: false,
      style: { textAlign: 'center' },
      formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`
    },
    statistic: {
      title: {
        offsetY: -8
      },
      content: {
        offsetY: -4
      }
    }
  };
  const configAuction = {
    width: 380,
    autoFit: false,
    appendPadding: 10,
    data: getAuctionStatisticDataPie(auctionStatictic),
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0,
    meta: {
      value: {
        formatter: (v) => (v > 1 ? `${v} Auctions` : `${v} Auctions`)
      }
    },
    label: {
      type: 'inner',
      offset: '-50%',
      autoRotate: false,
      style: { textAlign: 'center' },
      formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`
    },
    statistic: {
      title: {
        offsetY: -8
      },
      content: {
        offsetY: -4
      }
    }
  };

  function onRFQChange(date, dateString) {
    //resetData();
    getRFQStatistic(dateString + '-01');
  }

  function onAuctionChange(date, dateString) {
    //resetData();
    getAuctionStatistic(dateString + '-01');
  }

  function onDateChange(date, dateString) {
    //resetData();
    setDate(dateString + '-01');
  }

  return (
    <Row justify="space-around">
      <Col md={24} lg={12}>
        <Card
          title={
            <Row justify="space-between">
              <Title level={4}>RFQ Statistic</Title>
              <DatePicker picker="month" onChange={onRFQChange} />
            </Row>
          }
          style={{ width: '98%' }}
          bordered={false}
        >
          <Row justify="center">
            {rfqStatictic ? (
              rfqStatictic.length === 0 ? (
                <Empty description="No RFQ of this month"></Empty>
              ) : (
                G2Plot && <G2Plot.Pie {...configRequest} />
              )
            ) : (
              <Empty description="No RFQ of this month"></Empty>
            )}
          </Row>
        </Card>
      </Col>
      <Col md={24} lg={12}>
        <Card
          title={
            <Row justify="space-between">
              <Title level={4}>Reverse Auction Statistic</Title>
              <DatePicker picker="month" onChange={onAuctionChange} />
            </Row>
          }
          style={{ width: '98%', float: 'right' }}
          bordered={false}
        >
          <Row justify="center">
            {auctionStatictic ? (
              auctionStatictic.length === 0 ? (
                <Empty description="No auction of this month"></Empty>
              ) : (
                G2Plot && <G2Plot.Pie {...configAuction} />
              )
            ) : (
              <Empty description="No auction of this month"></Empty>
            )}
          </Row>
        </Card>
      </Col>
      <Col span={24} style={{ marginTop: 32 }}>
        <Card
          title={
            <Row justify="space-between">
              <Title level={4}>Leaderboard Top 10</Title>
              <DatePicker picker="month" onChange={onDateChange} />
            </Row>
          }
          style={{ width: '100%' }}
          bordered={false}
        >
          <div className="card-container">
            <Tabs type="card">
              <TabPane tab="Product" key="1">
                <LeaderboardProductComponent date={date} />
              </TabPane>
              <TabPane tab="Supplier" key="2">
                <LeaderboardSupplierComponent date={date} />
              </TabPane>
              <TabPane tab="Buyer" key="3">
                <LeaderboardBuyerComponent date={date} />
              </TabPane>
              <TabPane tab="Aggregator" key="4">
                <LeaderboardAggregatorComponent date={date} />
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </Col>
      {/* <Col span={24} style={{ marginTop: 32 }}>
        <Row justify="center">
          <Col span={24}>
            <Card
              title={
                <Row justify="space-between">
                  <Title level={4}>Product Leaderboard</Title>
                  <DatePicker picker="month" />
                </Row>
              }
              style={{ width: '100%' }}
              bordered={false}
            >
              <Table columns={columns} dataSource={dataTable} />
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={24} style={{ marginTop: 32 }}>
        <Row justify="center">
          <Col span={24}>
            <Card
              title={
                <Row justify="space-between">
                  <Title level={4}>Supplier Leaderboard</Title>
                  <DatePicker picker="month" />
                </Row>
              }
              style={{ width: '100%' }}
              bordered={false}
            >
              <Table columns={columns} dataSource={dataTable} />
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={24} style={{ marginTop: 32 }}>
        <Row justify="center">
          <Col span={24}>
            <Card
              title={
                <Row justify="space-between">
                  <Title level={4}>Buyer Leaderboard</Title>
                  <DatePicker picker="month" />
                </Row>
              }
              style={{ width: '100%' }}
              bordered={false}
            >
              <Table columns={columns} dataSource={dataTable} />
            </Card>
          </Col>
        </Row>
      </Col> */}
    </Row>
  );
};

export default connectToRedux(AdminDashBoardComponent);