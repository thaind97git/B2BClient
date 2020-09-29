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
} from "antd";
import React, { useState } from "react";
import moment from "moment";
import MarkdownEditorComponent from "./MarkdownEditorComponent";
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
const BiddingSettingComponent = ({ setDefaultTab }) => {
  const [brief, setBrief] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  return (
    <div>
      <Row align="middle">
        <Col md={12} sm={24}>
          <div className="label">
            Auction Name <span style={{ color: "red" }}>*</span>
          </div>
          <Input size="large" placeholder="Enter the auction name" />
        </Col>
        {/* <Col md={12} sm={24}>
          <Button type="primary">Choose Group</Button>
        </Col> */}
      </Row>
      <Row>
        <Col md={12} sm={24}>
          <div className="label">
            Quantity <span style={{ color: "red" }}>*</span>
          </div>
          <div>
            <InputNumber
              style={{ width: "100%" }}
              value={quantity}
              onChange={(value) => setQuantity(value)}
              size="large"
              defaultValue={10}
              type="number"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12} sm={24}>
          <div className="label">
            Unit of Measure <span style={{ color: "red" }}>*</span>
          </div>
          <div>
            <Input disabled size="large" defaultValue="Unit" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12} sm={24}>
          <div className="label">
            Current Price (Not show to participants){" "}
            <span style={{ color: "red" }}>*</span>
          </div>
          <div>
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              value={currentPrice}
              onChange={(value) => setCurrentPrice(value)}
              size="large"
              prefix="$"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12} sm={24}>
          <div className="label">
            Current Value (Not show to participants){" "}
            <span style={{ color: "red" }}>*</span>
          </div>
          <div>
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              value={quantity * currentPrice}
              disabled
              size="large"
              prefix="$"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12} sm={24}>
          <div className="label">Currency</div>
          <div>
            <Select
              size="large"
              onChange={handleChange}
              style={{ width: "100%" }}
            >
              <Option value="usd">USD</Option>
              <Option value="vnd">VND</Option>
            </Select>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12} sm={24}>
          <div className="label">Brief</div>
          <MarkdownEditorComponent value={brief} setValue={setBrief} />
        </Col>
      </Row>
      <Divider />
      <Title level={5}>Auction Information</Title>
      <Row>
        <Col md={12} sm={24}>
          <div className="label">Auction Start Time</div>
          <div>
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={disabledDate}
              disabledTime={disabledDateTime}
              showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12} sm={24}>
          <div className="label">Minimum Duration</div>
          <div>
            <Select
              defaultValue="10"
              size="large"
              onChange={handleChange}
              style={{ width: "100%" }}
            >
              <Option value="10">10 Minutes</Option>
              <Option value="15">15 Minutes</Option>
              <Option value="30">30 Minutes</Option>
              <Option value="60">60 Minutes</Option>
              <Option value="1h">2 Hours</Option>
              <Option value="4h">4 Hours</Option>
              <Option value="8h">8 Hours</Option>
            </Select>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12} sm={24}>
          <div className="label">Dynamic Close Period</div>
          <div>
            <Select
              size="large"
              defaultValue="none"
              onChange={handleChange}
              style={{ width: "100%" }}
            >
              <Option value="none">None</Option>
              <Option value="last">Last minute</Option>
              <Option value="2">Last 2 minutes</Option>
              <Option value="5">Last 5 minutes</Option>
              <Option value="10">Last 10 minutes</Option>
              <Option value="15">Last 15 minutes</Option>
            </Select>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12} sm={24}>
          <div className="label">
            Minimum Bid Change <span style={{ color: "red" }}>*</span>
          </div>
          <div>
            <Input size="large" defaultValue={0.5} suffix="%" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12} sm={24}>
          <div className="label">
            Maximum Bid Change <span style={{ color: "red" }}>*</span>
          </div>
          <div>
            <Input size="large" defaultValue={10.0} suffix="%" />
          </div>
        </Col>
      </Row>
      <Row style={{ padding: 24 }} justify="end">
        <Button onClick={() => setDefaultTab("2")} size="large" type="primary">
          Save & Go to Next Step
        </Button>
      </Row>
      <style jsx>
        {`
          .label {
            padding: 20px 4px 6px 4px;
          }
        `}
      </style>
    </div>
  );
};

export default BiddingSettingComponent;
