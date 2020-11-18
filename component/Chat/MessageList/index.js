import React, { useEffect, useRef, useState } from 'react';
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
import { Col, Row, Tooltip } from 'antd';
import ScrollToBottom from 'react-scroll-to-bottom';

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
  // const listFileOrigin = fileList.map((file) => file.originFileObj);
  const formData = new FormData();
  // for (let file of listFileOrigin) {
  //   formData.append('files', file);
  // }

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

function MessageList({
  titleProps = {},
  messagesData,
  getMessages,
  conversationId,
  getNewMessage,
  resetData,
  signalR
}) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGING_INFO.page);
  const [newMessage, setNewMessage] = useState({});

  const scrollToBottom = () => {
    messagesEndRef.current &&
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  const currentConversationId = conversationId;

  useEffect(() => {
    return () => {
      resetData();
      signalR && signalR.stopConnection();
    };
  }, [resetData, signalR]);
  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);
      scrollToBottom();
    }
  }, [messagesData]);
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

  const sendMessage = async (message) => {
    if (signalR.isConnectionStarted()) {
      try {
        await onSendMessage(conversationId, message);
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
          <div style={{ height: `calc(100vh - 340px)` }}>
            {!!messages ? <RenderMessages messagesData={messages} /> : null}{' '}
          </div>
        </ScrollToBottom>
      </Col>
      <Col span={24} style={{ height: 52 }}>
        <Compose sendMessage={sendMessage} />
      </Col>
      <style jsx global>
        {`
          .message-list-chat {
            overflow-x: hidden;
            overflow-y: auto;
          }
          .message-list-chat:hover {
            overflow-y: auto;
          }
          .message-list-chat::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            background-color: #f5f5f5;
          }
          .message-list-chat::-webkit-scrollbar {
            width: 4px;
            background-color: #f5f5f5;
          }
          .message-list-chat::-webkit-scrollbar-thumb {
            background-color: #949494;
          }
        `}
      </style>
    </Row>
  );
}

export default connectToRedux(React.memo(MessageList));
