import React, { useEffect, useRef, useState } from "react";
import Compose from "../Compose";
import Toolbar from "../Toolbar";
import ToolbarButton from "../ToolbarButton";
import Message from "../Message";
import moment from "moment";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { getToken } from "../../../libs/localStorage";
const MY_USER_ID = "apple";

const API_SERVER_URL =
  process.env.API_SERVER_URL || "http://103.92.29.179:1234";

export default function MessageList({ props }) {
  const [messages, setMessages] = useState([]);
  const [connection, setConnection] = useState(null);
  const [chat, setChat] = useState([]);
  const latestChat = useRef(null);

  latestChat.current = chat;

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${API_SERVER_URL}/chatHub`, {
        accessTokenFactory: () => {
          return `${getToken()}`;
        },
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          console.log("Connected!");

          connection.on("ReceiveMessage", (message) => {
            const updatedChat = [...latestChat.current];
            updatedChat.push(message);

            setChat(updatedChat);
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  const sendMessage = async (user, message) => {
    const chatMessage = {
      user: user,
      message: message,
    };

    if (connection.connectionStarted) {
      try {
        await connection.send("SendMessage", chatMessage);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("No connection to server yet.");
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = () => {
    var tempMessages = [
      {
        id: 1,
        author: "apple",
        message:
          "Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.",
        timestamp: new Date().getTime(),
      },
      {
        id: 2,
        author: "orange",
        message:
          "It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!",
        timestamp: new Date().getTime(),
      },
      {
        id: 3,
        author: "orange",
        message:
          "Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.",
        timestamp: new Date().getTime(),
      },
      {
        id: 4,
        author: "apple",
        message:
          "It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!",
        timestamp: new Date().getTime(),
      },
      {
        id: 5,
        author: "apple",
        message:
          "Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.",
        timestamp: new Date().getTime(),
      },
      {
        id: 6,
        author: "apple",
        message:
          "It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!",
        timestamp: new Date().getTime(),
      },
      {
        id: 7,
        author: "orange",
        message:
          "Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.",
        timestamp: new Date().getTime(),
      },
      {
        id: 8,
        author: "orange",
        message:
          "It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!",
        timestamp: new Date().getTime(),
      },
      {
        id: 9,
        author: "apple",
        message:
          "Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.",
        timestamp: new Date().getTime(),
      },
      {
        id: 10,
        author: "orange",
        message:
          "It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!",
        timestamp: new Date().getTime(),
      },
    ];
    setMessages([...messages, ...tempMessages]);
  };

  const renderMessages = () => {
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === MY_USER_ID;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.author === current.author;

        if (prevBySameAuthor && previousDuration.as("hours") < 1) {
          startsSequence = false;
        }

        if (previousDuration.as("hours") < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as("hours") < 1) {
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

  return (
    <div>
      <link
        rel="stylesheet"
        type="text/css"
        href="/static/assets/chat/MessageList.css"
      />
      <div className="message-list">
        <Toolbar
          title={props.title}
          rightItems={[
            <ToolbarButton
              key="info"
              icon="ion-ios-information-circle-outline"
            />,
            <ToolbarButton key="video" icon="ion-ios-videocam" />,
            <ToolbarButton key="phone" icon="ion-ios-call" />,
          ]}
        />

        <div className="message-list-container">{renderMessages()}</div>

        <Compose
          sendMessage={sendMessage}
          // rightItems={[
          //   <ToolbarButton key="photo" icon="ion-ios-camera" />,
          //   <ToolbarButton key="image" icon="ion-ios-image" />,
          //   <ToolbarButton key="audio" icon="ion-ios-mic" />,
          //   <ToolbarButton key="money" icon="ion-ios-card" />,
          //   <ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
          //   <ToolbarButton key="emoji" icon="ion-ios-happy" />,
          // ]}
        />
      </div>
    </div>
  );
}
