import React from "react";
import { Tabs, Row, Typography, Divider } from 'antd';
import Messenger from "./Chat/Messenger";

const { TabPane } = Tabs;
const { Title } = Typography;
const GROUP_LIST = [
    {
        id: "1",
        key: "1",
        name: "Laptop Gaming Asus",
        createdBy: "Aggregator 1",
        product: "Laptop Gaming Asus RTZ 12000",
        category: "Laptop",
        /*status: <GroupStatusComponent status={G_PENDING} />,
        dateCreated: "27/09/1999",
        actions: (
            <Space>
                <Button type="primary" size="small"
                    onClick={() => {
                        Router.push("/admin/group/details?id=1");
                    }}>
                    View Detail
          </Button>
            </Space>
        ),*/
    },
    {
        id: "2",
        key: "2",
        name: "Iphone 12",
        createdBy: "Aggregator 2",
        product: "Iphone 12",
        category: "Mobile Phone",
        /*status: <GroupStatusComponent status={G_BIDDING} />,
        dateCreated: "27/09/1999",
        actions: (
            <Space>
                <Button type="primary" size="small"
                    onClick={() => {
                        Router.push("/admin/group/details?id=1");
                    }}>
                    View Detail
          </Button>
            </Space>
        ),*/
    },
    {
        id: "2",
        key: "2",
        name: "Jean for men",
        createdBy: "Aggregator 3",
        product: "Blue Jean",
        category: "Cloth",
        /*status: <GroupStatusComponent status={G_FAILED} />,
        dateCreated: "27/09/1999",
        actions: (
            <Space>
                <Button type="primary" size="small"
                    onClick={() => {
                        Router.push("/admin/group/details?id=1");
                    }}>
                    View Detail
          </Button>
            </Space>
        ),*/
    },
    {
        id: "2",
        key: "2",
        name: "Keyboard gaming",
        createdBy: "Aggregator 2",
        product: "Keyboard Razor Z2",
        category: "Keyboard",
        /*status: <GroupStatusComponent status={G_DONE} />,
        dateCreated: "27/09/1999",
        actions: (
            <Space>
                <Button type="primary" size="small"
                    onClick={() => {
                        Router.push("/admin/group/details?id=1");
                    }}>
                    View Detail
          </Button>
            </Space>
        ),*/
    },
    {
        id: "2",
        key: "2",
        name: "Gaming Mouse",
        createdBy: "Aggregator 8",
        product: "Razor Mouse",
        category: "Mouse",
        /*status: <GroupStatusComponent status={G_ORDERED} />,
        dateCreated: "27/09/1999",
        actions: (
            <Space>
                <Button type="primary" size="small"
                    onClick={() => {
                        Router.push("/admin/group/details?id=1");
                    }}>
                    View Detail
          </Button>
            </Space>
        ),*/
    },
    {
        id: "2",
        key: "2",
        name: "Headphone for listen to music",
        createdBy: "Aggregator 2",
        product: "Headphone G18",
        category: "HeadPhone",
        /*status: <GroupStatusComponent status={G_WAIT_FOR_AUCTION} />,
        dateCreated: "27/09/1999",
        actions: (
            <Space>
                <Button type="primary" size="small"
                    onClick={() => {
                        Router.push("/admin/group/details?id=1");
                    }}>
                    View Detail
          </Button>
            </Space>
        ),*/
    },
    {
        id: "2",
        key: "2",
        name: "Watch Ben 10",
        createdBy: "Aggregator 14",
        product: "Watch from Ben",
        category: "Watch",
        /*status: <GroupStatusComponent status={G_NEGOTIATING} />,
        dateCreated: "27/09/1999",
        actions: (
            <Space>
                <Button type="primary" size="small"
                    onClick={() => {
                        Router.push("/admin/group/details?id=1");
                    }}>
                    View Detail
          </Button>
            </Space>
        ),*/
    },
];

const GroupChatComponent = () => {
    return (
        <div >
            <Row justify="space-between" align="middle">
                <Title level={3}>Group Chat</Title>
            </Row>
            <Tabs defaultActiveKey="1" tabPosition={'left'} style={{ height: '100vh' }}>
                {[...Array.from({ length: GROUP_LIST.length }, (v, i) => i)].map(i => (
                    <TabPane tab={<div style={{ textAlign: "left" }}><b>{GROUP_LIST[i].name}</b><br />{GROUP_LIST[i].category}</div>} key={i}>
                        <Messenger />
                    </TabPane>
                ))}
            </Tabs>
        </div>
    );
}
export default GroupChatComponent;