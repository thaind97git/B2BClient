import React from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Cascader,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

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
const normFile = (e) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
const SupplierRequestProductComponent = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  function onChange(value) {
    console.log(value);
  }

  // Just show the latest item.
  // function displayRender(label) {
  //   return label[label.length - 1];
  // }
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
          <Row justify="center">
            <Title style={styles.titleStyle} level={2}>
              Tell Us about your product
            </Title>
          </Row>
          <Row align="middle">
            <Col style={styles.colStyle} span={24}>
              <FormItem
                label="Category"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please select the category",
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
                name="upload"
                label="Attachments"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                // extra="longgggggggggggggggggggggggggggggggggg"
              >
                <Upload name="logo" action="/upload.do" listType="picture">
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
              </FormItem>
            </Col>
          </Row>
          <Row align="middle">
            {/* <Col style={styles.colStyle} span={18}>
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
            </Col> */}
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

export default SupplierRequestProductComponent;
