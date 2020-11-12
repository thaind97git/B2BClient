import React, { Fragment, useState } from 'react';
import { doFunctionWithEnter } from '../../../utils';
export default function Compose({ sendMessage }) {
  const [message, setMessage] = useState('');
  return (
    <Fragment>
      <div className="compose">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          type="text"
          className="compose-input"
          placeholder="Type a message"
          onKeyPress={(event) =>
            doFunctionWithEnter(event, () => {
              !!message && sendMessage(message);
              setMessage('');
            })
          }
        />
      </div>
    </Fragment>
  );
}
