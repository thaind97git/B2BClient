import React from 'react';
import moment from 'moment';

export default function Message(props) {
  const {
    data,
    isMine,
    startsSequence,
    endsSequence,
    showTimestamp
  } = props;

  const friendlyTimestamp = moment(data.timestamp).format('LLLL');
  return (
    <div>
      <link
        rel="stylesheet"
        type="text/css"
        href="/static/assets/chat/Message.css"
      />
      <div className={[
        'message',
        `${isMine ? 'mine' : ''}`,
        `${startsSequence ? 'start' : ''}`,
        `${endsSequence ? 'end' : ''}`
      ].join(' ')}>
        {
          showTimestamp &&
          <div className="timestamp">
            {friendlyTimestamp}
          </div>
        }

        <div className="bubble-container">
          <div className="bubble" title={friendlyTimestamp}>
            {data.message}
          </div>
        </div>
      </div>
    </div>
  );
}