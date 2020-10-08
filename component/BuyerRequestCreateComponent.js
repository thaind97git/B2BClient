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
  Card,
  Select,
  Upload,
} from "antd";
import { displayCurrency } from "../utils";
import { InboxOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import BuyerRequestCategoryComponent from "./BuyerRequestCategoryComponent";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { getCategorySelected } from "../libs";

const { Title } = Typography;
const { Option } = Select;
const FormItem = Form.Item;
const connectToRedux = connect(
  createStructuredSelector({
    categorySelected: (state) => state.categorySelected,
  })
);
const styles = {
  colStyle: { padding: "0 8px" },
  titleStyle: { fontWeight: 500 },
};
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const PriceInput = ({ value = {}, onChange, price, setPrice }) => {
  const [currency, setCurrency] = useState("vnd");

  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({
        price,
        currency,
        ...value,
        ...changedValue,
      });
    }
  };

  const onNumberChange = (value) => {
    const newNumber = parseInt(value || 0, 10);
    if (Number.isNaN(price)) {
      return;
    }

    // if (!("price" in value)) {
    setPrice(newNumber);
    // }

    triggerChange({
      price: newNumber,
    });
  };

  const onCurrencyChange = (newCurrency) => {
    if (!("currency" in value)) {
      setCurrency(newCurrency);
    }

    triggerChange({
      currency: newCurrency,
    });
  };

  return (
    <span>
      <InputNumber
        value={value.price || price}
        onChange={onNumberChange}
        style={{ width: "78%" }}
        formatter={(value) =>
          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
      />

      <Select
        value={value.currency || currency}
        style={{
          width: "20%",
          margin: "0 4px",
        }}
        onChange={onCurrencyChange}
      >
        <Option value="vnd">VND</Option>
      </Select>
    </span>
  );
};
const QuantityInput = ({ value = {}, onChange }) => {
  const [number, setNumber] = useState(0);
  const [unit, setUnit] = useState("pieces");

  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({
        number,
        unit,
        ...value,
        ...changedValue,
      });
    }
  };

  const onNumberChange = (value) => {
    const newNumber = parseInt(value || 0, 10);

    if (Number.isNaN(number)) {
      return;
    }

    triggerChange({
      number: newNumber,
    });
  };

  const onUnitChange = (newUnit) => {
    if (!("unit" in value)) {
      setUnit(newUnit);
    }

    triggerChange({
      unit: newUnit,
    });
  };

  return (
    <span>
      <InputNumber
        value={value.number || number}
        onChange={onNumberChange}
        style={{ width: "78%" }}
        min={1}
        placeholder="Enter the product quantity"
      />
      <Select
        value={value.unit || unit}
        style={{
          width: "20%",
          margin: "0 4px",
        }}
        onChange={onUnitChange}
      >
        <Option value="pieces">Pieces</Option>
        <Option value="bags">Bags</Option>
        <Option value="boxes">Boxes</Option>
        <Option value="cartons">Cartons</Option>
        <Option value="feet">Feet</Option>
        <Option value="units">Units</Option>
        <Option value="kilograms">Kilograms</Option>
        <Option value="Miles">Miles</Option>
      </Select>
    </span>
  );
};
const currency = "Vnd";
const BuyerRequestCreateComponent = ({ next, categorySelected }) => {
  // const p
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState("Vnd");
  const [openCategory, setOpenCategory] = useState(false);
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    typeof next === "function" && next();
  };

  const checkPrice = (rule, value) => {
    if (value.price > 0) {
      return Promise.resolve();
    }

    return Promise.reject("Price must be greater than zero!");
  };
  const checkUnit = (rule, value) => {
    if (value.unit > 0) {
      return Promise.resolve();
    }

    return Promise.reject("Price must be greater than zero!");
  };

  return (
    <Row align="middle" justify="center">
      <Modal
        title="Choose Category"
        centered
        visible={openCategory}
        onOk={() => setOpenCategory(false)}
        onCancel={() => setOpenCategory(false)}
        width={1000}
      >
        <BuyerRequestCategoryComponent
          doneFunc={() => setOpenCategory(false)}
        />
        <Row>
          {!!categorySelected.length && (
            <Title level={4}>
              Category selected:
              {getCategorySelected(
                categorySelected.map((cate) => cate.description)
              ).substring(3)}
            </Title>
          )}
        </Row>
      </Modal>
      <Col sm={20} md={18}>
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
          <Card
            bordered={false}
            title={<b>Product Basic Information</b>}
            style={{
              width: "100%",
              boxShadow: "2px 2px 14px 0 rgba(0,0,0,.1)",
              marginTop: 16,
            }}
          >
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
                  <Input placeholder="Enter the product title" />
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="Category"
                  name="category"
                  rules={[
                    {
                      required: true,
                      message: "Please select Category",
                    },
                  ]}
                >
                  {!!categorySelected.length && (
                    <div>
                      Category selected:
                      {getCategorySelected(
                        categorySelected.map((cate) => cate.description)
                      ).substring(3)}
                    </div>
                  )}
                  <Button onClick={() => setOpenCategory(true)}>
                    Select Category
                  </Button>
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="Quantity"
                  name="quantity"
                  rules={[
                    {
                      validator: checkUnit,
                    },
                  ]}
                >
                  <QuantityInput />
                </FormItem>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={24}>
                <Row style={{ padding: "0px 12px 0px 4px" }} justify="end">
                  <Space>{displayCurrency(price, currency)} or Lower</Space>
                </Row>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  name="price"
                  label="Preferred Unit Price:"
                  rules={[
                    {
                      validator: checkPrice,
                    },
                  ]}
                >
                  <PriceInput price={price} setPrice={setPrice} />
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="Trade term"
                  name="tradeTerm"
                  rules={[
                    {
                      required: true,
                      message: "Please select trade term",
                    },
                  ]}
                >
                  <Select>
                    <Option value="fob">FOB</Option>
                    <Option value="exw">EXW</Option>
                    <Option value="fas">FAS</Option>
                    <Option value="fca">FCA</Option>
                    <Option value="cfr">CFR</Option>
                    <Option value="cpt">CPT</Option>
                    <Option value="cif">CIF</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="Details"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the details",
                    },
                  ]}
                >
                  <Input.TextArea autoSize={{ minRows: 2 }} />
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <Form.Item label="Attachments">
                  <Form.Item
                    name="attachments"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    noStyle
                  >
                    <Upload.Dragger name="files" action="/upload.do">
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to this area to upload
                      </p>
                    </Upload.Dragger>
                  </Form.Item>
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card
            bordered={false}
            title={<b>Supplier Capability</b>}
            style={{
              width: "100%",
              boxShadow: "2px 2px 14px 0 rgba(0,0,0,.1)",
              marginTop: 32,
            }}
          >
            <Row align="middle">
              <Col style={styles.colStyle} span={24}>
                <FormItem label="Certifications" name="certifications">
                  <Select>
                    <Option value="IOS/TS16949">IOS/TS16949</Option>
                    <Option value="ISO22000">ISO22000</Option>
                    <Option value="CCC">CCC</Option>
                    <Option value="PSE">PSE</Option>
                    <Option value="MSDS">MSDS</Option>
                    <Option value="FCCF">FCCF</Option>
                    <Option value="GMP">GMP</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem label="Other Requirements" name="otherRe">
                  <Input.TextArea
                    autoSize={{ minRows: 4 }}
                    placeholder="To receive fast and accurate quotations from suitable suppliers, please present your supplier requirements as specifically as possible. "
                  />
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card
            bordered={false}
            title={<b>Shipping and Payment</b>}
            style={{
              width: "100%",
              boxShadow: "2px 2px 14px 0 rgba(0,0,0,.1)",
              marginTop: 32,
              marginBottom: 32,
            }}
          >
            <Row align="middle">
              <Col style={styles.colStyle} span={24}>
                <FormItem label="Shipping Method" name="shipping">
                  <Select>
                    <Option value="see">Sea freight</Option>
                    <Option value="air">Air freight</Option>
                    <Option value="express">Express</Option>
                    <Option value="land">Land freight</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="Province"
                  name="province"
                  rules={[
                    {
                      required: true,
                      message: "Please select province",
                    },
                  ]}
                >
                  <Select>
                    <Option value="TP.HCM">TP.HCM</Option>
                    <Option value="hanoi">Ha Noi</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="District"
                  name="district"
                  rules={[
                    {
                      required: true,
                      message: "Please select district",
                    },
                  ]}
                >
                  <Select>
                    <Option value="1">Q.1</Option>
                    <Option value="2">Q.2</Option>
                    <Option value="3">Q.3</Option>
                    <Option value="4">Q.4</Option>
                    <Option value="5">Q.5</Option>
                    <Option value="6">Q.6</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="Ward"
                  name="ward"
                  rules={[
                    {
                      required: true,
                      message: "Please select ward",
                    },
                  ]}
                >
                  <Select>
                    <Option value="TP.HCM">Phường 1</Option>
                    <Option value="hanoi">Phường 2</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="Address"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the address",
                    },
                  ]}
                >
                  <Input placeholder="Enter the address shipping" />
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem label="Lead Time" name="leadTime">
                  Ship in <span>&nbsp;</span>
                  <InputNumber min={0} style={{ width: 100 }} />
                  <span>&nbsp;</span>
                  day(s) after supplier receives the initial payment
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="Payment Term"
                  name="payment term"
                  rules={[
                    {
                      required: true,
                      message: "Please select payment term",
                    },
                  ]}
                >
                  <Select>
                    <Option value="tt">T/T</Option>
                    <Option value="lc">L/C</Option>
                    <Option value="dp">D/P</Option>
                    <Option value="union">Western Union</Option>
                    <Option value="money">Money Gram</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Row justify="center" align="middle">
            <Col span={6}>
              <Button
                onClick={() => {}}
                block
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

export default connectToRedux(BuyerRequestCreateComponent);
