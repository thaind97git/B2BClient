import React, { useEffect, useState } from 'react';
import { Tabs, Row, Typography, Divider, Col, Image } from 'antd';
import MessageList from './Chat/MessageList';
import TabsLayout from '../layouts/TabsLayout';
import {
  fallbackImage,
  getProductImage,
  getShortContent,
  parseBoolean
} from '../utils';
import Avatar from 'antd/lib/avatar/avatar';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getSupplierGroupChat,
  GetSupplierGroupChatData
} from '../stores/ConversationState';

const connectToRedux = connect(
  createStructuredSelector({
    supplierGroupChatData: GetSupplierGroupChatData
  }),
  (dispatch) => ({
    getSupplierGroupChat: (isNegotiating) => {
      dispatch(getSupplierGroupChat(parseBoolean(isNegotiating)));
    }
  })
);

const GroupTile = ({
  productImage,
  groupName,
  contentLabel,
  lastMessageTime
}) => (
  <Row justify="start">
    <Col span={3}>
      <Row style={{ height: '100%' }} align="middle">
        <Avatar
          size="small"
          src={getProductImage(productImage) || fallbackImage}
        />
      </Row>
    </Col>
    <Col span={21}>
      <Col span={24} style={{ textAlign: 'left' }}>
        <b>{getShortContent(groupName)}</b>
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
            {contentLabel}
          </small>{' '}
          <span>&nbsp;</span> <small>8:00</small>
        </div>
      </Col>
    </Col>
  </Row>
);

const SupplierChatComponent = ({
  supplierGroupChatData,
  getSupplierGroupChat
}) => {
  const [isNegotiating, setIsNegotiating] = useState('1');
  const [currentGroupIdSelected, setCurrentGroupIdSelected] = useState(null);
  useEffect(() => {
    getSupplierGroupChat(isNegotiating);
  }, [getSupplierGroupChat, isNegotiating]);

  let GROUP_NEGOTIATING_TABS = [];

  if (supplierGroupChatData) {
    GROUP_NEGOTIATING_TABS = supplierGroupChatData.map((group) => {
      const {
        id,
        lastMessage,
        yourMessage,
        lastMessageTime,
        seen,
        groupname,
        productName,
        productImage,
        totalQuantity,
        totalRFQ,
        unit
      } = group;
      const contentLabel = `${yourMessage ? 'You: ' : ''} ${getShortContent(
        lastMessage,
        12
      )}`;
      return {
        title: (
          <GroupTile
            productImage={productImage}
            groupName={groupname}
            contentLabel={contentLabel}
          />
        ),
        key: id,
        content: (
          <MessageList
            conversationId={currentGroupIdSelected}
            titleProps={{
              leftTitle: (
                <div style={{ textAlign: 'center' }}>
                  <span>{getShortContent(productName, 40)}</span>
                  <div style={{ fontStyle: 'normal', fontWeight: 400 }}>
                    {/* {totalQuantity} {unit} / {totalRFQ} Buyers */}
                  </div>
                </div>
              ),
              rightTitle: (
                <div>
                  <div>
                    {totalQuantity} {unit} / {totalRFQ} Buyers
                  </div>
                </div>
              )
            }}
          />
        )
      };
    });
  }

  const GROUP_STATUS_TABS = [
    {
      title: 'Negotiating',
      key: '1',
      content: (
        <TabsLayout
          onTabClick={(key) => setCurrentGroupIdSelected(key)}
          className="supplier-chat"
          tabPosition={'left'}
          style={{ height: '66vh' }}
          tabs={GROUP_NEGOTIATING_TABS}
        />
      )
    },
    {
      title: 'Done',
      key: '0',
      content: 'Done'
    }
  ];

  return (
    <div
      id="supplier-chat"
      style={{ height: '76vh', overflowY: 'hidden', position: 'relative' }}
    >
      {/* <Row justify="space-between" align="middle">
        <Title level={5}>Supplier Group Chat</Title>
      </Row> */}
      <TabsLayout
        onTabClick={(key) => {
          setIsNegotiating(parseBoolean(key));
        }}
        style={{ height: '100%' }}
        defaultTab={isNegotiating}
        tabPosition="top"
        tabs={GROUP_STATUS_TABS}
      />
      <style global jsx>
        {`
          #supplier-chat .ant-tabs-nav {
            width: 320px;
          }
          .supplier-chat .ant-tabs-content.ant-tabs-content-left {
            height: 100%;
          }
          .supplier-chat .ant-tabs-nav-list {
            overflow-x: hidden;
            overflow-y: hidden;
          }
          .supplier-chat .ant-tabs-nav-list:hover {
            overflow-y: auto;
          }
          .supplier-chat .ant-tabs-nav-list::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            background-color: #f5f5f5;
          }
          .supplier-chat .ant-tabs-nav-list::-webkit-scrollbar {
            width: 4px;
            background-color: #f5f5f5;
          }
          .supplier-chat .ant-tabs-nav-list::-webkit-scrollbar-thumb {
            background-color: #949494;
          }
          .supplier-chat .ant-tabs-nav-list {
            width: 212px;
          }
        `}
      </style>
    </div>
  );
};
export default connectToRedux(SupplierChatComponent);
