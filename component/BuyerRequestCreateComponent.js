import React, { Fragment, useEffect, useState } from 'react';
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
  Empty,
  Skeleton,
  Modal
} from 'antd';
import { LeftOutlined, WarningTwoTone } from '@ant-design/icons';
import { displayCurrency, openNotification } from '../utils';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Router, { useRouter } from 'next/router';
import { SET_CATEGORY_SELECTED } from '../stores/initState';
import { get } from 'lodash/fp';
import {
  getCurrency,
  GetCurrencyData,
  GetCurrencyResetter,
  getDistrict,
  GetDistrictData,
  GetDistrictResetter,
  getPaymentTerm,
  GetPaymentTermData,
  GetPaymentTermResetter,
  getProvince,
  GetProvinceData,
  GetProvinceResetter,
  getShippingMethod,
  GetShippingMethodData,
  GetShippingMethodResetter,
  getSourcingPurpose,
  GetSourcingPurposeData,
  GetSourcingPurposeResetter,
  getSourcingType,
  GetSourcingTypeData,
  GetSourcingTypeResetter,
  getSupplierCertification,
  GetSupplierCertificationData,
  GetSupplierCertificationResetter,
  getTradeTerms,
  GetTradeTermsData,
  GetTradeTermsResetter,
  getUnitOfMeasure,
  GetUnitOfMeasureData,
  GetUnitOfMeasureResetter,
  getWard,
  GetWardData,
  GetWardResetter
} from '../stores/SupportRequestState';
import moment from 'moment';
import {
  getProductDetails,
  GetProductDetailsData,
  GetProductDetailsError
} from '../stores/ProductState';
import {
  checkDuplicate,
  CheckDuplicateData,
  CheckDuplicateResetter,
  createRequest,
  CreateRequestData,
  CreateRequestError,
  CreateRequestResetter,
  getRequestDetails,
  GetRequestDetailsDataSelector,
  GetRequestDetailsErrorSelector
} from '../stores/RequestState';

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
    productDetailsData: GetProductDetailsData,
    productDetailsError: GetProductDetailsError,
    provinceData: GetProvinceData,
    wardData: GetWardData,
    districtData: GetDistrictData,
    createRequestData: CreateRequestData,
    createRequestError: CreateRequestError,
    requestDetailsData: GetRequestDetailsDataSelector,
    requestDetailsError: GetRequestDetailsErrorSelector,
    duplicateData: CheckDuplicateData
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
    getProductDetails: (id) => dispatch(getProductDetails(id)),
    getProvince: () => dispatch(getProvince()),
    getDistrict: (provinceId) => dispatch(getDistrict(provinceId)),
    getWard: (districtId) => dispatch(getWard(districtId)),
    createRequest: (object) => dispatch(createRequest(object)),
    getRequestDetails: (id) => dispatch(getRequestDetails(id)),
    checkDuplicateRFQ: (productId) => dispatch(checkDuplicate(productId)),
    resetData: () => {
      dispatch(GetSourcingTypeResetter);
      dispatch(GetSourcingPurposeResetter);
      dispatch(GetUnitOfMeasureResetter);
      dispatch(GetCurrencyResetter);
      dispatch(GetTradeTermsResetter);
      dispatch(GetShippingMethodResetter);
      dispatch(GetPaymentTermResetter);
      dispatch(GetSupplierCertificationResetter);
      // dispatch(GetProductDetailsResetter);
      dispatch(GetProvinceResetter);
      dispatch(GetWardResetter);
      dispatch(GetDistrictResetter);
      dispatch(CreateRequestResetter);
      dispatch(CheckDuplicateResetter);
    }
  })
);
const styles = {
  colStyle: { padding: '0 8px' },
  titleStyle: { fontWeight: 500 }
};
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};
const PriceInput = ({
  value = {},
  onChange,
  price,
  setPrice,
  currencyData = []
}) => {
  const currency = ((currencyData && currencyData[0]) || {}).id;

  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({
        price,
        currency,
        ...value,
        ...changedValue
      });
    }
  };

  const onNumberChange = (value) => {
    const newNumber = parseInt(value || 0, 10);
    if (Number.isNaN(newNumber)) {
      return;
    }

    setPrice(newNumber);

    triggerChange({
      price: newNumber
    });
  };

  return (
    <span>
      <InputNumber
        placeholder="Enter the preferred unit price"
        onChange={onNumberChange}
        min={0}
        style={{ width: '50%' }}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value.replace(/,*/g, '')}
      />
      <Input
        value="VND"
        disabled
        style={{
          width: '48%',
          margin: '0 4px'
        }}
      />
    </span>
  );
};

const QuantityInput = ({ value = {}, onChange, unitOfMeasure }) => {
  const number = null;
  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({
        number,
        ...value,
        ...changedValue
      });
    }
  };

  const onNumberChange = (value) => {
    const newNumber = parseInt(value || 1, 10);

    if (Number.isNaN(newNumber)) {
      return;
    }

    triggerChange({
      number: newNumber
    });
  };

  return (
    <span>
      <InputNumber
        value={value.number || number}
        onChange={onNumberChange}
        style={{ width: '50%' }}
        min={0}
        max={1000000}
        placeholder="Enter the product quantity"
      />
      <Input
        value={(unitOfMeasure || {}).description}
        disabled
        style={{
          width: '48%',
          margin: '0 4px'
        }}
      />
    </span>
  );
};

const LeadTimeInput = ({ value = {}, onChange }) => {
  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({
        ...value,
        ...changedValue
      });
    }
  };

  const onNumberChange = (value) => {
    const newNumber = parseInt(value || 1, 10);

    if (Number.isNaN(newNumber)) {
      return;
    }

    triggerChange({
      number: newNumber
    });
  };

  return (
    <span>
      Ship in <span>&nbsp;</span>
      <InputNumber onChange={onNumberChange} min={0} style={{ width: 100 }} />
      <span>&nbsp;</span>
      day(s) after supplier receives the initial payment
    </span>
  );
};

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

const BuyerRequestCreateComponent = ({
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
  currencyData,
  tradeTermData,
  shippingMethodData,
  paymentTermData,
  supCertificationData,
  getProductDetails,
  productDetailsData,
  productDetailsError,
  getProvince,
  getWard,
  getDistrict,
  provinceData,
  wardData,
  districtData,
  createRequest,
  createRequestError,
  resetData,
  isUpdate = false,
  checkDuplicateRFQ,
  duplicateData
}) => {
  const [price, setPrice] = useState(0);
  const router = useRouter();
  const [loadingRFQ, setLoadingRFQ] = useState(false);
  const [form] = Form.useForm();
  const [openConfirm, setOpenConfirm] = useState(false);
  let productId = router.query.productId;
  useEffect(() => {
    if (productId) {
      checkDuplicateRFQ(productId);
    }
  }, [checkDuplicateRFQ, productId]);

  useEffect(() => {
    if (!!duplicateData) {
      if (duplicateData?.isExisted) {
        setOpenConfirm(true);
      }
    }
  }, [duplicateData]);

  useEffect(() => {
    getSourcingType();
    getSourcingPurpose();
    getUnit();
    getCurrency();
    getTradeTerm();
    getShippingMethod();
    // getPaymentTerm();
    getSupCertification();
    getProvince();
  }, [
    getSourcingType,
    getSourcingPurpose,
    getUnit,
    getCurrency,
    getTradeTerm,
    getShippingMethod,
    // getPaymentTerm,
    getSupCertification,
    getProvince
  ]);

  useEffect(() => {
    if (!!productId) {
      getProductDetails(productId);
      setLoadingRFQ(true);
    }
  }, [getProductDetails, productId]);

  // useEffect(() => {
  //   if (!!requestId) {
  //     getRequestDetails(requestId);
  //     setLoadingRFQ(true);
  //   }
  // }, [getRequestDetails, requestId]);

  useEffect(() => {
    if (productDetailsData || productDetailsError) {
      setLoadingRFQ(false);
    }
  }, [productDetailsError, productDetailsData]);

  // useEffect(() => {
  //   if (requestDetailsError || requestDetailsData) {
  //     setLoadingRFQ(false);
  //   }
  // }, [requestDetailsData, requestDetailsError]);

  useEffect(() => {
    if (!!createRequestError) {
      openNotification('error', { message: 'Create new request fail' });
    }
    return () => {
      resetData();
    };
  }, [createRequestError, resetData]);
  console.log({ duplicateData });

  const onFinish = (values) => {
    values.productId = productId + '';
    values.preferredUnitPrice = get('preferredUnitPrice.price')(values) + '';
    values.quantity = values.quantity.number + '';
    values.dueDate = new Date(values.dueDate);
    values.currencyId = get('[0].id')(currencyData) || 1;
    values.certifications = values.certifications || [];
    values.leadTime = values.leadTime.number;
    createRequest(values);
  };

  const checkPrice = (rule, value) => {
    if (value && value.price > 0) {
      return Promise.resolve();
    }

    return Promise.reject('Price must be greater than zero!');
  };
  const checkUnit = (rule, value) => {
    if (!value || value <= 0) {
      return Promise.reject('Quantity must be greater than zero!');
    }
    if (value > 1000000) {
      return Promise.reject('Quantity must be lesser than 1,000,000!');
    }

    return Promise.resolve();
  };
  if (loadingRFQ) {
    return <Skeleton active />;
  }

  if (!productDetailsData || productDetailsError) {
    return (
      <Fragment>
        <Empty description="Can not find any product! Please choose specify product before submit RFQ" />
        <div style={{ textAlign: 'center', paddingTop: 32 }}>
          <Button onClick={() => Router.push('/')} type="link">
            <LeftOutlined /> Back to product list
          </Button>
        </div>
      </Fragment>
    );
  }

  let initForm = {};
  if (!isUpdate) {
    initForm.productName = productDetailsData.productName;
    initForm.tradeTermId = 2;
  }

  return (
    <Row>
      <Modal
        title={
          <WarningTwoTone
            twoToneColor="#fa8c16"
            style={{ width: 32, fontSize: 24 }}
          />
        }
        visible={openConfirm}
        onOk={() => {
          Router.push(`/buyer/rfq/update?id=${duplicateData?.id}`);
        }}
        onCancel={() => {
          setOpenConfirm(false);
        }}
        okText="Yes, Update"
        cancelText="No, Create New RFQ"
      >
        There is an RFQ with the same Product in Your RFQ list, do you want to
        update that RFQ?
      </Modal>
      <Row justify="space-between">
        <Button onClick={() => Router.push('/')} type="link">
          <LeftOutlined /> Back to product list
        </Button>
      </Row>
      <Col span={24}>
        <Row align="middle" justify="center">
          <Col sm={20} md={18}>
            <Form
              form={form}
              {...formItemLayout}
              autoComplete="new-password"
              className="register-form"
              onFinish={onFinish}
              initialValues={initForm}
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
                  width: '100%',
                  boxShadow: '2px 2px 14px 0 rgba(0,0,0,.1)',
                  marginTop: 16
                }}
              >
                <Row align="middle">
                  <Col style={styles.colStyle} span={24}>
                    <FormItem label="Product Name" name="productName">
                      <Input disabled />
                    </FormItem>
                  </Col>
                  <Col style={styles.colStyle} span={24}>
                    <FormItem
                      label="Sourcing Type"
                      name="sourcingTypeId"
                      rules={[
                        {
                          required: true,
                          message: 'Please select Sourcing Type'
                        }
                      ]}
                    >
                      <Select
                        placeholder="Please select"
                        style={{ width: '50%' }}
                      >
                        {!!sourcingTypeData &&
                          sourcingTypeData.map((type) => (
                            <Option
                              value={type.id}
                              index={type.id}
                              key={type.id}
                            >
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
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Please select Sourcing Purpose",
                      //   },
                      // ]}
                    >
                      <Select
                        placeholder="Please select"
                        style={{ width: '50%' }}
                      >
                        {!!sourcingPurposeData &&
                          sourcingPurposeData.map((type) => (
                            <Option
                              value={type.id}
                              index={type.id}
                              key={type.id}
                            >
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
                          <span style={{ color: 'red' }}>*</span> Quantity
                        </span>
                      }
                      name="quantity"
                      rules={[
                        {
                          validator: checkUnit
                        }
                      ]}
                    >
                      <QuantityInput
                        unitOfMeasure={get('unitOfMeasure')(productDetailsData)}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row align="middle">
                  <Col span={20}>
                    <Row style={{ padding: '0px 12px 0px 4px' }} justify="end">
                      <Space>{displayCurrency(price)} or Lower</Space>
                    </Row>
                  </Col>
                  <Col style={styles.colStyle} span={24}>
                    <FormItem
                      name="preferredUnitPrice"
                      label={
                        <span>
                          <span style={{ color: 'red' }}>*</span> Preferred Unit
                          Price:
                        </span>
                      }
                      rules={[
                        {
                          validator: checkPrice
                        }
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
                          message: 'Please select trade term'
                        }
                      ]}
                    >
                      <Select
                        placeholder="Please select"
                        style={{ width: '50%' }}
                        disabled
                      >
                        {!!tradeTermData &&
                          tradeTermData.map((type) => (
                            <Option
                              value={type.id}
                              index={type.id}
                              key={type.id}
                            >
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
                          message: 'Please select due date'
                        }
                      ]}
                    >
                      <DatePicker
                        placeholder="Select due date"
                        style={{ width: '50%' }}
                        format="YYYY-MM-DD HH:mm"
                        disabledDate={disabledDate}
                        showTime={{
                          defaultValue: moment('00:00:00', 'HH:mm:ss')
                        }}
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
                          message: 'Please enter the details'
                        }
                      ]}
                    >
                      <Input.TextArea autoSize={{ minRows: 3 }} />
                    </FormItem>
                  </Col>
                  <Col>
                    <small>
                      <i>
                        EXW: Seller makes a product available at a specific
                        location, but the Buyer has to pay the transport costs.
                      </i>
                    </small>
                  </Col>
                </Row>
              </Card>
              <Card
                bordered={false}
                title={<b>Supplier Capability</b>}
                style={{
                  width: '100%',
                  boxShadow: '2px 2px 14px 0 rgba(0,0,0,.1)',
                  marginTop: 32
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
                        style={{ width: '50%' }}
                      >
                        {!!supCertificationData &&
                          supCertificationData.map((type) => (
                            <Option
                              value={type.id}
                              index={type.id}
                              key={type.id}
                            >
                              {type.description}
                            </Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col style={styles.colStyle} span={24}>
                    <FormItem
                      label="Other Requirements"
                      name="otherRequirements"
                    >
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
                  width: '100%',
                  boxShadow: '2px 2px 14px 0 rgba(0,0,0,.1)',
                  marginTop: 32,
                  marginBottom: 32
                }}
              >
                <Row align="middle">
                  <Col style={styles.colStyle} span={24}>
                    <FormItem
                      rules={[
                        {
                          required: true,
                          message: 'Please select shipping method'
                        }
                      ]}
                      label="Shipping Method"
                      name="shippingMethodId"
                    >
                      <Select
                        placeholder="Please select"
                        style={{ width: '50%' }}
                      >
                        {!!shippingMethodData &&
                          shippingMethodData.map((type) => (
                            <Option
                              value={type.id}
                              index={type.id}
                              key={type.id}
                            >
                              {type.description}
                            </Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col style={styles.colStyle} span={24}>
                    <FormItem
                      label="Province"
                      name="provinceId"
                      rules={[
                        {
                          required: true,
                          message: 'Please select province'
                        }
                      ]}
                    >
                      <Select
                        placeholder="Please select"
                        onChange={(value) => {
                          getDistrict(value);
                          console.log({ form });
                          form.resetFields(['districtId', 'wardId']);
                        }}
                        showSearch
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: '50%' }}
                      >
                        {!!provinceData &&
                          provinceData.map((province) => (
                            <Option key={province.id} value={province.id}>
                              {province.description}
                            </Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>

                  <Col style={styles.colStyle} span={24}>
                    <FormItem
                      label="District"
                      name="districtId"
                      rules={[
                        {
                          required: true,
                          message: 'Please select district'
                        }
                      ]}
                    >
                      <Select
                        placeholder="Please select"
                        onChange={(value) => {
                          getWard(value);
                          form.resetFields(['wardId']);
                        }}
                        showSearch
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: '50%' }}
                      >
                        {!!districtData &&
                          districtData.map((district) => (
                            <Option key={district.id} value={district.id}>
                              {district.description}
                            </Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col style={styles.colStyle} span={24}>
                    <FormItem
                      label="Ward"
                      name="wardId"
                      rules={[
                        {
                          required: true,
                          message: 'Please select ward'
                        }
                      ]}
                    >
                      <Select
                        placeholder="Please select"
                        style={{ width: '50%' }}
                      >
                        {!!wardData &&
                          wardData.map((ward) => (
                            <Option key={ward.id} value={ward.id}>
                              {ward.description}
                            </Option>
                          ))}
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
                          message: 'Please enter the address'
                        }
                      ]}
                    >
                      <Input placeholder="Enter the address shipping" />
                    </FormItem>
                  </Col>
                  <Col style={styles.colStyle} span={24}>
                    <FormItem label="Lead Time" name="leadTime">
                      <LeadTimeInput />
                    </FormItem>
                  </Col>
                  {/* <Col style={styles.colStyle} span={24}>
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
                      <Select
                        placeholder="Please select"
                        style={{ width: "50%" }}
                      >
                        {!!paymentTermData &&
                          paymentTermData.map((type) => (
                            <Option
                              value={type.id}
                              index={type.id}
                              key={type.id}
                            >
                              {type.description}
                            </Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col> */}
                </Row>
              </Card>
              <Row justify="center" align="middle">
                <Col span={4} style={{ margin: '0 8px' }}>
                  <Button
                    shape="round"
                    onClick={() => {}}
                    block
                    className="submit"
                    type={'primary'}
                    htmlType="submit"
                  >
                    {'Submit'}
                  </Button>
                </Col>
                <Col span={4} style={{ margin: '0 8px' }}>
                  <Button
                    shape="round"
                    onClick={() => {
                      Router.push('/');
                    }}
                    block
                    danger
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default connectToRedux(BuyerRequestCreateComponent);
