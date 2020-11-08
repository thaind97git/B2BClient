import React from 'react';

export default function Toolbar(props) {
  const { title, leftItems, rightItems } = props;
  return (
    <div>
      <link
        rel="stylesheet"
        type="text/css"
        href="/static/assets/chat/Toolbar.css"
      />
      <div className="toolbar">
        <div className="left-items">{leftItems}</div>
        <h1 className="toolbar-title">{title}</h1>
        <div className="right-items">{rightItems}</div>
      </div>
    </div>
  );
}
