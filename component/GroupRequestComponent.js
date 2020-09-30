import React, { useState } from "react";
import { connect } from "react-redux";
/*import { createStructuredSelector } from "reselect";
import { userLogin, userLoginDataSelector } from "../stores/UserState";*/
import { compose } from "redux";
import { Button } from "antd";
import { Tabs, Radio, Descriptions, Row, Avatar, Col, Divider, Modal, Collapse } from 'antd';
import Messenger from "./Chat/Messenger";
import ListingSupplierByCategoryComponent from "./ListingSupplierByCategoryComponent";

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
const GroupRequestComponent = () => {
    const [visible, setVisible] = useState(false);

    const showModal = () => {

        console.log('show');
        setVisible(true);
    };

    const handleOk = e => {
        console.log('ok');
        setVisible(false);
    };

    const handleCancel = e => {
        console.log('cancel');
        setVisible(false);
    };

    return (
        <div >
            <Tabs defaultActiveKey="1" tabPosition={'left'} style={{ height: '100vh' }}>
                {[...Array.from({ length: GROUP_LIST.length }, (v, i) => i)].map(i => (
                    <TabPane tab={<div><b>{GROUP_LIST[i].title}</b><br />{GROUP_LIST[i].category}</div>} key={i}>
                        <Collapse accordion>
                            <Panel header={<div><b>Group Detail</b><Button type="primary" style={{ right: '20px', position: 'absolute' }} onClick={showModal}>Find Suppliers</Button></div>}>
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
                                    visible={visible}
                                    onOk={handleOk}
                                    onCancel={handleCancel}
                                >
                                    <ListingSupplierByCategoryComponent category={GROUP_LIST[i].category} />
                                </Modal>
                            </Panel>
                        </Collapse>
                        <Divider />
                        <Messenger />
                    </TabPane>
                ))}
            </Tabs>
        </div>
    );

};
export default enhance(GroupRequestComponent);
