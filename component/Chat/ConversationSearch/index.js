import React from 'react';

export default function ConversationSearch() {
    return (
      <div className="conversation-search">
        <link
            rel="stylesheet"
            type="text/css"
            href="/static/assets/chat/ConversationSearch.css"
          />
        <input
          type="search"
          className="conversation-search-input"
          placeholder="Search Messages"
        />
      </div>
    );
}