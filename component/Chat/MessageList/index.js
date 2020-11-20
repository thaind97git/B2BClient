import React, { useEffect, useState } from 'react';
import Compose from '../Compose';
import Message from '../Message';
import moment from 'moment';
import { getToken } from '../../../libs/localStorage';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getMessages,
  GetMessagesData,
  GetMessagesResetter
} from '../../../stores/ConversationState';
import { DEFAULT_PAGING_INFO, getShortContent } from '../../../utils';
import { Col, Row, Skeleton, Spin, Tooltip } from 'antd';
import ScrollToBottom, { useAtTop } from 'react-scroll-to-bottom';
import { LoadingOutlined } from '@ant-design/icons';

const connectToRedux = connect(
  createStructuredSelector({
    messagesData: GetMessagesData
  }),
  (dispatch) => ({
    getMessages: ({ conversationId, pageIndex, pageSize }) =>
      dispatch(getMessages({ conversationId, pageIndex, pageSize })),
    resetData: () => dispatch(GetMessagesResetter)
  })
);

const onSendMessage = (conversationId, description, file) => {
  const formData = new FormData();
  if (file) {
    formData.append('File', file.originFileObj);
  }
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${getToken()}`);
  formData.append('ConversationId', conversationId);
  formData.append('Description', description);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formData
  };

  fetch(`${process.env.API_SERVER_URL}/api/Message/`, requestOptions);
};

const RenderMessages = React.memo(({ messagesData }) => {
  if (!messagesData) {
    return;
  }
  let i = 0;
  let messageCount = messagesData.length;
  let tempMessages = [];

  while (i < messageCount) {
    let previous = messagesData[i - 1];
    let current = messagesData[i];
    let next = messagesData[i + 1];

    let isMine = current.yourMessage;
    let currentMoment = moment(current.dateCreated);
    let prevBySameAuthor = false;
    let nextBySameAuthor = false;
    let startsSequence = true;
    let endsSequence = true;
    let showTimestamp = true;

    if (previous) {
      let previousMoment = moment(previous.dateCreated);
      let previousDuration = moment.duration(
        currentMoment.diff(previousMoment)
      );
      prevBySameAuthor = previous.yourMessage === current.yourMessage; // previous.author === current.author;
      if (prevBySameAuthor && previousDuration.as('hours') < 1) {
        startsSequence = false;
      }

      if (previousDuration.as('hours') < 1) {
        showTimestamp = false;
      }
    }

    if (next) {
      let nextMoment = moment(next.dateCreated);
      let nextDuration = moment.duration(nextMoment.diff(currentMoment));
      nextBySameAuthor = next.yourMessage === current.yourMessage;

      if (nextBySameAuthor && nextDuration.as('hours') < 1) {
        endsSequence = false;
      }
    }

    tempMessages.push(
      <Message
        key={i}
        isMine={isMine}
        startsSequence={startsSequence}
        endsSequence={endsSequence}
        showTimestamp={showTimestamp}
        data={current}
      />
    );
    // Proceed to the next message.
    i += 1;
  }
  // scrollToBottom();
  return tempMessages;
});

const MessagesList = ({
  messages,
  setPageIndex,
  firstTime,
  isAllMessage,
  setLoading
}) => {
  const [atTop] = useAtTop();

  useEffect(() => {
    if (atTop && !firstTime && !isAllMessage) {
      setLoading(true);
      setPageIndex((prev) => prev + 1);
    }
  }, [atTop, setPageIndex, isAllMessage]);
  return (
    <div
      id="message-list-chat"
      style={{ height: `calc(100vh - 340px)`, padding: '0 12px' }}
    >
      {!!messages ? <RenderMessages messagesData={messages} /> : null}{' '}
    </div>
  );
};
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function MessageList({
  titleProps = {},
  messagesData,
  getMessages,
  conversationId,
  getNewMessage,
  resetData,
  signalR,
  isDone = false
}) {
  const [messages, setMessages] = useState([]);
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGING_INFO.page);
  const [newMessage, setNewMessage] = useState({});
  const [firstTime, setFirstTime] = useState(true);
  const currentConversationId = conversationId;
  const [isAllMessage, setIsAllMessage] = useState(false);
  const [totalCount, setTotalCount] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    return () => {
      setMessages([]);
      setPageIndex(1);
      resetData();
      setIsAllMessage(false);
      setTotalCount(null);
    };
  }, [resetData, signalR]);
  useEffect(() => {
    const { data, total } = messagesData || {};
    if (data && data.length > 0) {
      if ((data[0] || {}).conversationId !== conversationId) {
        return;
      }
      setLoading(false);
      setTotalCount(total);
      const mesTmp = [...messages];
      mesTmp.unshift(...data);
      setMessages(mesTmp);
    }
  }, [messagesData, conversationId]);
  useEffect(() => {
    if (signalR) {
      signalR.onListen('ReceiveMessage', (message) => {
        !!message &&
          typeof getNewMessage === 'function' &&
          getNewMessage(message);

        currentConversationId === message.conversationId &&
          setNewMessage(message);
      });
    }
  }, [currentConversationId, messages, getNewMessage, signalR]);

  useEffect(() => {
    if (!!newMessage) {
      const isExisted = messages.find((mes) => mes.id === newMessage.id);
      if (isExisted) {
        return;
      }
      if (currentConversationId === newMessage.conversationId) {
        const messagesCopy = [...messages];
        messagesCopy.push(newMessage);
        setNewMessage(null);
        setMessages(messagesCopy);
      }
    }
  }, [newMessage, messages, currentConversationId]);

  useEffect(() => {
    if (totalCount === 0) {
      setIsAllMessage(true);
    } else if ((messages || []).length === totalCount && !firstTime) {
      setIsAllMessage(true);
    }
  }, [messages, totalCount, firstTime]);

  const sendMessage = async (message, file) => {
    if (signalR.isConnectionStarted()) {
      try {
        await onSendMessage(conversationId, message, file);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert('No connection to server yet.');
    }
  };

  useEffect(() => {
    if (conversationId) {
      getMessages({ conversationId, pageIndex });
      setFirstTime(false);
    }
  }, [getMessages, conversationId, pageIndex]);

  const { title, leftTitle, rightTitle } = titleProps;

  return (
    <Row style={{ height: '98%' }}>
      <Col span={24} style={{ height: 42, zIndex: 1 }}>
        <div className="toolbar ">
          <div className="left-items">
            <Tooltip title={leftTitle}>{getShortContent(leftTitle)}</Tooltip>
          </div>
          <h1 className="toolbar-title">{title}</h1>
          <div className="right-items">{rightTitle}</div>
        </div>
      </Col>
      <Col
        style={{
          padding: 10,
          height: 'calc(100% - 94px)'
        }}
        span={24}
      >
        <ScrollToBottom>
          {loading && (
            <Row justify="center">
              <Spin indicator={antIcon} />
            </Row>
          )}
          <MessagesList
            setLoading={setLoading}
            isAllMessage={isAllMessage}
            messages={messages}
            setPageIndex={setPageIndex}
            firstTime={firstTime}
          />
        </ScrollToBottom>
      </Col>
      <Col span={24} style={{ height: 52 }}>
        {!isDone ? (
          <Compose sendMessage={sendMessage} />
        ) : (
          <Row
            style={{ cursor: 'not-allowed' }}
            justify="center"
            align="middle"
          >
            <i style={{ opacity: 0.7 }}>
              The conversation in this group has been closed...
            </i>
          </Row>
        )}
      </Col>
    </Row>
  );
}

export default connectToRedux(React.memo(MessageList));
