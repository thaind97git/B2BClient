import React, { useEffect, useState } from 'react';
import { Row, Col, Tooltip, Empty } from 'antd';
import MessageList from './Chat/MessageList';
import TabsLayout from '../layouts/TabsLayout';
import {
  fallbackImage,
  getFromNowTime,
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
import moment from 'moment';
import SignalR from '../libs/signalR';

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
        <div
          style={{
            width: 260,
            minHeight: '2em',
            maxheight: '5em',
            textAlign: 'left',
            whiteSpace: 'normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            paddingRight: 6
          }}
        >
          {groupName}
        </div>
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
          <span>&nbsp;</span>{' '}
          <small>{lastMessageTime && getFromNowTime(lastMessageTime)}</small>
        </div>
      </Col>
    </Col>
  </Row>
);

const signalR = new SignalR({});
signalR.startConnection();

const SupplierChatComponent = ({
  supplierGroupChatData,
  getSupplierGroupChat
}) => {
  const [isNegotiating, setIsNegotiating] = useState('1');
  const [currentGroupIdSelected, setCurrentGroupIdSelected] = useState(null);
  const [lastMesTime, setLastMesTime] = useState(null);

  const [newMessage, setNewMessage] = useState({});
  useEffect(() => {
    getSupplierGroupChat(parseBoolean(isNegotiating));
  }, [getSupplierGroupChat, isNegotiating]);

  let GROUP_NEGOTIATING_TABS = [];

  if (supplierGroupChatData && supplierGroupChatData.length > 0) {
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
        lastMessage
      )}`;
      return {
        title: (
          <GroupTile
            lastMessageTime={lastMesTime || lastMessageTime}
            productImage={productImage}
            groupName={groupname}
            contentLabel={contentLabel}
          />
        ),
        key: id,
        content: (
          <MessageList
            isDone={!parseBoolean(isNegotiating)}
            signalR={signalR}
            getNewMessage={(message) => setNewMessage(message)}
            conversationId={currentGroupIdSelected}
            titleProps={{
              leftTitle: (
                <div style={{ textAlign: 'center' }}>
                  <Tooltip title={productName}>
                    <span style={{ fontWeight: 600 }}>
                      {getShortContent(productName, 100)}
                    </span>
                  </Tooltip>
                </div>
              ),
              rightTitle: (
                <div>
                  <div>
                    <b>{totalQuantity}</b> {unit} / <b>{totalRFQ}</b>{' '}
                    {parseInt(totalRFQ) === 1 ? 'Buyer' : 'Buyers'}
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
          emptyLabel="Not found any conversation"
          onTabClick={(key) => setCurrentGroupIdSelected(key)}
          className="supplier-chat"
          tabPosition={'left'}
          style={{ height: '100%' }}
          tabs={GROUP_NEGOTIATING_TABS}
        />
      )
    },
    {
      title: 'Done',
      key: '0',
      content: (
        <TabsLayout
          onTabClick={(key) => setCurrentGroupIdSelected(key)}
          className="supplier-chat"
          tabPosition={'left'}
          style={{ height: '100%' }}
          tabs={GROUP_NEGOTIATING_TABS}
        />
      )
    }
  ];

  return (
    <div
      id="supplier-chat"
      style={{ height: '100%', overflowY: 'hidden', position: 'relative' }}
    >
      <TabsLayout
        emptyLabel="Not found any conversation"
        onTabClick={(key) => {
          setIsNegotiating(key);
        }}
        style={{ height: '100%' }}
        defaultTab={isNegotiating}
        tabPosition="top"
        tabs={GROUP_STATUS_TABS}
      />
      <style global jsx>
        {`
          #supplier-chat .ant-tabs-nav-list {
            width: 320px;
          }
          #supplier-chat
            .ant-tabs-content-holder
            > .ant-tabs-content
            > .ant-tabs-tabpane {
            padding-left: 0px;
          }
          .supplier-chat .ant-tabs-content.ant-tabs-content-left,
          .ant-tabs-content,
          .ant-tabs-content ant-tabs-content-top {
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
