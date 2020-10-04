import React, { useState } from "react";
import { connect } from "react-redux";
/*import { createStructuredSelector } from "reselect";
import { userLogin, userLoginDataSelector } from "../stores/UserState";*/
import { compose } from "redux";
import { Button } from "antd";
import { Tabs, Table, Descriptions, Row, Avatar, Col, Divider, Modal, Collapse } from 'antd';
import Messenger from "./Chat/Messenger";
import ListingSupplierByCategoryComponent from "./ListingSupplierByCategoryComponent";
import ListingRequestForGroupComponent from "./ListingRequestForGroupComponent";

import { render } from "less";

const { TabPane } = Tabs;
const { Panel } = Collapse;

const connectToRedux = connect(
    /*createStructuredSelector({
        userLoginData: userLoginDataSelector,
    }),
    (dispatch) => ({
        loginUser: ({ email, password }) =>
            dispatch(userLogin({ email, password })),
    })*/
);


const enhance = compose(connectToRedux);

const GROUP_LIST =
    [
        {
            "title": "Iphone 20x",
            "category": "Mobile Phone",
            "dateCreated": "27/09/2020",
            "dateUpdated": "28/09/2020",
            "description": "2000 Mobile",
            "Reserve Auction ID": "None",
            "status": "Waiting"
        },
        {
            "title": "Laptop Gaming",
            "category": "Laptop",
            "dateCreated": "27/09/1999",
            "dateUpdated": "28/09/2020",
            "description": "2000 Laptop",
            "ReserveAuctionID": "123",
            "status": "Success"
        }
    ]
const REQUEST_LIST =
    [
        {
            "id": "123",
            "name": "Buyer1",
            "quantity": "1",
            "price": "3000",
            "description": "1 Laptop"
        },
        {

            "id": "124",
            "name": "Buyer2",
            "quantity": "5",
            "price": "5000",
            "description": "5 Laptop"
        },
        {

            "id": "125",
            "name": "Buyer3",
            "quantity": "6",
            "price": "5333",
            "description": "6 Laptop"
        }
    ]
const GroupRequestComponent = () => {
    const [isSupplierModalVisible, setSupplierModalVisible] = useState(false);
    const [isRequestModalVisible, setRequestModalVisible] = useState(false);

    const showModal = e => {
        if (e === 'supplier') {
            setSupplierModalVisible(true);
        }
        else {
            setRequestModalVisible(true);
        }
    };

    const handleOk = e => {
        if (e === 'supplier') {
            setSupplierModalVisible(false);
        }
        else {
            setRequestModalVisible(false);
        }
    };

    const handleCancel = e => {
        if (e === 'supplier') {
            setSupplierModalVisible(false);
        }
        else {
            setRequestModalVisible(false);
        }
    };

    const groupRequestColumns = [
        { title: 'Id', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: () => <a>Delete</a>,
        },
    ];

    return (
        <div>
            <Row>
                <Col span={24}>
                    <div>
                        <Button type="primary" style={{ right: '20px', position: 'absolute' }}>Create new group</Button>
                    </div>
                </Col>
                <Divider style={{ opacity: '0' }} />
            </Row>
            <Row>
                <Col span={24}>
                    <Tabs defaultActiveKey="1" tabPosition={'left'} style={{ height: '100%' }}>
                        {[...Array.from({ length: GROUP_LIST.length }, (v, i) => i)].map(i => (
                            <TabPane tab={<div><b>{GROUP_LIST[i].title}</b><br />{GROUP_LIST[i].category}</div>} key={i}>
                                <Collapse accordion>
                                    <Panel header={<div><b>Group Detail</b><Button type="primary" style={{ top: '6.5px', right: '20px', position: 'absolute' }} onClick={() => showModal('supplier')}>Find Suppliers</Button></div>}>
                                        <Descriptions title={GROUP_LIST[i].title} >
                                            <Descriptions.Item label="Category">{GROUP_LIST[i].category}</Descriptions.Item>
                                            <Descriptions.Item label="Created date">{GROUP_LIST[i].dateCreated}</Descriptions.Item>
                                            <Descriptions.Item label="Updated Date">{GROUP_LIST[i].dateUpdated}</Descriptions.Item>
                                            <Descriptions.Item label="Reserve Auction ID">{GROUP_LIST[i].ReserveAuctionID}</Descriptions.Item>
                                            <Descriptions.Item label="Status">{GROUP_LIST[i].status}</Descriptions.Item>
                                            <Descriptions.Item label="Description">{GROUP_LIST[i].description}</Descriptions.Item>
                                        </Descriptions>
                                        <Modal
                                            title="Find Supplier"
                                            visible={isSupplierModalVisible}
                                            onOk={() => handleOk('supplier')}
                                            onCancel={() => handleCancel('supplier')}
                                        >
                                            <ListingSupplierByCategoryComponent category={GROUP_LIST[i].category} />
                                        </Modal>
                                    </Panel>
                                </Collapse>
                                <Divider />
                                <Collapse accordion>
                                    <Panel header={<div><b>Group Request</b><Button type="primary" style={{ top: '6.5px', right: '20px', position: 'absolute' }} onClick={() => showModal('request')}>Add Requests</Button></div>}>
                                        <Table
                                            columns={groupRequestColumns}
                                            expandable={{
                                                expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>
                                            }}
                                            dataSource={REQUEST_LIST}
                                            rowKey="id"
                                        />
                                        <Modal
                                            title="Add Request"
                                            visible={isRequestModalVisible}
                                            onOk={() => handleOk('request')}
                                            onCancel={() => handleCancel('request')}
                                        >
                                            <ListingRequestForGroupComponent category={GROUP_LIST[i].category} />
                                        </Modal>
                                    </Panel>
                                </Collapse>
                                <Divider />
                                <Messenger />
                            </TabPane>
                        ))}
                    </Tabs>
                </Col>
            </Row>
        </div>
    );

};
export default enhance(GroupRequestComponent);
