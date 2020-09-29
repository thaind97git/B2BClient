import React, { useState, useEffect } from 'react';
import ConversationSearch from '../ConversationSearch';
import ConversationListItem from '../ConversationListItem';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import axios from 'axios';


export default function ConversationList(props) {
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    getConversations()
  }, [])

  const getConversations = () => {
    axios.get('https://randomuser.me/api/?results=20').then(response => {
      let newConversations = response.data.results.map(result => {
        return {
          photo: result.picture.large,
          name: `${result.name.first} ${result.name.last}`,
          text: 'Hello world! This is a long message that needs to be truncated.'
        };
      });
      setConversations([...conversations, ...newConversations])
    });
  }

  return (
    <div>
      <link
        rel="stylesheet"
        type="text/css"
        href="/static/assets/chat/Conversation.css"
      />
      <div className="conversation-list">
        <Toolbar
          title="Messenger"
          leftItems={[
            <ToolbarButton key="cog" icon="ion-ios-cog" />
          ]}
          rightItems={[
            <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
          ]}
        />
        <ConversationSearch />
        {
          conversations.map(conversation =>
            <ConversationListItem
              key={conversation.name}
              data={conversation}
            />
          )
        }
      </div>
    </div>
  );
}