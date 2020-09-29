import React from 'react';

export default function Compose(props) {
  return (
    <div>
      <link
        rel="stylesheet"
        type="text/css"
        href="/static/assets/chat/Compose.css"
      />
      <div className="compose">
        <input
          type="text"
          className="compose-input"
          placeholder="Type a message, @name"
        />

        {
          props.rightItems
        }
      </div>
    </div>
  );
}