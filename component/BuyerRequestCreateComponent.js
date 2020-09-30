import React, { Fragment, useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Radio,
  Typography,
  Slider,
  Cascader,
} from "antd";

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
const BuyerRequestCreateComponent = ({ width = 10 }) => {
  const [minRange, setMinRange] = useState(1);
  const [maxRange, setMaxRange] = useState(100);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [isRequireRange, setIsRequireRange] = useState(true);
  const [currency, setCurrency] = useState("$");
  const [isCustomPrice, setIsCustomPrice] = useState(false);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  useEffect(() => {
    console.log({ minRange, maxRange });
  }, [minRange, maxRange]);

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
              Fill full your request details
            </Title>
          </Row>
          <Row align="middle">
            <Col style={styles.colStyle} span={24}>
              <FormItem
                label="Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please enter Request Title",
                  },
                ]}
              >
                <Input size="large" placeholder="Enter the request title" />
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
          </Row>
          <Row align="middle">
            <Col span={24}>
              <Row
                style={{ paddingTop: 16, paddingBottom: 4 }}
                justify="space-between"
              >
                <div>
                  {isCustomPrice ? (
                    <Button
                      size="small"
                      onClick={() => {
                        setIsCustomPrice(false);
                      }}
                    >
                      Choose range
                    </Button>
                  ) : (
                    <Fragment>
                      <Radio.Group
                        defaultValue={`${minRange}-${maxRange}`}
                        onChange={(event) => {
                          const value = event.target.value;
                          setMinRange(parseInt(value.split("-")[0]));
                          setMaxRange(parseInt(value.split("-")[1]));
                        }}
                      >
                        <Radio value="1-100">1 - 100 {currency}</Radio>
                        <Radio value="100-1000">100 - 1000 {currency}</Radio>
                        <Radio value="1000-10000">
                          1000 - 10000 {currency}
                        </Radio>
                      </Radio.Group>
                      <Button
                        size="small"
                        onClick={() => {
                          setIsCustomPrice(true);
                        }}
                      >
                        Custom Price
                      </Button>
                    </Fragment>
                  )}
                </div>
                <div>
                  From: {minPrice} {currency} - To: {maxPrice} {currency}
                </div>
              </Row>
            </Col>
            <Col style={styles.colStyle} span={24}>
              <FormItem
                label="Choose Price Range:"
                name="range"
                rules={[
                  {
                    required: isRequireRange,
                    message: "Please choose the price range",
                  },
                ]}
              >
                {isCustomPrice ? (
                  <Input.Group style={{ border: "none" }} compact>
                    <Input
                      onChange={(event) => {
                        setMinPrice(event.target.value);
                      }}
                      type="number"
                      style={{ width: "45%", textAlign: "center" }}
                      placeholder="Minimum Price"
                    />
                    <Input
                      className="site-input-split"
                      style={{
                        width: "10%",
                        borderLeft: 0,
                        borderRight: 0,
                        pointerEvents: "none",
                      }}
                      placeholder="~"
                      disabled
                    />
                    <Input
                      onChange={(event) => {
                        setMaxPrice(event.target.value);
                      }}
                      type="number"
                      className="site-input-right"
                      style={{
                        width: "45%",
                        textAlign: "center",
                      }}
                      placeholder="Maximum Price"
                    />
                  </Input.Group>
                ) : (
                  <Slider
                    min={minRange}
                    max={maxRange}
                    range
                    onChange={([min, max]) => {
                      if (min === max) {
                        setIsRequireRange(true);
                      } else {
                        setIsRequireRange(false);
                      }
                      setMinPrice(min);
                      setMaxPrice(max);
                    }}
                  />
                )}
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
