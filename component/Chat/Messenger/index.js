import React from 'react';
import ConversationList from '../ConversationList';

export default function Messenger({}) {
  return (
    <div style={{ height: '100%' }}>
      <div className="messenger">
        <div className="scrollable sidebar">
          <ConversationList />
        </div>
      </div>
    </div>
  );
}
