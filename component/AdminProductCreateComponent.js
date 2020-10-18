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
    Upload
} from "antd";
import { UploadOutlined } from '@ant-design/icons';
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
                    width: "48%",
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
            <Select
                showSearch
                value={value.unit || unit}
                style={{
                    width: "50%",
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
            </Select>
        </span>
    );
};

const props = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
            console.log(file, fileList);
        }
    },
}

const AdminProductCreateComponent = ({
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
                >
                    <Row justify="center">
                        <Title style={styles.titleStyle} level={2}>
                            Create New Product
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
                                            message: "Please Enter Product Name",
                                        },
                                    ]}>
                                    <Input />
                                </FormItem>
                            </Col>
                            <Col style={styles.colStyle} span={24}>
                                <FormItem
                                    label="Category"
                                    name="category"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select Category Type",
                                        },
                                    ]}>
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
                                    label="Unit"
                                    name="unit"
                                    rules={[
                                        {
                                            required: true,
                                            validator: checkUnit,
                                        },
                                    ]}
                                >
                                    <QuantityInput unitData={unitData} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row align="middle">
                            <Col style={styles.colStyle} span={24}>
                                <FormItem
                                    name="unitPrice"
                                    label="Unit Price:"
                                    rules={[
                                        {
                                            validator: checkPrice,
                                            required: true
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
                            <Col style={styles.colStyle} span={24}>
                                <FormItem
                                    name="imageList"
                                    label="Image List:"
                                    rules={[
                                        {
                                            required: true
                                        },
                                    ]}
                                >
                                    <Upload {...props}>
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                    <Row justify="center" align="middle">
                        <Col span={6}>
                            <Button
                                onClick={() => { }}
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

export default connectToRedux(AdminProductCreateComponent);
