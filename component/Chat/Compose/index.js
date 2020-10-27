import React, { Fragment, useState } from "react";
import { doFunctionWithEnter } from "../../../utils";
export default function Compose({ sendMessage }) {
  const [message, setMessage] = useState("");
  return (
    <Fragment>
      <link
        rel="stylesheet"
        type="text/css"
        href="/static/assets/chat/Compose.css"
      />
      <div className="compose">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          type="text"
          className="compose-input"
          placeholder="Type a message, @name"
          onKeyPress={(event) =>
            doFunctionWithEnter(event, () => {
              console.log({ message });
              !!message && sendMessage(message);
            })
          }
        />

        {/* {props.rightItems} */}
      </div>
    </Fragment>
  );
}
