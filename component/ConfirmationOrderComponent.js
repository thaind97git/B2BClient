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
    Table,
    Descriptions,
    Drawer
} from "antd";
import { PhoneOutlined, PrinterOutlined, GlobalOutlined, MailOutlined, UserOutlined, MobileOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import RequestDetailsComponent from "./RequestDetailsComponent";
const { Title, Text } = Typography;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

const styles = {
    colStyle: { padding: "0 8px" },
    titleStyle: { fontWeight: 500 },
};

const SUPPLIER_DETAIL = {
    name: "Duy Quang",
    companyName: "FPT company",
    companyPhone: "38835287",
    address: "7 đường 10A, khu dân cư Vĩnh Lộc",
    ward: "phường Bình Hưng Hòa B",
    district: "quận Bình Tân",
    province: "thành phố Hồ Chí Minh",
    phoneNumber: "0919727775",
    email: "duyquanghoang27@gmail.com",
}

// const PriceInput = ({
//     value = {},
//     onChange,
//     price,
//     setPrice,
//     currencyData = [],
// }) => {
//     const currency = ((currencyData && currencyData[0]) || {}).id;

//     const triggerChange = (changedValue) => {
//         if (onChange) {
//             onChange({
//                 price,
//                 currency,
//                 ...value,
//                 ...changedValue,
//             });
//         }
//     };

//     const onNumberChange = (value) => {
//         const newNumber = parseInt(value || 0, 10);
//         if (Number.isNaN(newNumber)) {
//             return;
//         }

//         setPrice(newNumber);

//         triggerChange({
//             price: newNumber,
//         });
//     };

//     return (
//         <span>
//             <InputNumber
//                 placeholder="Enter the preferred unit price"
//                 onChange={onNumberChange}
//                 min={0}
//                 style={{ width: "50%" }}
//                 formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
//                 parser={(value) => value.replace(/,*/g, "")}
//             />
//             <Input
//                 value="VND"
//                 disabled
//                 style={{
//                     width: "48%",
//                     margin: "0 4px",
//                 }}
//             />
//         </span>
//     );
// };
const groupRequestColumns = [
    { title: "Created By", dataIndex: "createdBy", key: "createdBy" },
    { title: "Preferred Unit Price", dataIndex: "price", key: "price" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
    { title: "Actions", dataIndex: "actions", key: "actions" },
];
const productDetailsColumns = [
    { title: "Product Name", dataIndex: "productName", key: "productName" },
    { title: "Price", dataIndex: "productPrice", key: "productPrice" },
    { title: "Total Quantity", dataIndex: "totalQuantity", key: "totalQuantity" }
];

const REQUEST_LIST = [
    {
        key: "1",
        price: "7,000,000 đ",
        category: "Iphone 7S 64Gb",
        quantity: 20,
        createdBy: "User 1",
        dateCreated: "30/09/2020 02:07:26 PM",
        actions: (
            <Space>
                <Button
                    type="link"
                    onClick={() => {
                        setOpenRequestDetail(true);
                    }}
                >
                    {" "}
            Details
          </Button>
            </Space>
        ),
    },
    {
        key: "2",
        price: "6,800,000 đ",
        category: "Iphone 7S 64Gb",
        quantity: 20,
        createdBy: "User 1",
        dateCreated: "30/09/2020 02:07:26 PM",
        actions: (
            <Space>
                <Button
                    type="link"
                    onClick={() => {
                        setOpenRequestDetail(true);
                    }}
                >
                    {" "}
            Details
          </Button>
            </Space>
        ),
    },
    {
        key: "3",
        price: "6,500,000 đ",
        category: "Iphone 7s 64Gb",
        quantity: 20,
        createdBy: "User 1",
        dateCreated: "30/09/2020 02:07:26 PM",
        actions: (
            <Space>
                <Button
                    type="link"
                    onClick={() => {
                        setOpenRequestDetail(true);
                    }}
                >
                    {" "}
            Details
          </Button>
            </Space>
        ),
    },
];

const totalQuantity=0;
const PRODUCT_DETAIL = [{
    productName: "Iphone 7 64gb",
    productPrice: 1000000,
    totalQuantity: REQUEST_LIST.reduce((prev,current) => { return prev + current.quantity }, 0)
}];

const ConfirmationOrderComponent = (props) => {
    // const [price, setPrice] = useState(0);
    const [openRequestDetail, setOpenRequestDetail] = useState(false);
    const [form] = Form.useForm();
    
    return (
        <div>
            <Drawer
                width={640}
                title="RFQ details"
                placement={"right"}
                closable={true}
                onClose={() => setOpenRequestDetail(false)}
                visible={openRequestDetail}
                key={"right"}
            >
                <RequestDetailsComponent
                    buttonActions={[
                        {
                            label: "Remove",
                            buttonProps: {
                                danger: true,
                            },
                        },
                    ]}
                />
            </Drawer>
            <Col span={24}>
                <Row align="middle" justify="center">
                    <Col sm={20} md={18}>
                        <Form
                            form={form}
                            {...formItemLayout}
                            className="register-form"
                            // onFinish={onFinish}
                            initialValues={PRODUCT_DETAIL}
                        >
                            <Row justify="center">
                                <Title style={styles.titleStyle} level={2}>
                                    Confirmation Order
                                </Title>
                            </Row>
                            <Card
                                bordered={false}
                                title={<b>Supplier: {SUPPLIER_DETAIL.name}</b>}
                                style={{
                                    width: "100%",
                                    boxShadow: "2px 2px 14px 0 rgba(0,0,0,.1)",
                                    marginTop: 16,
                                }}
                            >
                                <Row justify="space-between">
                                    <Col span={8}>
                                        <Card
                                            bordered={false}
                                            size="small"
                                        >
                                            <b>Company information</b>
                                            <br />
                                            {SUPPLIER_DETAIL.companyName}
                                            <br />
                                            {SUPPLIER_DETAIL.address}
                                            <br />
                                            {SUPPLIER_DETAIL.ward} - {SUPPLIER_DETAIL.district} - {SUPPLIER_DETAIL.province}
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card
                                            bordered={false}
                                            size="small"
                                        >
                                            <b>Company contact</b>
                                            <br />
                                            <PhoneOutlined />{SUPPLIER_DETAIL.companyPhone}
                                            <br />
                                            <PrinterOutlined />
                                            <br />
                                            <GlobalOutlined />
                                            <br />
                                            <MailOutlined />
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card
                                            bordered={false}
                                            size="small"
                                        >
                                            <b>Supplier contact</b>
                                            <br />
                                            <UserOutlined />{SUPPLIER_DETAIL.email}
                                            <br />
                                            <MobileOutlined />{SUPPLIER_DETAIL.phoneNumber}
                                            <br />
                                            <UserOutlined />
                                            <br />
                                            <MobileOutlined />
                                        </Card>
                                    </Col>
                                </Row>
                            </Card>
                            <Card
                                bordered={false}
                                title={<b>Invoice Item</b>}
                                style={{
                                    width: "100%",
                                    boxShadow: "2px 2px 14px 0 rgba(0,0,0,.1)",
                                    marginTop: 10,
                                }}
                            >
                                <Table
                                    bordered
                                    columns={productDetailsColumns}
                                    dataSource={PRODUCT_DETAIL}
                                    rowKey="id"
                                    pagination={false}
                                    bordered={false}
                                    footer={() => (
                                        <div align="right" style={{ height: "20px" }}><p style={{ color: "blue" }}>Total {PRODUCT_DETAIL[0].productPrice * PRODUCT_DETAIL[0].totalQuantity} đ</p></div>
                                    )}
                                />
                            </Card>
                            <Card
                                bordered={false}
                                title={<b>Request List</b>}
                                style={{
                                    width: "100%",
                                    boxShadow: "2px 2px 14px 0 rgba(0,0,0,.1)",
                                    marginTop: 10,
                                }}>

                                <Table
                                    bordered
                                    columns={groupRequestColumns}
                                    dataSource={REQUEST_LIST}
                                    rowKey="id"
                                    pagination={false}
                                />
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
                                        Submit Order
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Col>
        </div >);
}
export default ConfirmationOrderComponent;