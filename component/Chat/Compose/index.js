import React, { useEffect, useState } from 'react';
import { Button, Input, Upload, message as Message } from 'antd';
import { SendOutlined, PaperClipOutlined } from '@ant-design/icons';
const { Search } = Input;
function Compose({ sendMessage }) {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const handleChange = (info) => {
    let fileList = [...info.fileList];

    fileList = fileList.slice(-1);

    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    setFile(fileList[0]);
  };
  const props = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    multiple: true,
    onChange: handleChange
  };
  return (
    <div className="compose">
      <Search
        onChange={(event) => setMessage(event.target.value)}
        className="compose-input"
        placeholder="Type a message"
        value={message}
        onSearch={() => {
          (!!message || !!file) && sendMessage(message, file);
          setMessage('');
          setFile(null);
        }}
        suffix={
          <Upload
            fileList={file ? [file] : []}
            {...props}
            className="upload-list-inline"
          >
            <Button>
              <PaperClipOutlined />
            </Button>
          </Upload>
        }
        enterButton={<SendOutlined />}
      />

      <style global jsx>{`
        .compose .ant-upload-list {
          position: absolute;
          left: 0;
          top: -40px;
          background: white;
          display: flex;
        }
        .compose .ant-input-group {
          border: none;
          overflow: auto;
        }
        .compose .ant-input-affix-wrapper {
          background-color: transparent;
          border: none;
        }
        .compose .ant-input-affix-wrapper > input.ant-input {
          padding: 0px 8px;
          background: transparent;
        }
        .compose ant-input-wrapper {
          overflow: auto;
        }
      `}</style>
    </div>
  );
}

export default Compose;
