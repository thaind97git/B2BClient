import React from 'react';
import {
  Form,
  InputNumber,
  Button,
  Upload,
  Input,
  message as Message
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { getToken } from '../libs/localStorage';
import { useRouter } from 'next/router';
import { openNotification } from '../utils';
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
};

const submitNewBid = ({ reverseAuctionId, bid, description, fileAttach }) => {
  const formData = new FormData();
  formData.append('fileAttach', fileAttach?.originFileObj);
  formData.append('reverseAuctionId', reverseAuctionId);
  formData.append('bid', bid);
  formData.append('description', description);

  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${getToken()}`);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formData
  };

  return fetch(
    `${process.env.API_SERVER_URL}/api/ReverseAuctionHistory/PlaceBid`,
    requestOptions
  );
};

const SupplierSubmitNewBidComponent = ({
  setOpenSubmitBid,
  callbackSubmitBid
}) => {
  const [file, setFile] = useState(null);
  const router = useRouter();
  const { id: auctionId } = router.query;
  const handleChange = (info) => {
    let fileList = [...info.fileList];

    fileList = fileList.slice(-1);

    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    const isLt5M = fileList?.[0]?.originFileObj.size / 1024 / 1024 < 5;
    if (!!fileList?.[0] && !isLt5M) {
      Message.error('File must smaller than 5MB!');
      return;
    }
    setFile(fileList[0]);
  };
  const props = {
    action: false,
    headers: { 'content-type': 'multipart/form-data' },
    multiple: false,
    onChange: handleChange,
    name: 'file'
  };
  const onFinish = (values) => {
    submitNewBid({
      bid: values.price,
      description: values.description || '',
      reverseAuctionId: auctionId,
      fileAttach: values.upload?.file
    })
      .then(() => {
        openNotification('success', { message: 'Submit new bid successful' });
        setOpenSubmitBid(false);
        callbackSubmitBid();
      })
      .catch(() => {
        openNotification('error', { message: 'Submit new bid fail' });
      });
  };

  return (
    <Form name="validate_other" {...formItemLayout} onFinish={onFinish}>
      <Form.Item
        rules={[
          {
            required: true,
            message: 'Please enter the price'
          }
        ]}
        label="Price"
        name="price"
      >
        <InputNumber
          style={{ width: 146 }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value) => value.replace(/,*/g, '')}
        />
      </Form.Item>

      <Form.Item
        name="upload"
        label="Files Attach"
        extra={<small>Max size: 5MB</small>}
      >
        <Upload fileList={file ? [file] : []} {...props}>
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          span: 12,
          offset: 6
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SupplierSubmitNewBidComponent;
