import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Card,
  Select,
  Upload
} from 'antd';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import ImgCrop from 'antd-img-crop';
import MarkdownEditorComponent from './MarkdownEditorComponent';
import { acceptFileMimes, acceptFileTypes, openNotification } from '../utils';
import { CurrentUserData } from '../stores/UserState';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const FormItem = Form.Item;
const connectToRedux = connect(
  createStructuredSelector({
    currentUser: CurrentUserData
  })
);
const styles = {
  colStyle: { padding: '0 8px' },
  titleStyle: { fontWeight: 500 }
};
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const FeedbackCreateComponent = ({ currentUser }) => {
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: ''
  });
  let typeData = [];
  if (currentUser.role === 'Supplier') {
    typeData = [
      { id: 1, description: 'Order' },
      { id: 2, description: 'Auction' }
    ];
  }
  else if (currentUser.role==='Buyer'){
    typeData = [
      { id: 1, description: 'RFQ' }
    ];
  }
  const onFinish = (values) => {};

  const checkDescription = (rule, value = {}) => {
    if (value.value) {
      return Promise.resolve();
    }

    return Promise.reject('Please enter the product description !');
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onCancel = () => setPreview({ previewVisible: false });

  const onPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreview({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    });
  };

  return (
    <Row align="middle" justify="center">
      <Col sm={20} md={18}>
        <Form
          //{...formItemLayout}
          autoComplete="new-password"
          className="register-form"
          onFinish={onFinish}
        >
          <Row justify="center">
            <Title style={styles.titleStyle} level={2}>
              Create Feedback
            </Title>
          </Row>
          <Card
            bordered={false}
            title={<b>Feedback Information</b>}
            style={{
              width: '100%',
              boxShadow: '2px 2px 14px 0 rgba(0,0,0,.1)',
              marginTop: 16
            }}
          >
            <Row align="middle">
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  {...formItemLayout}
                  label="Title"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter The Feedback Title'
                    }
                  ]}
                >
                  <Input />
                </FormItem>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={4}></Col>
                  <Col span={8} style={{ padding: '0 8px' }}>
                    <label>
                      <span style={{ color: 'red' }}>* </span>
                      <span style={{ color: '#000000D9' }}>Service Type</span>
                    </label>
                    <FormItem
                      name="Type"
                      rules={[
                        {
                          required: true,
                          message: 'Please select type of service'
                        }
                      ]}
                    >
                      <Select
                        showSearch
                        style={{
                          width: '100%'
                        }}
                        placeholder="Select a type of service"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {!!typeData &&
                          typeData.map((type) => (
                            <Option
                              value={type.id}
                              index={type.id}
                              key={type.id}
                            >
                              {type.description}
                            </Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={8} style={{ padding: '0 8px' }}>
                    <label>
                      <span style={{ color: 'red' }}>* </span>
                      <span style={{ color: '#000000D9' }}>
                        Related Service
                      </span>
                    </label>
                    <FormItem
                      name="serviceID"
                      rules={[
                        {
                          required: true,
                          message: 'Please select service'
                        }
                      ]}
                    >
                      <Select
                        showSearch
                        style={{
                          width: '100%'
                        }}
                        placeholder="Select a related service"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {!!typeData &&
                          typeData.map((type) => (
                            <Option
                              value={type.id}
                              index={type.id}
                              key={type.id}
                            >
                              {type.description}
                            </Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row align="middle">
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  {...formItemLayout}
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      validator: checkDescription
                    }
                  ]}
                >
                  <MarkdownEditorComponent />
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  {...formItemLayout}
                  name="imageList"
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span> File Description
                    </span>
                  }
                >
                  <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="text"
                    fileList={fileList}
                    onChange={onChange}
                    //onPreview={onPreview}
                    /*beforeUpload={(file) => {
                        if (acceptFileMimes.includes(file.type)) {
                          return true;
                        }
                        openNotification('error', {
                          message: `We just accept file type for ${acceptFileTypes}`
                        });
                        return false;
                      }}*/
                  >
                    {fileList.length < 5 && (
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    )}
                  </Upload>
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Row justify="center" align="middle">
            <Col span={6}>
              <Button
                onClick={() => {}}
                block
                className="submit"
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default connectToRedux(FeedbackCreateComponent);
