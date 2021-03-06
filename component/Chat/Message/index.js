import React, { Fragment } from 'react';
import { getFileMessage, getUtcTime } from '../../../utils';

export default function Message(props) {
  const { data, isMine, startsSequence, endsSequence, showTimestamp } = props;

  const friendlyTimestamp = getUtcTime(data.dateCreated, 'LLLL');
  return (
    (data.fileName || data.description) && (
      <div style={{ width: '100%' }}>
        <div
          className={[
            'message',
            `${isMine ? 'mine' : ''}`,
            `${startsSequence ? 'start' : ''}`,
            `${endsSequence ? 'end' : ''}`
          ].join(' ')}
        >
          {showTimestamp && (
            <div className="timestamp">{friendlyTimestamp}</div>
          )}

          <div className="bubble-container">
            <div className="bubble" title={friendlyTimestamp}>
              {data.fileName && (
                <Fragment>
                  <a
                    href={getFileMessage(data.id)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {data.fileName}
                  </a>
                  <br />
                </Fragment>
              )}
              {data.description && data.description}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
