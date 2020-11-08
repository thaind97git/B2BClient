import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Empty } from 'antd';
import MessageList from './Chat/MessageList';
import Avatar from 'antd/lib/avatar/avatar';
import {
  fallbackImage,
  getProductImage,
  getShortContent,
  parseBoolean,
  getCurrentUserImage
} from '../utils';
import TabsLayout from '../layouts/TabsLayout';
import ConversationListItem from './Chat/ConversationListItem';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getAggregatorGroupChat,
  GetAggregatorGroupChatData,
  getSupplierChatByGroup,
  GetSupplierChatByGroupData
} from '../stores/ConversationState';
import { useRouter } from 'next/router';

const connectToRedux = connect(
  createStructuredSelector({
    GetAggregatorGroupChatData: GetAggregatorGroupChatData,
    GetSupplierChatByGroupData: GetSupplierChatByGroupData
  }),
  (dispatch) => ({
    getAggregatorGroupChat: (isNegotiating) =>
      dispatch(getAggregatorGroupChat(isNegotiating)),
    getSupplierChatByGroup: (groupId) =>
      dispatch(getSupplierChatByGroup(groupId))
  })
);

const GroupTile = ({ productImage, groupName }) => (
  <Row justify="start">
    <Col span={3}>
      <Row style={{ height: '100%' }} align="middle">
        <Avatar size="small" src={getProductImage(productImage)} />
      </Row>
    </Col>
    <Col span={21}>
      <Col span={24} style={{ textAlign: 'left' }}>
        <b>{getShortContent(groupName)}</b>
      </Col>
    </Col>
  </Row>
);

const GroupChatComponent = ({
  GetAggregatorGroupChatData,
  getAggregatorGroupChat,
  GetSupplierChatByGroupData,
  getSupplierChatByGroup
}) => {
  const [isNegotiating, setIsNegotiating] = useState('1');
  const [currentGroupIdSelected, setCurrentGroupIdSelected] = useState(null);
  const [currentSupplierIdSelected, setCurrentSupplierIdSelected] = useState(
    null
  );

  const [groupTabs, setGroupTabs] = useState([]);
  const [messengerTabs, setMessengerTabs] = useState([]);
  const [isFirstCall, setIsFirstCall] = useState(true);
  const router = useRouter();
  const groupId = router.query.groupId;

  useEffect(() => {
    if (groupId && isFirstCall) {
      getSupplierChatByGroup(groupId);
      setIsFirstCall(false);
    }
  }, [groupId, isFirstCall, getSupplierChatByGroup]);

  useEffect(() => {
    let mesTabs = [];
    if (GetSupplierChatByGroupData && GetSupplierChatByGroupData.length > 0) {
      mesTabs = GetSupplierChatByGroupData.map((supplier = {}) => {
        const {
          id,
          supplierName,
          supplierAvatar,
          lastMessage,
          yourMessage,
          flag: isIgnore,
          lastMessageTime,
          seen
        } = supplier;

        const contentLabel = `${yourMessage ? 'You: ' : ''} ${getShortContent(
          lastMessage,
          12
        )}`;
        return {
          title: (
            <ConversationListItem
              data={{
                name: supplierName,
                text: contentLabel,
                photo: getCurrentUserImage(supplierAvatar) || fallbackImage
              }}
            />
          ),
          key: id,
          content: (
            <div className="scrollable content">
              <MessageList
                conversationId={currentSupplierIdSelected}
                titleProps={{
                  title: 'Title',
                  rightTitle: <Button size="small">Ignore</Button>
                }}
              />
            </div>
          )
        };
      });
    } else {
      mesTabs = [
        {
          title: <Empty description="No suppliers in this group" />
        }
      ];
    }
    setMessengerTabs(mesTabs);
  }, [GetSupplierChatByGroupData, currentSupplierIdSelected]);

  useEffect(() => {
    const groupTabs =
      (GetAggregatorGroupChatData &&
        GetAggregatorGroupChatData.map((group) => {
          return {
            title: (
              <GroupTile
                productImage={group.avatar}
                groupName={group.groupName}
              />
            ),
            key: group.id,
            content: (
              <TabsLayout
                onTabClick={(supplierId) => {
                  setCurrentSupplierIdSelected(supplierId);
                }}
                id="scrollbar"
                className="list-chat"
                tabPosition={'left'}
                style={{ height: '75vh', margin: '8px 0px' }}
                tabs={messengerTabs}
              />
            )
          };
        })) ||
      [];
    setGroupTabs(groupTabs);
  }, [GetAggregatorGroupChatData, messengerTabs]);

  useEffect(() => {
    getAggregatorGroupChat(parseBoolean(isNegotiating));
  }, [isNegotiating, getAggregatorGroupChat]);

  useEffect(() => {
    if (currentGroupIdSelected) {
      getSupplierChatByGroup(currentGroupIdSelected);
    }
  }, [currentGroupIdSelected, getSupplierChatByGroup]);

  const GROUP_STATUS_TABS = [
    {
      title: 'Negotiating',
      key: '1',
      content: (
        <TabsLayout
          onTabClick={(groupId) => {
            setCurrentGroupIdSelected(groupId);
          }}
          defaultTab={groupId || (groupTabs[0] || {}).id}
          id="scrollbar"
          className="aggregator-chat"
          tabPosition={'left'}
          style={{ height: '75vh' }}
          tabs={groupTabs}
        />
      )
    },
    {
      title: 'Processed',
      key: '0',
      content: 'processed'
    }
  ];
  return (
    <div
      id="aggregator-group-chat"
      style={{ height: '76vh', overflowY: 'hidden', position: 'relative' }}
    >
      <TabsLayout
        onTabClick={(key) => {
          setIsNegotiating(key);
        }}
        style={{ height: '100%' }}
        defaultTab={isNegotiating}
        tabPosition="top"
        tabs={GROUP_STATUS_TABS}
      />

      <style jsx global>
        {`
          #aggregator-group-chat .ant-tabs-content.ant-tabs-content-left {
            height: 100%;
          }

          .aggregator-chat .ant-tabs-content.ant-tabs-content-left {
            height: 100%;
          }
          #aggregator-group-chat
            .aggregator-chat
            .ant-tabs-left
            > .ant-tabs-nav
            .ant-tabs-tab {
            padding: 8px 24px 8px 4px;
          }

          .aggregator-chat .ant-tabs-nav-list {
            overflow-x: hidden;
            overflow-y: hidden;
          }
          .aggregator-chat .ant-tabs-nav-list:hover {
            overflow-y: auto;
          }
          .aggregator-chat .ant-tabs-nav-list::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            background-color: #f5f5f5;
          }
          .aggregator-chat .ant-tabs-nav-list::-webkit-scrollbar {
            width: 4px;
            background-color: #f5f5f5;
          }
          .aggregator-chat .ant-tabs-nav-list::-webkit-scrollbar-thumb {
            background-color: #949494;
          }

          .list-chat .ant-tabs-nav-list {
            width: 212px;
          }
        `}
      </style>
    </div>
  );
};
export default connectToRedux(GroupChatComponent);
