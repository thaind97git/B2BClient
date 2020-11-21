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
import MarkdownEditorComponent from './MarkdownEditorComponent';
//import { acceptFileMimes, acceptFileTypes, openNotification } from '../utils';
import { CurrentUserData } from '../stores/UserState';
import { R_DONE, R_ORDERED } from '../enums/requestStatus';
import {
  GetRequestPagingData,
  // GetRequestPagingError,
  getRequestPaging
} from '../stores/RequestState';
import {
  auctionFilter,
  AuctionFilterData
  //AuctionFilterError
} from '../stores/AuctionState';
import {
  getOrderPaging,
  GetOrderPagingData
  //AuctionFilterError
} from '../stores/OrderState';
import {
  createFeedback,
  CreateFeedbackData
  //AuctionFilterError
} from '../stores/FeedbackState';
import { UploadOutlined } from '@ant-design/icons';
import { get } from 'lodash';
import Router from 'next/router';

const { Title } = Typography;
const { Option } = Select;
const FormItem = Form.Item;
const connectToRedux = connect(
  createStructuredSelector({
    currentUser: CurrentUserData,
    requestPagingData: GetRequestPagingData,
    auctionData: AuctionFilterData,
    orderPagingData: GetOrderPagingData,
    createFeedbackData: CreateFeedbackData
    // requestPagingError: GetRequestPagingError
  }),
  (dispatch) => ({
    getRequest: () => {
      dispatch(
        getRequestPaging({
          pageSize: 99999,
          pageIndex: 1,
          fromDate: null,
          toDate: null,
          productTitle: null,
          status: [R_DONE, R_ORDERED]
        })
      );
    },
    auctionFilter: () =>
      dispatch(
        auctionFilter({
          pageIndex: 1,
          pageSize: 99999,
          name: null,
          fromDate: null,
          toDate: null,
          status: [1, 2, 3, 4, 5, 6],
          categoryId: null
        })
      ),
    getOrder: () =>
      dispatch(
        getOrderPaging({
          pageIndex: 1,
          pageSize: 99999,
          groupName: null,
          fromDate: null,
          toDate: null,
          status: null
        })
      ),
    createFeedback: (object, fileList) =>
      dispatch(createFeedback(object, fileList))
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
// function getBase64(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });
// }

const FeedbackCreateComponent = ({
  currentUser,
  getRequest,
  requestPagingData,
  auctionFilter,
  auctionData,
  getOrder,
  orderPagingData,
  createFeedback,
  createFeedbackData
}) => {
  const [fileList, setFileList] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [form] = Form.useForm();
  const [disableService, setDisableService] = useState(false);
  //const [preview, setPreview] = useState({
  //   previewVisible: false,
  //   previewImage: '',
  //   previewTitle: ''
  // });
  let typeData = [];
  if (currentUser.role === 'Supplier') {
    typeData = [
      { id: 1, description: 'Order' },
      { id: 2, description: 'Auction' },
      { id: 4, description: 'System' }
    ];
  } else if (currentUser.role === 'Buyer') {
    typeData = [
      { id: 3, description: 'Order' },
      { id: 4, description: 'System' }
    ];
  }
  const onFinish = (values) => {
    let feedback = {
      title: values.title,
      description: values.description.value
    };
    switch (values.typeID) {
      case 1:
        feedback = { ...feedback, orderId: values.serviceID };
        break;
      case 2:
        feedback = { ...feedback, reverseAuctionId: values.serviceID };
        break;
      case 3:
        feedback = { ...feedback, requestId: values.serviceID };
        break;
      default:
        break;
    }
    createFeedback(feedback, fileList);
  };

  const checkDescription = (rule, value = {}) => {
    if (value.value) {
      return Promise.resolve();
    }

    return Promise.reject('Please enter the product description !');
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  useEffect(() => {
    if (requestPagingData) {
      setServiceData(requestPagingData.data);
      console.log(requestPagingData.data);
    }
  }, [requestPagingData]);

  useEffect(() => {
    if (auctionData) {
      setServiceData(auctionData.data);
      console.log(auctionData.data);
    }
  }, [auctionData]);

  useEffect(() => {
    if (orderPagingData) {
      setServiceData(orderPagingData.data);
      console.log(orderPagingData.data);
    }
  }, [orderPagingData]);

  useEffect(() => {
    if (createFeedbackData) {
      Router.push(`/${currentUser.role.toLowerCase()}/feedback`);
    }
  }, [createFeedbackData]);

  //const getRFQList

  //const onCancel = () => setPreview({ previewVisible: false });

  // const onPreview = async (file) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   setPreview({
  //     previewImage: file.url || file.preview,
  //     previewVisible: true,
  //     previewTitle:
  //       file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
  //   });
  // };

  return (
    <Row align="middle" justify="center">
      <Col sm={20} md={18}>
        <Form
          //{...formItemLayout}
          autoComplete="new-password"
          className="register-form"
          onFinish={onFinish}
          form={form}
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
            <Row align="middle" justify="center">
              <Col style={styles.colStyle} span={16}>
                <div style={{ padding: '4px 0px' }}>
                  <span style={{ color: 'red' }}>* </span>
                  <span style={{ color: '#000000D9' }}>Title</span>
                </div>
                <FormItem
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
                    <div style={{ padding: '4px 0px' }}>
                      <span style={{ color: 'red' }}>* </span>
                      <span style={{ color: '#000000D9' }}>
                        Feedback subject
                      </span>
                    </div>
                    <FormItem
                      name="typeID"
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
                          option.children.innerHTML
                            .toString()
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(value) => {
                          switch (value) {
                            case 1:
                              setDisableService(false);
                              getOrder();
                              form.resetFields(['serviceID']);
                              break;
                            case 2:
                              setDisableService(false);
                              auctionFilter();
                              form.resetFields(['serviceID']);
                              break;
                            case 3:
                              setDisableService(false);
                              getRequest();
                              form.resetFields(['serviceID']);
                              break;
                            case 4:
                              form.resetFields(['serviceID']);
                              setServiceData([{ id: 1, description: '' }]);
                              form.setFieldsValue({ serviceID: 1 });
                              setDisableService(true);
                              break;
                            default:
                              break;
                          }
                        }}
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
                    <div style={{ padding: '4px 0px' }}>
                      <span style={{ color: 'red' }}>* </span>
                      <span style={{ color: '#000000D9' }}>
                        Related Service
                      </span>
                    </div>
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
                        disabled={disableService}
                      >
                        {!!serviceData &&
                          serviceData.map((service) => (
                            <Option
                              value={service.id}
                              index={service.id}
                              key={service.id}
                            >
                              {form.getFieldValue('typeID') === 3
                                ? service.quantity +
                                  ' ' +
                                  service.product.unitType +
                                  ' of ' +
                                  service.product.description
                                : form.getFieldValue('typeID') === 2
                                ? service.auctionName
                                : form.getFieldValue('typeID') === 1
                                ? service.groupName
                                : service.description}
                            </Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row align="middle" justify="center">
              <Col style={styles.colStyle} span={16}>
                <div style={{ padding: '4px 0px' }}>
                  <span style={{ color: 'red' }}>* </span>
                  <span style={{ color: '#000000D9' }}>Description</span>
                </div>
                <FormItem
                  // {...formItemLayout}
                  // label="Description"
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
                  name="fileList"
                  label="Attachments"
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
          <Row justify="center" align="middle" style={{ marginTop: 12 }}>
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
