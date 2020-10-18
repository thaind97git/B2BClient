import React, { useEffect, useState } from "react";
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
  DatePicker,
} from "antd";
import { displayCurrency } from "../utils";
import Modal from "antd/lib/modal/Modal";
import BuyerRequestCategoryComponent from "./BuyerRequestCategoryComponent";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { getCategorySelected } from "../libs";
import Router from "next/router";
import { SET_CATEGORY_SELECTED } from "../stores/initState";
import {
  getCurrency,
  GetCurrencyData,
  getPaymentTerm,
  GetPaymentTermData,
  getShippingMethod,
  GetShippingMethodData,
  getSourcingPurpose,
  GetSourcingPurposeData,
  getSourcingType,
  GetSourcingTypeData,
  getSupplierCertification,
  GetSupplierCertificationData,
  getTradeTerms,
  GetTradeTermsData,
  getUnitOfMeasure,
  GetUnitOfMeasureData,
} from "../stores/SupportRequestState";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;
const FormItem = Form.Item;
const connectToRedux = connect(
  createStructuredSelector({
    categorySelected: (state) => state.categorySelected,
    sourcingTypeData: GetSourcingTypeData,
    sourcingPurposeData: GetSourcingPurposeData,
    unitData: GetUnitOfMeasureData,
    currencyData: GetCurrencyData,
    tradeTermData: GetTradeTermsData,
    shippingMethodData: GetShippingMethodData,
    paymentTermData: GetPaymentTermData,
    supCertificationData: GetSupplierCertificationData,
  }),
  (dispatch) => ({
    removeCategorySelected: () =>
      dispatch({ type: SET_CATEGORY_SELECTED, payload: [] }),
    getSourcingType: () => dispatch(getSourcingType()),
    getSourcingPurpose: () => dispatch(getSourcingPurpose()),
    getUnit: () => dispatch(getUnitOfMeasure()),
    getCurrency: () => dispatch(getCurrency()),
    getTradeTerm: () => dispatch(getTradeTerms()),
    getShippingMethod: () => dispatch(getShippingMethod()),
    getPaymentTerm: () => dispatch(getPaymentTerm()),
    getSupCertification: () => dispatch(getSupplierCertification()),
  })
);
const styles = {
  colStyle: { padding: "0 8px" },
  titleStyle: { fontWeight: 500 },
};
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const PriceInput = ({
  value = {},
  onChange,
  price,
  setPrice,
  currencyData = [],
}) => {
  const [currency, setCurrency] = useState(
    ((currencyData && currencyData[0]) || {}).id
  );

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
    console.log({ value });
    const newNumber = parseInt(value || 0, 10);
    if (Number.isNaN(price)) {
      return;
    }

    setPrice(newNumber);

    triggerChange({
      price: newNumber,
    });
  };

  return (
    <span>
      <InputNumber
        onChange={onNumberChange}
        style={{ width: "50%" }}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/,*/g, "")}
      />
      <Input
        value="Vnd"
        disabled
        style={{
          width: "50%",
          margin: "0 4px",
        }}
      />
    </span>
  );
};

const QuantityInput = ({ value = {}, onChange, unitData = [] }) => {
  const [number, setNumber] = useState(0);
  const [unit, setUnit] = useState(((unitData && unitData[0]) || {}).id);

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
      number: value.number || 1,
    });
  };

  return (
    <span>
      <InputNumber
        value={value.number || number}
        onChange={onNumberChange}
        style={{ width: "50%" }}
        min={1}
        placeholder="Enter the product quantity"
      />
      <Input
        value="Unit"
        disabled
        style={{
          width: "48%",
          margin: "0 4px",
        }}
      />
      {/* <Select
        showSearch
        value={value.unit || unit}
        style={{
          width: "48%",
          margin: "0 4px",
        }}
        onChange={onUnitChange}
        placeholder="Select a unit"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {!!unitData &&
          unitData.map((type) => (
            <Option value={type.id} index={type.id} key={type.id}>
              {type.description}
            </Option>
          ))}
      </Select> */}
    </span>
  );
};

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf("day");
}

const BuyerRequestCreateComponent = ({
  removeCategorySelected,
  categorySelected,
  getSourcingType,
  getSourcingPurpose,
  getUnit,
  getCurrency,
  getTradeTerm,
  getShippingMethod,
  getPaymentTerm,
  getSupCertification,
  sourcingTypeData,
  sourcingPurposeData,
  unitData,
  currencyData,
  tradeTermData,
  shippingMethodData,
  paymentTermData,
  supCertificationData,
}) => {
  const [price, setPrice] = useState(0);
  const [openCategory, setOpenCategory] = useState(false);

  useEffect(() => {
    getSourcingType();
    getSourcingPurpose();
    getUnit();
    getCurrency();
    getTradeTerm();
    getShippingMethod();
    getPaymentTerm();
    getSupCertification();
  }, [
    getSourcingType,
    getSourcingPurpose,
    getUnit,
    getCurrency,
    getTradeTerm,
    getShippingMethod,
    getPaymentTerm,
    getSupCertification,
  ]);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    Router.push("/buyer/rfq");
    removeCategorySelected();
  };

  const checkPrice = (rule, value) => {
    if (value.price > 0) {
      return Promise.resolve();
    }

    return Promise.reject("Price must be greater than zero!");
  };
  const checkUnit = (rule, value) => {
    if (value.number > 0) {
      return Promise.resolve();
    }

    return Promise.reject("Quantity must be greater than zero!");
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
          initialValues={{
            productName: "Iphone 8 Plus 64Gb",
            unit: "Unit",
          }}
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
                <FormItem label="Product Name" name="productName">
                  <Input disabled />
                </FormItem>
              </Col>
              {/* <Col style={styles.colStyle} span={24}>
                <FormItem label="Category" name="category">
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
              </Col> */}
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="Sourcing Type"
                  name="sourcingTypeId"
                  rules={[
                    {
                      required: true,
                      message: "Please select Sourcing Type",
                    },
                  ]}
                >
                  <Select style={{ width: "50%" }}>
                    {!!sourcingTypeData &&
                      sourcingTypeData.map((type) => (
                        <Option value={type.id} index={type.id} key={type.id}>
                          {type.description}
                        </Option>
                      ))}
                  </Select>
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="Sourcing Purpose"
                  name="sourcingPurposeId"
                  rules={[
                    {
                      required: true,
                      message: "Please select Sourcing Purpose",
                    },
                  ]}
                >
                  <Select style={{ width: "50%" }}>
                    {!!sourcingPurposeData &&
                      sourcingPurposeData.map((type) => (
                        <Option value={type.id} index={type.id} key={type.id}>
                          {type.description}
                        </Option>
                      ))}
                  </Select>
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span> Quantity
                    </span>
                  }
                  name="quantity"
                  rules={[
                    {
                      validator: checkUnit,
                    },
                  ]}
                >
                  <QuantityInput unitData={unitData} />
                </FormItem>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={20}>
                <Row style={{ padding: "0px 12px 0px 4px" }} justify="end">
                  <Space>{displayCurrency(price)} or Lower</Space>
                </Row>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  name="preferredUnitPrice"
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span> Preferred Unit
                      Price:
                    </span>
                  }
                  rules={[
                    {
                      validator: checkPrice,
                    },
                  ]}
                >
                  <PriceInput
                    price={price}
                    setPrice={setPrice}
                    currencyData={currencyData}
                  />
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="Trade term"
                  name="tradeTermId"
                  rules={[
                    {
                      required: true,
                      message: "Please select trade term",
                    },
                  ]}
                >
                  <Select style={{ width: "50%" }}>
                    {!!tradeTermData &&
                      tradeTermData.map((type) => (
                        <Option value={type.id} index={type.id} key={type.id}>
                          {type.description}
                        </Option>
                      ))}
                  </Select>
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="Due date"
                  name="dueDate"
                  rules={[
                    {
                      required: true,
                      message: "Please select due date",
                    },
                  ]}
                >
                  <DatePicker
                    placeholder="Select due date"
                    style={{ width: "50%" }}
                    format="YYYY-MM-DD HH:mm:ss"
                    disabledDate={disabledDate}
                    showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                  />
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
                  <Input.TextArea autoSize={{ minRows: 3 }} />
                </FormItem>
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
                  <Select
                    showSearch
                    mode="multiple"
                    placeholder="Select Certification"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    style={{ width: "50%" }}
                  >
                    {!!supCertificationData &&
                      supCertificationData.map((type) => (
                        <Option value={type.id} index={type.id} key={type.id}>
                          {type.description}
                        </Option>
                      ))}
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
                <FormItem label="Shipping Method" name="shippingMethodId">
                  <Select style={{ width: "50%" }}>
                    {!!shippingMethodData &&
                      shippingMethodData.map((type) => (
                        <Option value={type.id} index={type.id} key={type.id}>
                          {type.description}
                        </Option>
                      ))}
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
                  <Select style={{ width: "50%" }}>
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
                  <Select style={{ width: "50%" }}>
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
                  <Select style={{ width: "50%" }}>
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
                  name="paymentTermId"
                  rules={[
                    {
                      required: true,
                      message: "Please select payment term",
                    },
                  ]}
                >
                  <Select style={{ width: "50%" }}>
                    {!!paymentTermData &&
                      paymentTermData.map((type) => (
                        <Option value={type.id} index={type.id} key={type.id}>
                          {type.description}
                        </Option>
                      ))}
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
