import {
  Button,
  Col,
  DatePicker,
  Divider,
  Input,
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
const BiddingSettingComponent = () => {
  const [brief, setBrief] = useState(null);

  return (
    <div>
      <Row align="middle">
        <Col md={12} sm={24}>
          <div className="label">
            Auction Name <span style={{ color: "red" }}>*</span>
          </div>
          <Input size="large" placeholder="Enter the auction name" />
        </Col>
        <Col md={12} sm={24}>
          <Button type="primary">Choose Group</Button>
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
              size="large"
              defaultValue="a1"
              onChange={handleChange}
              style={{ width: "100%" }}
            >
              <Option>10 Minutes</Option>
              <Option>15 Minutes</Option>
              <Option>30 Minutes</Option>
              <Option>60 Minutes</Option>
              <Option>2 Hours</Option>
              <Option>4 Hours</Option>
              <Option>8 Hours</Option>
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
              defaultValue="a1"
              onChange={handleChange}
              style={{ width: "100%" }}
            >
              <Option>None</Option>
              <Option>Last minute</Option>
              <Option>Last 2 minutes</Option>
              <Option>Last 5 minutes</Option>
              <Option>Last 10 minutes</Option>
              <Option>Last 15 minutes</Option>
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
        <Button size="large" type="primary">
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
