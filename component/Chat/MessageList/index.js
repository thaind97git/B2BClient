import React, { useEffect, useRef, useState } from 'react';
import Compose from '../Compose';
import Message from '../Message';
import moment from 'moment';
import { getToken } from '../../../libs/localStorage';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getMessages,
  GetMessagesData
} from '../../../stores/ConversationState';
import { DEFAULT_PAGING_INFO } from '../../../utils';
import useHub from '../../HOOK/useHub';
import { Col, Row } from 'antd';

const connectToRedux = connect(
  createStructuredSelector({
    messagesData: GetMessagesData
  }),
  (dispatch) => ({
    getMessages: ({ conversationId, pageIndex, pageSize }) =>
      dispatch(getMessages({ conversationId, pageIndex, pageSize }))
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

function MessageList({
  titleProps = {},
  messagesData,
  getMessages,
  conversationId
}) {
  const [messages, setMessages] = useState([]);
  const { connection } = useHub();
  const messagesEndRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGING_INFO.page);
  const [newMessage, setNewMessage] = useState({});

  const scrollToBottom = () => {
    // messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);
      scrollToBottom();
    }
  }, [messagesData]);
  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log('Connected!');
          connection.on('ReceiveMessage', (message) => {
            console.log({ message });
            scrollToBottom();
            setNewMessage(message);
          });
        })
        .catch((e) => console.log('Connection failed: ', e));
    }
  }, [connection]);

  useEffect(() => {
    if (!!newMessage) {
      const messagesCopy = [...messages];
      messagesCopy.push(newMessage);
      setMessages(messagesCopy);
      setNewMessage(null);
    }
  }, [newMessage]);

  const sendMessage = async (message) => {
    if (connection.connectionStarted) {
      try {
        // await connection.send('SendMessage', chatMessage);
        await onSendMessage(conversationId, message);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert('No connection to server yet.');
    }
  };

  useEffect(() => {
    getMessages({ conversationId, pageIndex });
  }, [getMessages, conversationId, pageIndex]);

  const renderMessages = (messagesData) => {
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

    return tempMessages;
  };

  const { title, leftTitle, rightTitle } = titleProps;

  return (
    <Row style={{ height: '100%' }}>
      <Col span={24} style={{ height: 42 }}>
        <div className="toolbar">
          <div className="left-items">{leftTitle}</div>
          <h1 className="toolbar-title">{title}</h1>
          <div className="right-items">{rightTitle}</div>
        </div>
      </Col>
      <Col
        span={24}
        style={{
          overflowY: 'scroll',
          padding: 10,
          height: 'calc(100% - 94px)'
        }}
      >
        {!!messages ? renderMessages(messages) : null}{' '}
        <div ref={messagesEndRef} />
      </Col>
      <Col span={24} style={{ height: 52 }}>
        <Compose sendMessage={sendMessage} />
      </Col>
    </Row>
  );
}

export default connectToRedux(React.memo(MessageList));
