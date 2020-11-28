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
  Empty,
  Modal
} from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import MarkdownEditorComponent from './MarkdownEditorComponent';
import { displayCurrency, openNotification } from '../utils';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getGroupDetails,
  GetGroupDetailsData,
  GetGroupDetailsError
} from '../stores/GroupState';
import {
  createReverseAuction,
  CreateReverseAuctionData
} from '../stores/AuctionState';
const { Title } = Typography;
const { Option } = Select;

const connectToRedux = connect(
  createStructuredSelector({
    groupDetailsData: GetGroupDetailsData,
    groupDetailsError: GetGroupDetailsError,
    submitAuctionData: CreateReverseAuctionData
  }),
  (dispatch) => ({
    getGroupDetails: (id) => dispatch(getGroupDetails(id)),
    submitAuction: (values) => dispatch(createReverseAuction(values))
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
  return current && current < moment().startOf('day');
}
function disabledDateTime() {
  return {
    disabledHours: () => {
      return range(0, 24).splice(0, new Date().getHours());
    },
    disabledMinutes: () => {
      const currentMinute = new Date().getMinutes();
      let disable = currentMinute + 5;
      if (currentMinute >= 55) {
        disable = 0;
      }
      return range(0, disable);
    },
    disabledSeconds: () => range(0, 60)
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
  groupDetailsError,
  submitAuction,
  submitAuctionData
}) => {
  const [brief, setBrief] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
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
    if (!(values.brief || {}).value) {
      openNotification('error', {
        message: "Please input the auction's brief"
      });
      return;
    }
    values.quantity = values.quantity + '';
    values.currentPrice = values.currentPrice + '';
    values.minimumDuration = +values.minimumDuration;
    values.dynamicClosePeriod = +values.dynamicClosePeriod;
    values.minimumBidChange = +values.minimumBidChange;
    values.maximumBidChange = +values.maximumBidChange;
    values.groupId = groupId;
    values.description = (values.brief || {}).value;
    values.auctionStartTime = new Date(values.auctionStartTime);
    Modal.confirm({
      title: 'Are you sure you want to create auction?',
      okText: 'Submit',
      cancelText: 'Cancel',
      onOk: () => {
        submitAuction(values);
      }
    });
  };

  useEffect(() => {
    if (submitAuctionData) {
      setIsDoneSetting(true);
      setDefaultTab('2');
    }
  }, [submitAuctionData, setDefaultTab, setIsDoneSetting]);

  useEffect(() => {
    setCurrentValue(quantity * currentPrice);
  }, [currentPrice, quantity]);

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
          dynamicClosePeriod: 'none',
          minimumDuration: '10',
          minimumBidChange: minBidChange,
          maximumBidChange: maxBidChange,
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
              label="Current Price"
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
            <Form.Item label="Current Value" name="currentValue">
              <Title level={4}>{displayCurrency(currentValue)}</Title>Average
              price in unit: {displayCurrency(Math.floor(averagePrice))}
              <br />
              Min RFQ price: {displayCurrency(minPrice)} - Max RFQ price:{' '}
              {displayCurrency(maxPrice)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Brief"
              name="brief"
              rules={[
                {
                  required: true,
                  message: "Please input the auction's brief"
                }
              ]}
            >
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
              name="auctionStartTime"
              rules={[
                {
                  required: true,
                  message: 'Please choose action start time'
                },
                {
                  validator: async (_, dateTime) => {
                    if (dateTime < moment(new Date()).add(5, 'm').toDate()) {
                      return Promise.reject(
                        new Error(
                          'You just could select date time after current date time 5 minutes'
                        )
                      );
                    }
                  }
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
              name="dynamicClosePeriod"
              rules={[
                {
                  required: true,
                  message: 'Please enter the dynamic close period'
                }
              ]}
            >
              <Select onChange={handleChange} style={{ width: '100%' }}>
                <Option value={0}>None</Option>
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
                  name="minimumBidChange"
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
                  name="maximumBidChange"
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
            <Button htmlType="submit" size="large" type="primary">
              Save & Go to Next Step
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connectToRedux(BiddingSettingComponent);
