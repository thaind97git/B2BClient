import { Card, Col, Descriptions, Row, Space } from 'antd';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import React from 'react';
import ReactTableLayout from '../layouts/ReactTableLayout';
import { displayCurrency } from '../utils';
import DisplayStarComponent from './Utils/DisplayStarComponent';
const columns = [
  {
    title: 'Feedback From',
    dataIndex: 'from',
    key: 'from'
  },
  {
    title: 'Average Rating',
    dataIndex: 'averageRating',
    key: 'averageRating'
  },
  {
    title: 'View Details',
    dataIndex: 'detail',
    key: 'detail'
  }
];

const OrderFeedbackDetailsListComponent = ({ getOrderFeedbackList }) => {
  const getFeedbackTable = (feedbackData = []) => {
    return (
      feedbackData &&
      feedbackData.length > 0 &&
      feedbackData.map((feedback = {}) => {
        return {
          key: feedback.id,
          from: 'buyer1@gmail.com',
          averageRating: <DisplayStarComponent star={3.5} />,
          detail: (
            <Space>
              <a
                target="_blank"
                rel="noreferrer"
                href={`/admin/order/feedback?id=${feedback.id}`}
              >
                Feedback
              </a>
              |
              <a
                target="_blank"
                rel="noreferrer"
                href={`/admin/order/feedback?id=${feedback.id}`}
              >
                RFQ
              </a>
            </Space>
          )
        };
      })
    );
  };
  let feedbackData = [],
    totalCount = 0;
  feedbackData = [
    {
      id: '1'
    }
  ];
  totalCount = 1;
  return (
    <Row>
      <Card
        style={{ width: '100%' }}
        bordered={false}
        title={<b>Order Information</b>}
      >
        <Col span={24}>
          <Descriptions title="Group Name: (Group Name here)">
            <Descriptions.Item span={3} label="Product Name">
              Product Name here
            </Descriptions.Item>
            <Descriptions.Item label="Aggregator">
              aggregator1@gmail.com
            </Descriptions.Item>
            <Descriptions.Item label="Total Quantity">
              100 Units
            </Descriptions.Item>
            <Descriptions.Item label=" Unit Price">
              {displayCurrency(200000)}
            </Descriptions.Item>
            <Descriptions.Item label="Order Average Rating">
              <DisplayStarComponent star={3.5} />
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Card>
      <Col span={24}>
        <br />
      </Col>
      {/* <Card
        style={{ width: '100%' }}
        bordered={false}
        title={<b>Supplier Information</b>}
      >
        <div>
          Supplier: <b>supplier1@gmail.com</b>
        </div>
      </Card>
      <Col span={24}>
        <br />
      </Col> */}
      <Card
        style={{ width: '100%' }}
        bordered={false}
        title={
          <Row justify="space-between" align="middle">
            <Col span={16}>
              <b>List Feedback</b>
            </Col>
            <Col span={8}>
              <Card bordered={false} size="small">
                <div style={{ textAlign: 'right' }}>
                  <Space>
                    {'supplier1@gmail.com'}
                    <MailOutlined />
                  </Space>
                  <br />
                  <Space>
                    {'0123456789'}
                    <PhoneOutlined />
                  </Space>
                  <br />
                </div>
              </Card>
            </Col>
          </Row>
        }
      >
        <ReactTableLayout
          totalCount={totalCount}
          // loading={loading}
          dispatchAction={getOrderFeedbackList}
          searchProps={{
            // exCondition: [supplierId],
            isDateRange: false,
            isSearch: false
          }}
          data={getFeedbackTable(feedbackData || [])}
          columns={columns}
        />
      </Card>
    </Row>
  );
};

export default OrderFeedbackDetailsListComponent;
