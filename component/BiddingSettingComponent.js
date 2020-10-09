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
} from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
import MarkdownEditorComponent from "./MarkdownEditorComponent";
import { displayCurrency } from "../utils";
import {
  currencyFormatter,
  currencyParser,
  currencyValue,
} from "../libs/currencyFormatter";
const { Title } = Typography;
const { Option } = Select;
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
  return current && current < moment().endOf("day");
}
function disabledDateTime() {
  return {
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  };
}
const styles = {
  colStyle: {
    padding: "0px 8px",
  },
};
const BiddingSettingComponent = ({ setIsDoneSetting, setDefaultTab }) => {
  const [brief, setBrief] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [qualificationValue, setQualificationValue] = useState(0);
  const [qualificationPrice, setQualificationPrice] = useState(0);
  const [quantity, setQuantity] = useState(11);
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
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
  return (
    <div>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          dynamic: "none",
          minimumDuration: "10",
          minimumBid: 0.5,
          maximumBid: 10,
          currency: "VNĐ",
          units: "units",
          quantity: quantity,
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
                  message: "Please enter the auction name",
                },
              ]}
            >
              <Input placeholder="Enter the auction name" />
            </Form.Item>
          </Col>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Select Group"
              name="group"
              rules={[
                {
                  required: true,
                  message: "Please select group",
                },
              ]}
            >
              <Select showSearch={true} placeholder="Search by group name">
                <Option value="l">Laptop Gaming Asus</Option>
                <Option value="j">Jean for men</Option>
                <Option value="k">Keyboard gaming</Option>
                <Option value="g">Gaming Mouse</Option>
                <Option value="h">Headphone for listen to music</Option>
                <Option value="w">Watch Ben 10</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Product Name"
              name="productName"
              rules={[
                {
                  required: true,
                  message: "Please enter the product name",
                },
              ]}
            >
              <Input placeholder="Enter the product name" />
            </Form.Item>
          </Col>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Currency"
              name="currency"
              rules={[
                {
                  required: true,
                  message: "Please choose currency",
                },
              ]}
            >
              <Select>
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
                  message: "Please enter the Quantity of UoM's",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                value={quantity}
                onChange={(value) => setQuantity(value)}
                type="number"
              />
            </Form.Item>
          </Col>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Unit of Measure (UoM)"
              name="units"
              rules={[
                {
                  required: true,
                  message: "Please enter the Unit of Measure (UoM)",
                },
              ]}
            >
              <Select>
                <Option value="pieces">Pieces</Option>
                <Option value="bags">Bags</Option>
                <Option value="boxes">Boxes</Option>
                <Option value="cartons">Cartons</Option>
                <Option value="feet">Feet</Option>
                <Option value="units">Units</Option>
                <Option value="kilograms">Kilograms</Option>
                <Option value="Miles">Miles</Option>
              </Select>
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
                  message: "Please enter the current price",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={currencyFormatter(currencyValue)}
                parser={currencyParser}
                value={currentPrice}
                onChange={(value) => {
                  setCurrentPrice(value);
                }}
              />
            </Form.Item>
          </Col>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Current Value (Not show to participants)"
              name="currentValue"
            >
              <Title level={4}>{displayCurrency(currentValue)}</Title>
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
                  message: "Please enter the qualification price",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={currencyFormatter(currencyValue)}
                parser={currencyParser}
                value={qualificationPrice}
                onChange={(value) => setQualificationPrice(value)}
                prefix="đ"
              />
            </Form.Item>
          </Col>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item label="Qualification Value" name="quaValue">
              <Title level={4}>{displayCurrency(qualificationValue)}</Title>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={20} style={styles.colStyle}>
            <Form.Item
              label="Brief"
              name="brief"
              rules={
                [
                  // {
                  //   required: true,
                  //   message: "Please enter the brief",
                  // },
                  // ({ getFieldValue }) => ({
                  //   validator(rule, value) {
                  //     console.log({ value });
                  //     if (value) {
                  //       return Promise.resolve();
                  //     }
                  //     return Promise.reject("Please enter the brief");
                  //   },
                  // }),
                ]
              }
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
              name="startTime"
              rules={[
                {
                  required: true,
                  message: "Please choose action start time",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={disabledDate}
                disabledTime={disabledDateTime}
                showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
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
                  message: "Please enter the minimum duration",
                },
              ]}
            >
              <Select onChange={handleChange} style={{ width: "100%" }}>
                <Option value="10">10 Minutes</Option>
                <Option value="15">15 Minutes</Option>
                <Option value="30">30 Minutes</Option>
                <Option value="60">60 Minutes</Option>
                <Option value="1h">2 Hours</Option>
                <Option value="4h">4 Hours</Option>
                <Option value="8h">8 Hours</Option>
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
                  message: "Please enter the dynamic close period",
                },
              ]}
            >
              <Select onChange={handleChange} style={{ width: "100%" }}>
                <Option value="none">None</Option>
                <Option value="last">Last minute</Option>
                <Option value="2m">Last 2 minutes</Option>
                <Option value="5m">Last 5 minutes</Option>
                <Option value="10m">Last 10 minutes</Option>
                <Option value="15m">Last 15 minutes</Option>
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
                      message: "Please enter the minimum bid change",
                    },
                  ]}
                >
                  <Input suffix="%" />
                </Form.Item>
              </Col>
              <Col span={12} style={styles.colStyle}>
                <Form.Item
                  label="Maximum Bid Change"
                  name="maximumBid"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the maximum bid change",
                    },
                  ]}
                >
                  <Input suffix="%" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Form.Item>
          <Row style={{ padding: 24 }} justify="end">
            <Button
              htmlType="submit"
              onClick={() => setDefaultTab("2")}
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

export default BiddingSettingComponent;
