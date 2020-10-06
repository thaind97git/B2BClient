import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  InputNumber,
  Space,
  DatePicker,
} from "antd";
import { displayCurrency } from "../utils";
import moment from "moment";

const { Title } = Typography;
const FormItem = Form.Item;

const styles = {
  colStyle: { padding: "0 8px" },
  titleStyle: { fontWeight: 500 },
};
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const BuyerRequestCreateComponent = ({ width = 10, next }) => {
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState("$");

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    typeof next === "function" && next();
  };
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

  return (
    <Row align="middle" justify="center">
      <Col sm={20} md={width}>
        <Form
          {...formItemLayout}
          autoComplete="new-password"
          className="register-form"
          onFinish={onFinish}
          initialValues={{
            unit: "Set",
          }}
        >
          <Row justify="center">
            <Title style={styles.titleStyle} level={2}>
              Tell Us what you need
            </Title>
          </Row>
          <Row align="middle">
            <Col style={styles.colStyle} span={24}>
              <FormItem
                label="Product Name"
                name="productName"
                rules={[
                  {
                    required: true,
                    message: "Please enter the product title",
                  },
                ]}
              >
                <Input size="large" placeholder="Enter the product title" />
              </FormItem>
            </Col>
            <Col style={styles.colStyle} span={18}>
              <FormItem
                label="Quantity"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Please enter the product quantity",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  size="large"
                  placeholder="Enter the product quantity"
                />
              </FormItem>
            </Col>
            <Col style={styles.colStyle} span={6}>
              <FormItem
                rules={[
                  {
                    required: true,
                    message: "Please enter the unit",
                  },
                ]}
                label="Unit"
                name="unit"
              >
                <Input style={{ width: "100%" }} size="large" />
              </FormItem>
            </Col>
          </Row>
          <Row align="middle">
            <Col style={styles.colStyle} span={24}>
              <FormItem
                label="Preferred Unit Price:"
                name="range"
                rules={[
                  {
                    required: true,
                    message: "Please choose the price range",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  size="large"
                  value={price}
                  onChange={(value) => setPrice(value)}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </FormItem>
            </Col>
            <Col span={24}>
              <Row style={{ padding: "0px 4px 20px 4px" }} justify="end">
                <Space>
                  <span>{displayCurrency(price, currency)} or Lower</span>
                </Space>
              </Row>
            </Col>
            <Col style={styles.colStyle} span={24}>
              <FormItem
                label="Due Date"
                name="dueDate"
                rules={[
                  {
                    required: true,
                    message: "Please choose the due date",
                  },
                ]}
              >
                <DatePicker
                  size="large"
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={disabledDate}
                  disabledTime={disabledDateTime}
                  showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                />
              </FormItem>
            </Col>
            <Col style={styles.colStyle} span={18}>
              <FormItem
                rules={[
                  {
                    required: true,
                    message: "Please input delivery address",
                  },
                ]}
                label="Delivery Address"
                name="address"
              >
                <Input placeholder="Input your delivery address" size="large" />
              </FormItem>
            </Col>
            <Col style={styles.colStyle} span={6}>
              <FormItem label={<span>&nbsp;</span>} name="unit">
                <Button size="middle" type="primary">
                  Use my address
                </Button>
              </FormItem>
            </Col>
            <Col style={styles.colStyle} span={24}>
              <FormItem label="Description" name="description">
                <Input.TextArea autoSize={{ minRows: 3 }} />
              </FormItem>
            </Col>
          </Row>
          <Row justify="center" align="middle">
            <Col span={12}>
              <Button
                onClick={() => {}}
                block
                size="large"
                className="submit"
                type="primary"
                htmlType="submit"
              >
                Next
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default BuyerRequestCreateComponent;
