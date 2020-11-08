import React from 'react';

export default function ConversationListItem(props) {
  const { photo, name, text } = props.data;

  return (
    <div>
      <link
        rel="stylesheet"
        type="text/css"
        href="/static/assets/chat/ConversationListItem.css"
      />
      <div className="conversation-list-item">
        <img className="conversation-photo" src={photo} alt="" />
        <div className="conversation-info" style={{ textAlign: 'left' }}>
          <h1 className="conversation-title">{name}</h1>
          <p
            className="conversation-snippet"
            style={{ color: 'rgba(153, 153, 153, 1)', fontSize: 11 }}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
