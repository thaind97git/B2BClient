import React, { useEffect } from 'react';
import shave from 'shave';

export default function ConversationListItem(props) {
  useEffect(() => {
    shave('.conversation-snippet', 20);
  })

  const { photo, name, text } = props.data;

  return (
    <div>
      <link
        rel="stylesheet"
        type="text/css"
        href="/static/assets/chat/ConversationListItem.css"
      />
      <div className="conversation-list-item">
        <img className="conversation-photo" src={photo} alt="conversation" />
        <div className="conversation-info">
          <h1 className="conversation-title">{name}</h1>
          <p className="conversation-snippet">{text}</p>
        </div>
      </div>
    </div>
  );
}