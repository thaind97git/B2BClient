import React, { useState } from "react";
import dynamic from "next/dynamic";
const BraftEditor = dynamic(() => import("braft-editor"), { ssr: false });

const MarkdownEditorComponent = ({ setText, value = {}, onChange }) => {
  const [editorState, setEditorState] = useState(value);
  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({
        ...value,
        ...changedValue,
      });
    }
  };
  const onEditorChange = (value) => {
    triggerChange({
      value: value === "<p></p>" ? null : value,
    });
  };
  return (
    <div style={{ border: "1px solid #eceaea" }} className="my-component">
      <link
        rel="stylesheet"
        type="text/css"
        href="/static/assets/braft-editor.css"
      />
      <BraftEditor
        language="en"
        value={editorState}
        onChange={(editorState) => {
          onEditorChange(editorState.toHTML());
          setEditorState(editorState);
          typeof setText === "function" && setText(editorState.toHTML());
        }}
      />
    </div>
  );
};

export default React.memo(MarkdownEditorComponent);
