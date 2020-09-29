import React, { useState } from "react";
import dynamic from "next/dynamic";
const BraftEditor = dynamic(() => import("braft-editor"), { ssr: false });

const MarkdownEditorComponent = ({ value, setValue }) => {
  const [editorState, setEditorState] = useState(value);

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
          setEditorState(editorState);
          setValue(editorState.toHTML());
        }}
      />
    </div>
  );
};

export default React.memo(MarkdownEditorComponent);
