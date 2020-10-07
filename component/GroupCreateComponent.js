import React from "react";
import { Form, Input, Row, Col, Cascader } from "antd";

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
const options = [
  {
    value: "zhejiang",
    label: "Category1",
    children: [
      {
        value: "hangzhou",
        label: "Category 1-1",
        children: [
          {
            value: "xihu",
            label: "Category 1-1-1",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Category 2",
    children: [
      {
        value: "nanjing",
        label: "Category 2-1",
        children: [
          {
            value: "zhonghuamen",
            label: "Category 2-1-1",
          },
        ],
      },
    ],
  },
];
const GroupCreateComponent = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  function onChange(value) {
    console.log(value);
  }

  return (
    <Row align="middle" justify="center">
      <Col sm={20}>
        <Form
          {...formItemLayout}
          autoComplete="new-password"
          className="register-form"
          onFinish={onFinish}
          initialValues={{
            unit: "Set",
          }}
        >
          {/* <Row justify="center">
            <Title style={styles.titleStyle} level={2}>
              Group
            </Title>
          </Row> */}
          <Row align="middle">
            <Col style={styles.colStyle} span={24}>
              <FormItem
                label="Group Name"
                name="groupTitle"
                rules={[
                  {
                    required: true,
                    message: "Please enter the group name",
                  },
                ]}
              >
                <Input size="large" placeholder="Enter the group name" />
              </FormItem>
            </Col>
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
                <Cascader
                  size="large"
                  options={options}
                  expandTrigger="hover"
                  // displayRender={displayRender}
                  onChange={onChange}
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="middle">
            <Col style={styles.colStyle} span={24}>
              <FormItem label="Description" name="description">
                <Input.TextArea autoSize={{ minRows: 3 }} />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default GroupCreateComponent;
