import {
  Button,
  Col,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
  Form,
  Empty
} from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import MarkdownEditorComponent from './MarkdownEditorComponent';
import { displayCurrency } from '../utils';
import {
  currencyFormatter,
  currencyParser,
  currencyValue
} from '../libs/currencyFormatter';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getGroupDetails,
  GetGroupDetailsData,
  GetGroupDetailsError
} from '../stores/GroupState';
import { get, max } from 'lodash/fp';
const { Title } = Typography;
const { Option } = Select;

const connectToRedux = connect(
  createStructuredSelector({
    groupDetailsData: GetGroupDetailsData,
    groupDetailsError: GetGroupDetailsError
  }),
  (dispatch) => ({
    getGroupDetails: (id) => dispatch(getGroupDetails(id))
  })
);

function handleChange(value) {
  console.log(`Selected: ${value}`);
}
function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}
function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}
function disabledDateTime() {
  return {
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56]
  };
}
const styles = {
  colStyle: {
    padding: '0px 8px'
  }
};
const BiddingSettingComponent = ({
  setIsDoneSetting,
  setDefaultTab,
  getGroupDetails,
  groupDetailsData,
  groupDetailsError
}) => {
  const [brief, setBrief] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [qualificationValue, setQualificationValue] = useState(0);
  const [qualificationPrice, setQualificationPrice] = useState(0);
  const [minBidChange, setMinBidChange] = useState(0.5);
  const [maxBidChange, setMaxBidChange] = useState(10);
  const [quantity, setQuantity] = useState(0);
  const router = useRouter();
  const { groupId } = router.query;

  useEffect(() => {
    if (groupId) {
      getGroupDetails(groupId);
    }
  }, [groupId, getGroupDetails]);

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    setIsDoneSetting(true);
  };

  useEffect(() => {
    setCurrentValue(quantity * currentPrice);
  }, [currentPrice, quantity]);
  useEffect(() => {
    setQualificationValue(quantity * qualificationPrice);
  }, [qualificationPrice, quantity]);

  useEffect(() => {
    console.log({ currentValue });
  }, [currentValue]);

  useEffect(() => {
    if (groupDetailsData) {
      setQuantity(groupDetailsData.quantity);
    }
  }, [groupDetailsData]);

  if (!groupDetailsData || groupDetailsError) {
    return <Empty description="Can not find any group!" />;
  }

  const {
    groupName,
    product = {},
    averagePrice,
    maxPrice,
    minPrice
  } = groupDetailsData;
  const { productName, unitOfMeasure = {}, id } = product;
  return (
    <div>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          group: groupName,
          productName: productName,
          dynamic: 'none',
          minimumDuration: '10',
          minimumBid: minBidChange,
          maximumBid: maxBidChange,
          currency: 'VNĐ',
          units: unitOfMeasure.description,
          quantity: groupDetailsData.quantity
        }}
      >
        <Row>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Auction Name"
              name="auctionName"
              rules={[
                {
                  required: true,
                  message: 'Please enter the auction name'
                }
              ]}
            >
              <Input placeholder="Enter the auction name" />
            </Form.Item>
          </Col>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Group"
              name="group"
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label={
                <div>
                  Product Name{' '}
                  <Button type="link" size="small">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`/product-details?id=${id}`}
                    >
                      View details
                    </a>
                  </Button>
                </div>
              }
              name="productName"
              rules={[
                {
                  required: true,
                  message: 'Please enter the product name'
                }
              ]}
            >
              <Input readOnly placeholder="Enter the product name" />
            </Form.Item>
          </Col>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Currency"
              name="currency"
              rules={[
                {
                  required: true,
                  message: 'Please choose currency'
                }
              ]}
            >
              <Select disabled>
                <Option value="vnd">VNĐ</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Quantity of UoM's"
              name="quantity"
              rules={[
                {
                  required: true,
                  message: "Please enter the Quantity of UoM's"
                }
              ]}
            >
              <InputNumber readOnly style={{ width: '100%' }} type="number" />
            </Form.Item>
          </Col>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Unit of Measure (UoM)"
              name="units"
              rules={[
                {
                  required: true,
                  message: 'Please enter the Unit of Measure (UoM)'
                }
              ]}
            >
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Current Price (Not show to participants)"
              name="currentPrice"
              rules={[
                {
                  required: true,
                  message: 'Please enter the current price'
                }
              ]}
            >
              <InputNumber
                onChange={(value) => {
                  setCurrentPrice(value);
                }}
                placeholder="Enter the current price"
                style={{ width: '100%' }}
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/,*/g, '')}
              />
            </Form.Item>
          </Col>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Current Value (Not show to participants)"
              name="currentValue"
            >
              <Title level={4}>{displayCurrency(currentValue)}</Title>Average
              price in unit: {displayCurrency(Math.floor(averagePrice))}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Qualification Price"
              name="quaPrice"
              rules={[
                {
                  required: true,
                  message: 'Please enter the qualification price'
                }
              ]}
            >
              <InputNumber
                placeholder="Enter the qualification price"
                style={{ width: '100%' }}
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/,*/g, '')}
                onChange={(value) => setQualificationPrice(value)}
              />
            </Form.Item>
          </Col>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item label="Qualification Value" name="quaValue">
              <Title level={4}>{displayCurrency(qualificationValue)} </Title>{' '}
              Min RFQ price: {displayCurrency(minPrice)} - Max RFQ price:{' '}
              {displayCurrency(maxPrice)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item label="Brief" name="brief">
              <MarkdownEditorComponent value={brief} setValue={setBrief} />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Title level={5}>Auction Information</Title>
        <Row>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Auction start time"
              name="startTime"
              rules={[
                {
                  required: true,
                  message: 'Please choose action start time'
                }
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={disabledDate}
                disabledTime={disabledDateTime}
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              />
            </Form.Item>
          </Col>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Minimum Duration"
              name="minimumDuration"
              rules={[
                {
                  required: true,
                  message: 'Please enter the minimum duration'
                }
              ]}
            >
              <Select onChange={handleChange} style={{ width: '100%' }}>
                <Option value={10}>10 Minutes</Option>
                <Option value={15}>15 Minutes</Option>
                <Option value={30}>30 Minutes</Option>
                <Option value={60}>60 Minutes</Option>
                <Option value={120}>2 Hours</Option>
                <Option value={240}>4 Hours</Option>
                <Option value={480}>8 Hours</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Dynamic Close Period"
              name="dynamic"
              rules={[
                {
                  required: true,
                  message: 'Please enter the dynamic close period'
                }
              ]}
            >
              <Select onChange={handleChange} style={{ width: '100%' }}>
                <Option value="none">None</Option>
                <Option value={1}>Last minute</Option>
                <Option value={2}>Last 2 minutes</Option>
                <Option value={5}>Last 5 minutes</Option>
                <Option value={10}>Last 10 minutes</Option>
                <Option value={15}>Last 15 minutes</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="Minimum Bid Change"
                  name="minimumBid"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the minimum bid change'
                    }
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    onChange={(value) => setMinBidChange(value)}
                    min={0}
                    max={maxBidChange}
                    suffix="%"
                  />
                </Form.Item>
              </Col>
              <Col span={12} style={styles.colStyle}>
                <Form.Item
                  label="Maximum Bid Change"
                  name="maximumBid"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the maximum bid change'
                    }
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={minBidChange}
                    max={100}
                    onChange={(value) => {
                      setMaxBidChange(value);
                    }}
                    suffix="%"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Form.Item>
          <Row style={{ padding: 24 }} justify="end">
            <Button
              htmlType="submit"
              onClick={() => setDefaultTab('2')}
              size="large"
              type="primary"
            >
              Save & Go to Next Step
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connectToRedux(BiddingSettingComponent);
