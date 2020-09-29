import React from 'react';

export default function ToolbarButton(props) {
  const { icon } = props;
  return (
    <div>
      <link
        rel="stylesheet"
        type="text/css"
        href="/static/assets/chat/ToolbarButton.css"
      />
      <i className={`toolbar-button ${icon}`} />
    </div>
  );
}