import React, { useEffect, useState } from 'react';
let BraftEditor = () => <p>Loading...</p>;
const MarkdownEditorComponent = ({
  setText,
  value = {},
  onChange,
  defaultValue
}) => {
  const [editorState, setEditorState] = useState('');
  useEffect(() => {
    //here window is available
    const initBraft = async () => {
      BraftEditor = (await import('braft-editor')).default;
      setEditorState(BraftEditor.createEditorState(defaultValue));
    };
    initBraft();
  }, []);
  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({
        ...value,
        ...changedValue
      });
    }
  };
  const onEditorChange = (value) => {
    triggerChange({
      value: value === '<p></p>' ? null : value
    });
  };
  return (
    <div style={{ border: '1px solid #eceaea' }} className="my-component">
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
          typeof setText === 'function' && setText(editorState.toHTML());
        }}
      />
    </div>
  );
};

export default React.memo(MarkdownEditorComponent);
