import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Cascader,
  InputNumber,
  Select,
  Space,
} from "antd";
import { displayCurrency } from "../utils";
import InputRange from "../layouts/InputRange";
import Router from "next/router";

const { Title } = Typography;
const FormItem = Form.Item;
const { Option } = Select;

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
const BuyerRequestCreateComponent = ({ width = 10 }) => {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [currency, setCurrency] = useState("$");

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    Router.push("/buyer/request");
  };

  return (
    <Row align="middle" justify="center">
      <Col sm={20} md={width}>
        <Form
          {...formItemLayout}
          autoComplete="new-password"
          className="register-form"
          onFinish={onFinish}
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
            <Col style={styles.colStyle} span={24}>
              <FormItem
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please choose category",
                  },
                ]}
                label="Category"
              >
                <Cascader
                  placeholder="Select category"
                  size="large"
                  options={[
                    {
                      value: "1",
                      label: "Category 1",
                      children: [
                        {
                          value: "1-1",
                          label: "Sub-1 Category 1",
                        },
                        {
                          value: "1-2",
                          label: "Sub-2 Category 1",
                        },
                      ],
                    },
                  ]}
                />
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
              <FormItem label="Unit" name="unit">
                <Select
                  defaultValue="pieces"
                  size="large"
                  style={{ width: "100%", paddingLeft: 16 }}
                >
                  <Option value="piece">Pieces</Option>
                  <Option value="kg">Kilograms</Option>
                  <Option value="set">Set</Option>
                </Select>
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
                <InputRange
                  setValue={setPriceRange}
                  value={priceRange}
                  inputGroupProps={{ style: { border: "none", width: "100%" } }}
                  minProps={{
                    formatter: (value) =>
                      `${currency} ${value}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      ),
                    parser: (value) => value.replace(/\$\s?|(,*)/g, ""),
                    min: 0,
                    style: {
                      width: "45%",
                      textAlign: "center",
                    },
                    placeholder: "Minimum Price",
                  }}
                  maxProps={{
                    formatter: (value) =>
                      `${currency} ${value}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      ),
                    parser: (value) => value.replace(/\$\s?|(,*)/g, ""),
                    min: priceRange.min,
                    style: { width: "45%", textAlign: "center" },
                    placeholder: "Maximum Price",
                  }}
                />
              </FormItem>
            </Col>
            <Col span={24}>
              <Row style={{ padding: "0px 4px 20px 4px" }} justify="end">
                <Space>
                  <span>
                    From: {displayCurrency(priceRange.min, currency)} - To:{" "}
                    {displayCurrency(priceRange.max, currency)}
                  </span>
                  {/* <Select
                    onChange={(value) => {
                      setCurrency(value);
                    }}
                    defaultValue={currency}
                    size="small"
                  >
                    <Option value="$">USD</Option>
                    <Option value="đ">VND</Option>
                  </Select> */}
                </Space>
              </Row>
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
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default BuyerRequestCreateComponent;
