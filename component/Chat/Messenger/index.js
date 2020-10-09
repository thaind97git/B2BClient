import React from 'react';
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';

export default function Messenger({props}) {
  return (
    <div>
      <link
        rel="stylesheet"
        type="text/css"
        href="/static/assets/chat/Messenger.css"
      />
      <div className="messenger">
        {/* <Toolbar
          title="Messenger"
          leftItems={[
            <ToolbarButton key="cog" icon="ion-ios-cog" />
          ]}
          rightItems={[
            <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
          ]}
        /> */}

        {/* <Toolbar
          title="Conversation Title"
          rightItems={[
            <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
            <ToolbarButton key="video" icon="ion-ios-videocam" />,
            <ToolbarButton key="phone" icon="ion-ios-call" />
          ]}
        /> */}

        <div className="scrollable sidebar">
          <ConversationList />
        </div>

        <div className="scrollable content">
          <MessageList props={{ title: props.title }}/>
        </div>
      </div>
    </div >
  );
}