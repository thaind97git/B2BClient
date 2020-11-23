import React from 'react';
import { AudioMutedOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getFromNowTime } from '../../../utils';

export default function ConversationListItem({ data, isIgnored }) {
  const { photo, name, text = '', lastMessageTime } = data;

  return (
    <div
      className="conversation-list-item"
      style={isIgnored ? { fontStyle: 'italic', opacity: 0.5 } : {}}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img className="conversation-photo" src={photo} alt="" />
        <div className="conversation-info" style={{ textAlign: 'left' }}>
          <h1 className="conversation-title">{name}</h1>
          <span>
            <p className="conversation-snippet">
              {!!text && text.trim() ? text : 'N/A'}{' '}
              <span>&nbsp;&nbsp;&nbsp;</span>
              {lastMessageTime && getFromNowTime(lastMessageTime)}
            </p>
          </span>
        </div>
      </div>
      {isIgnored && (
        <div className="mute">
          <AudioMutedOutlined />
        </div>
      )}
    </div>
  );
}
