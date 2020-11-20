import React, { useEffect, useState } from 'react';
import { FileProtectOutlined, FlagOutlined } from '@ant-design/icons';
import { Row, Col, Button, Empty, Space, Avatar, Tabs } from 'antd';
import MessageList from './Chat/MessageList';
import {
  fallbackImage,
  getProductImage,
  getShortContent,
  parseBoolean,
  getCurrentUserImage
} from '../utils';
import ConversationListItem from './Chat/ConversationListItem';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getAggregatorGroupChat,
  GetAggregatorGroupChatData,
  GetAggregatorGroupChatResetter,
  GetMessagesResetter,
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
    },
    resetGroupList: () => dispatch(GetAggregatorGroupChatResetter),
    resetMessage: () => dispatch(GetMessagesResetter)
  })
);
const { TabPane } = Tabs;
const GroupTile = ({ productImage, groupName }) => (
  <Row justify="start">
    <Col span={4}>
      <Avatar size="small" src={getProductImage(productImage)} />
    </Col>
    <Col span={20}>
      <div
        style={{
          width: 260,
          height: '5em',
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
  </Row>
);

const signalR = new SignalR({});
signalR.startConnection();

const TabsConversation = ({
  conversationData = [],
  groupId,
  ignoreSup,
  unIgnoreSup,
  setCurrentConversationId,
  signalR,
  isClosingDeal = true
}) => {
  return conversationData && conversationData.length > 0 ? (
    <Tabs
      className="conversation-tabs"
      destroyInactiveTabPane
      tabPosition="left"
      onChange={(key) => setCurrentConversationId(key)}
    >
      {conversationData.map((conversation = {}) => {
        const {
          id: conversationId,
          supplierName,
          supplierAvatar,
          lastMessage,
          yourMessage,
          flag: currentIgnore,
          lastMessageTime,
          seen,
          supplierId
        } = conversation;
        const contentLabel = `${yourMessage ? 'You: ' : ''} ${getShortContent(
          lastMessage,
          12
        )}`;
        return (
          <TabPane
            tab={
              <ConversationListItem
                isIgnored={currentIgnore}
                data={{
                  name: supplierName,
                  text: contentLabel,
                  photo: getCurrentUserImage(supplierAvatar) || fallbackImage,
                  lastMessageTime
                }}
              />
            }
            key={conversationId}
          >
            <MessageList
              isDone={!isClosingDeal}
              isIgnored={currentIgnore}
              signalR={signalR}
              conversationId={conversationId}
              titleProps={{
                leftTitle: supplierName,
                rightTitle: (
                  <Space>
                    {isClosingDeal && (
                      <Button
                        icon={<FileProtectOutlined />}
                        size="small"
                        style={{ color: 'green' }}
                        onClick={() => {
                          Router.push(
                            createLink([
                              'aggregator',
                              'order',
                              `confirmation?groupId=${groupId}&isNegotiating=true&supplierId=${supplierId}`
                            ])
                          );
                        }}
                      >
                        Closing deal
                      </Button>
                    )}
                    {(ignoreSup || unIgnoreSup) && (
                      <Button
                        onClick={() => {
                          currentIgnore
                            ? unIgnoreSup(conversationId)
                            : ignoreSup(conversationId);
                        }}
                        icon={<FlagOutlined />}
                        size="small"
                        type={currentIgnore ? 'primary' : ''}
                        danger={currentIgnore ? false : true}
                      >
                        {currentIgnore ? 'Un-Ignore' : 'Ignore'}
                      </Button>
                    )}
                  </Space>
                )
              }}
            />
          </TabPane>
        );
      })}
    </Tabs>
  ) : (
    <Empty description="Not found any group" />
  );
};

const TabsGroup = ({
  groupData = [],
  conversationData = [],
  setCurrentGroupIdSelected,
  groupId,
  ignoreSup,
  unIgnoreSup,
  setCurrentConversationId,
  currentConversationId,
  signalR,
  isClosingDeal,
  defaultGroup,
  setDefaultGroup
}) => {
  return groupData && groupData.length > 0 ? (
    <Tabs
      className="group-tabs"
      destroyInactiveTabPane
      tabPosition="left"
      onChange={(groupId) => {
        setDefaultGroup(groupId);
        setCurrentGroupIdSelected(groupId);
      }}
      activeKey={defaultGroup}
      defaultActiveKey={defaultGroup}
    >
      {groupData.map((group = {}) => {
        return (
          <TabPane
            tab={
              <GroupTile
                productImage={group.avatar}
                groupName={group.groupName}
              />
            }
            key={group.id}
          >
            <TabsConversation
              signalR={signalR}
              groupId={groupId}
              ignoreSup={ignoreSup}
              unIgnoreSup={unIgnoreSup}
              conversationData={conversationData}
              setCurrentConversationId={setCurrentConversationId}
              currentConversationId={currentConversationId}
              isClosingDeal={isClosingDeal}
            />
          </TabPane>
        );
      })}
    </Tabs>
  ) : (
    <Empty description="Not found any group" />
  );
};

const GroupChatComponent = ({
  GetAggregatorGroupChatData,
  getAggregatorGroupChat,
  GetSupplierChatByGroupData,
  getSupplierChatByGroup,
  ignoreSup,
  unIgnoreSup,
  IgnoreSupData,
  UnIgnoreSupData,
  resetIgnoreData,
  resetGroupList,
  resetMessage
}) => {
  const [isNegotiating, setIsNegotiating] = useState('1');
  const [currentGroupIdSelected, setCurrentGroupIdSelected] = useState(null);

  const [currentConversationId, setCurrentConversationId] = useState(null);

  const [isFirstCall, setIsFirstCall] = useState(true);
  const router = useRouter();
  const groupId = router.query.groupId;
  const [conversationData, setConversationData] = useState([]);

  const [defaultGroup, setDefaultGroup] = useState(groupId || null);

  useEffect(() => {
    return () => {
      signalR.stopConnection();
    };
  }, []);

  useEffect(() => {
    if (GetSupplierChatByGroupData && GetSupplierChatByGroupData.length > 0) {
      setConversationData(GetSupplierChatByGroupData);
    }
  }, [GetSupplierChatByGroupData]);
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

  return (
    <div
      id="aggregator-group-chat"
      style={{ height: '100%', overflowY: 'hidden', position: 'relative' }}
    >
      <Tabs
        defaultActiveKey={isNegotiating}
        tabPosition="top"
        destroyInactiveTabPane
        onChange={(key) => {
          resetMessage();
          setIsNegotiating(key);
          setCurrentGroupIdSelected(null);
          resetGroupList();
          setConversationData([]);
          setDefaultGroup(groupId || null);
        }}
      >
        <TabPane tab="Negotiating" key="1">
          <TabsGroup
            defaultGroup={defaultGroup}
            setDefaultGroup={setDefaultGroup}
            groupData={GetAggregatorGroupChatData}
            setCurrentGroupIdSelected={setCurrentGroupIdSelected}
            conversationData={conversationData}
            groupId={groupId || currentGroupIdSelected}
            ignoreSup={ignoreSup}
            unIgnoreSup={unIgnoreSup}
            setCurrentConversationId={setCurrentConversationId}
            currentConversationId={currentConversationId}
            signalR={signalR}
          />
        </TabPane>
        <TabPane tab="Others" key="0">
          <TabsGroup
            defaultGroup={defaultGroup}
            setDefaultGroup={setDefaultGroup}
            groupData={GetAggregatorGroupChatData}
            setCurrentGroupIdSelected={setCurrentGroupIdSelected}
            conversationData={conversationData}
            groupId={groupId || currentGroupIdSelected}
            setCurrentConversationId={setCurrentConversationId}
            currentConversationId={currentConversationId}
            signalR={signalR}
            isClosingDeal={false}
          />
        </TabPane>
      </Tabs>

      <style jsx global>
        {`
          .conversation-tabs .ant-tabs-nav {
            width: 260px;
          }
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
          #aggregator-group-chat,
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
          #aggregator-group-chat .ant-tabs-left > .ant-tabs-nav .ant-tabs-tab {
            padding-left: 0px;
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
