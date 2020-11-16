import React, { Fragment, useEffect, useState } from 'react';
import { FileProtectOutlined, FlagOutlined } from '@ant-design/icons';
import { Row, Col, Button, Empty, Space, Avatar } from 'antd';
import MessageList from './Chat/MessageList';
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
import Router, { useRouter } from 'next/router';
import { createLink } from '../libs';
import {
  ignoreSupplier,
  IgnoreSupplierData,
  IgnoreSupplierResetter,
  unIgnoreSupplier,
  UnIgnoreSupplierData,
  UnIgnoreSupplierResetter
} from '../stores/SupplierState';
import SignalR from '../libs/signalR';
const connectToRedux = connect(
  createStructuredSelector({
    GetAggregatorGroupChatData: GetAggregatorGroupChatData,
    GetSupplierChatByGroupData: GetSupplierChatByGroupData,
    IgnoreSupData: IgnoreSupplierData,
    UnIgnoreSupData: UnIgnoreSupplierData
  }),
  (dispatch) => ({
    getAggregatorGroupChat: (isNegotiating) =>
      dispatch(getAggregatorGroupChat(isNegotiating)),
    getSupplierChatByGroup: (groupId) =>
      dispatch(getSupplierChatByGroup(groupId)),
    ignoreSup: (conversationId) => dispatch(ignoreSupplier(conversationId)),
    unIgnoreSup: (conversationId) => dispatch(unIgnoreSupplier(conversationId)),
    resetIgnoreData: () => {
      dispatch(IgnoreSupplierResetter);
      dispatch(UnIgnoreSupplierResetter);
    }
  })
);

const GroupTile = ({ productImage, groupName }) => (
  <Row justify="start">
    <Col span={4}>
      <Avatar size="small" src={getProductImage(productImage)} />
    </Col>
    <Col span={20}>
      <b>{getShortContent(groupName)}</b>
    </Col>
  </Row>
);

const signalR = new SignalR({});
signalR.startConnection();

const GroupChatComponent = ({
  GetAggregatorGroupChatData,
  getAggregatorGroupChat,
  GetSupplierChatByGroupData,
  getSupplierChatByGroup,
  ignoreSup,
  unIgnoreSup,
  IgnoreSupData,
  UnIgnoreSupData,
  resetIgnoreData
}) => {
  const [isNegotiating, setIsNegotiating] = useState('1');
  const [currentGroupIdSelected, setCurrentGroupIdSelected] = useState(null);
  const [currentGroupNameSelected, setCurrentGroupNameSelected] = useState(
    null
  );
  const [currentConversationId, setCurrentConversationId] = useState(null);

  const [groupTabs, setGroupTabs] = useState([]);
  const [messengerTabs, setMessengerTabs] = useState([]);
  const [isFirstCall, setIsFirstCall] = useState(true);
  const router = useRouter();
  const groupId = router.query.groupId;

  useEffect(() => {
    return () => {
      signalR.stopConnection();
    };
  }, []);
  useEffect(() => {
    signalR.onListen('ConversationPushing', (conversationId) => {
      console.log({ conversationId });
      if (GetSupplierChatByGroupData && GetSupplierChatByGroupData.length > 0) {
        console.log({ 1: GetSupplierChatByGroupData });
        GetSupplierChatByGroupData.sort(function (x, y) {
          return x.id === conversationId ? -1 : y.id === conversationId ? 1 : 0;
        });
        console.log({ 2: GetSupplierChatByGroupData });
      }
    });
  }, []);
  useEffect(() => {
    signalR.onListen('GroupPushing', (data) => {
      console.log({ GroupPushing: data });
    });
  }, []);

  useEffect(() => {
    if (groupId && isFirstCall) {
      getSupplierChatByGroup(groupId);
      setCurrentGroupIdSelected(groupId);
      setIsFirstCall(false);
    }
  }, [groupId, isFirstCall, getSupplierChatByGroup]);

  // Receive list chat message
  useEffect(() => {
    const current =
      (GetSupplierChatByGroupData || []).find(
        (x) => x.id === currentConversationId
      ) || {};
    const { flag: isIgnored } = current;
    const mesTabs =
      (GetSupplierChatByGroupData &&
        GetSupplierChatByGroupData.map((supplier = {}) => {
          const {
            id,
            supplierName,
            supplierAvatar,
            lastMessage,
            yourMessage,
            flag: currentIgnore,
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
                isIgnored={currentIgnore}
                data={{
                  name: supplierName,
                  text: contentLabel,
                  photo: getCurrentUserImage(supplierAvatar) || fallbackImage,
                  lastMessageTime
                }}
              />
            ),
            key: id,
            content: (
              <MessageList
                isIgnored={isIgnored}
                signalR={signalR}
                conversationId={currentConversationId}
                titleProps={{
                  leftTitle: currentGroupNameSelected,
                  rightTitle: (
                    <Space>
                      <Button
                        icon={<FileProtectOutlined />}
                        size="small"
                        style={{ color: 'green' }}
                        onClick={() => {
                          Router.push(
                            createLink([
                              'aggregator',
                              'order',
                              `confirmation?groupId=${groupId}&isNegotiating=true&supplierId=${currentConversationId}`
                            ])
                          );
                        }}
                      >
                        Closing deal
                      </Button>
                      {
                        <Button
                          onClick={() => {
                            isIgnored
                              ? unIgnoreSup(currentConversationId)
                              : ignoreSup(currentConversationId);
                          }}
                          icon={<FlagOutlined />}
                          size="small"
                          type={isIgnored ? 'primary' : ''}
                          danger={isIgnored ? false : true}
                        >
                          {isIgnored ? 'Un-Ignore' : 'Ignore'}
                        </Button>
                      }
                    </Space>
                  )
                }}
              />
            )
          };
        })) ||
      [];

    setMessengerTabs(mesTabs);
  }, [
    GetSupplierChatByGroupData,
    currentConversationId,
    currentGroupNameSelected,
    groupId,
    ignoreSup,
    unIgnoreSup
  ]);
  // Receive list aggregator
  useEffect(() => {
    const groupTabs =
      (GetAggregatorGroupChatData &&
        GetAggregatorGroupChatData.map((group = {}) => {
          return {
            tooltipTitle: group.groupName,
            title: (
              <GroupTile
                productImage={group.avatar}
                groupName={group.groupName}
              />
            ),
            key: group.id,
            content:
              GetSupplierChatByGroupData &&
              GetSupplierChatByGroupData.length > 0 ? (
                <Fragment>
                  <TabsLayout
                    onTabClick={(conversationId) => {
                      setCurrentGroupNameSelected(group.groupName);
                      setCurrentConversationId(conversationId);
                    }}
                    className="list-chat"
                    tabPosition={'left'}
                    style={{ height: '100%' }}
                    tabs={messengerTabs}
                  />
                </Fragment>
              ) : (
                <Empty description="No suppliers in this group" />
              )
          };
        })) ||
      [];

    setGroupTabs(groupTabs);
  }, [
    GetAggregatorGroupChatData,
    messengerTabs,
    ignoreSup,
    unIgnoreSup,
    GetSupplierChatByGroupData
  ]);

  useEffect(() => {
    getAggregatorGroupChat(parseBoolean(isNegotiating));
  }, [isNegotiating, getAggregatorGroupChat]);

  useEffect(() => {
    if (currentGroupIdSelected || IgnoreSupData || UnIgnoreSupData) {
      getSupplierChatByGroup(currentGroupIdSelected);
      resetIgnoreData();
    }
  }, [
    currentGroupIdSelected,
    getSupplierChatByGroup,
    IgnoreSupData,
    UnIgnoreSupData,
    resetIgnoreData
  ]);

  const GROUP_STATUS_TABS = [
    {
      title: 'Negotiating',
      key: '1',
      content:
        GetAggregatorGroupChatData && GetAggregatorGroupChatData.length > 0 ? (
          <TabsLayout
            onTabClick={(groupId) => {
              setCurrentGroupIdSelected(groupId);
            }}
            defaultTab={groupId || (groupTabs[0] || {}).id}
            className="aggregator-chat"
            tabPosition={'left'}
            style={{ height: '100%' }}
            tabs={groupTabs}
          />
        ) : (
          <Empty description="Not found any group" />
        )
    },
    {
      title: 'Others',
      key: '0',
      content:
        GetAggregatorGroupChatData && GetAggregatorGroupChatData.length > 0 ? (
          <TabsLayout
            onTabClick={(groupId) => {
              setCurrentGroupIdSelected(groupId);
            }}
            defaultTab={groupId || (groupTabs[0] || {}).id}
            className="aggregator-chat"
            tabPosition={'left'}
            style={{ height: '100%' }}
            tabs={groupTabs}
          />
        ) : (
          <Empty description="Not found any group" />
        )
    }
  ];
  return (
    <div
      id="aggregator-group-chat"
      style={{ height: '100%', overflowY: 'hidden', position: 'relative' }}
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

          .list-chat .ant-tabs-tab-btn {
            width: 100%;
          }

          .aggregator-chat .ant-tabs-content.ant-tabs-content-left,
          .ant-tabs-content,
          .ant-tabs-content ant-tabs-content-top {
            height: 100%;
          }
          .list-chat,
          .aggregator-chat
            .ant-tabs-content-holder
            > .ant-tabs-content
            > .ant-tabs-tabpane {
            padding-left: 0px;
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
            overflow-y: auto;
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
            width: 320px;
          }
        `}
      </style>
    </div>
  );
};
export default connectToRedux(GroupChatComponent);
