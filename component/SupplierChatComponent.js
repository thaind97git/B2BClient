import React from 'react';
import { Tabs, Row, Typography, Divider, Col, Image } from 'antd';
import MessageList from './Chat/MessageList';
import TabsLayout from '../layouts/TabsLayout';
import { fallbackImage, getProductImage, getShortContent } from '../utils';
import Avatar from 'antd/lib/avatar/avatar';
const { Title } = Typography;
const GroupTile = () => (
  <Row justify="start">
    <Col span={3}>
      <Row style={{ height: '100%' }} align="middle">
        <Avatar
          size="small"
          src={getProductImage('b6e331de-ebd7-42a5-37b4-08d87c807da8')}
        />
      </Row>
    </Col>
    <Col span={21}>
      <Col span={24} style={{ textAlign: 'left' }}>
        <b>
          {getShortContent('Combat Men Army Trousers Military Suit Camouflage')}
        </b>
      </Col>
      <Col style={{ textAlign: 'left' }} span={24}>
        <div style={{ width: '100%' }}>
          <small
            style={{
              flex: '0 1 auto',
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'pre'
            }}
          >
            You: chat message something here...
          </small>{' '}
          <span>&nbsp;</span> <small>8:00</small>
        </div>
      </Col>
    </Col>
  </Row>
);

const GROUP_NEGOTIATING_TABS = [
  {
    title: <GroupTile />,
    key: '0',
    content: (
      <MessageList
        props={{ title: 'Combat Men Army Trousers Military Suit Camouflage' }}
      />
    )
  },
  {
    title: <GroupTile />,
    key: '1',
    content: (
      <MessageList
        props={{ title: 'Combat Men Army Trousers Military Suit Camouflage' }}
      />
    )
  },
  {
    title: <GroupTile />,
    key: '2',
    content: (
      <MessageList
        props={{ title: 'Combat Men Army Trousers Military Suit Camouflage' }}
      />
    )
  },
  {
    title: <GroupTile />,
    key: '3',
    content: (
      <MessageList
        props={{ title: 'Combat Men Army Trousers Military Suit Camouflage' }}
      />
    )
  },
  {
    title: <GroupTile />,
    key: '4',
    content: (
      <MessageList
        props={{ title: 'Combat Men Army Trousers Military Suit Camouflage' }}
      />
    )
  }
];

const GROUP_STATUS_TABS = [
  {
    title: 'Negotiating',
    key: '0',
    content: (
      <TabsLayout
        defaultTab="0"
        defaultActiveKey="1"
        tabPosition={'left'}
        style={{ height: '78vh' }}
        tabs={GROUP_NEGOTIATING_TABS}
      >
        {/* {[...Array.from({ length: GROUP_LIST.length }, (v, i) => i)].map(
        (i) => (
          <TabPane
            tab={
              <div style={{ textAlign: 'left' }}>
                <b>{GROUP_LIST[i].name}</b>
                <br />
                {GROUP_LIST[i].category}
              </div>
            }
            key={i}
          >
            <MessageList props={{ title: GROUP_LIST[i].name }} />
          </TabPane>
        )
      )} */}
      </TabsLayout>
    )
  },
  {
    title: 'Done',
    key: '1',
    content: 'Done'
  }
];

const SupplierChatComponent = () => {
  return (
    <div id="supplier-chat">
      <Row justify="space-between" align="middle">
        <Title level={3}>Supplier Group Chat</Title>
      </Row>
      <TabsLayout
        style={{ height: '70vh' }}
        defaultTab="0"
        tabPosition="top"
        tabs={GROUP_STATUS_TABS}
      />
      <style global jsx>
        {`
          #supplier-chat .ant-tabs-nav {
            width: 320px;
          }
        `}
      </style>
    </div>
  );
};
export default SupplierChatComponent;
