import { connect } from 'react-redux';
import {
  Button,
  Card,
  Row,
  Space,
  Typography,
  Col,
  Comment,
  Tooltip,
  Input,
  Form,
  List,
  Skeleton,
  Upload,
  Divider,
  Rate,
  Popover,
  Tag
} from 'antd';
import { LeftOutlined, WarningOutlined } from '@ant-design/icons';
import moment from 'moment';
import Router, { useRouter } from 'next/router';
import React, { Fragment, useState, useEffect } from 'react';
import { F_CLOSED, F_OPEN } from '../enums/feedbackStatus';
import {
  DATE_TIME_FORMAT,
  getCurrentUserImage,
  getFeedbackFileURL,
  getFromNowTime,
  getUtcTime
} from '../utils';
import { CurrentUserData } from '../stores/UserState';
import { createStructuredSelector } from 'reselect';
import {
  getFeedbackDetails,
  GetFeedbackDetailsData,
  GetFeedbackDetailsResetter,
  createFeedbackReply,
  CreateFeedbackReplyData,
  CreateFeedbackReplyResetter,
  updateFeedbackRate,
  UpdateFeedbackRateData,
  UpdateFeedbackRateResetter,
  GetFeedbackFileData,
  getFeedbackFile
} from '../stores/FeedbackState';
import Moment from 'react-moment';
import FeedbackTypeComponent from './Utils/FeedbackTypeComponent';

const { TextArea } = Input;
const { Title } = Typography;
const FormItem = Form.Item;
const connectToRedux = connect(
  createStructuredSelector({
    feedbackDetailsData: GetFeedbackDetailsData,
    createFeedbackReplyData: CreateFeedbackReplyData,
    updateFeedbackRateData: UpdateFeedbackRateData,
    currentUser: CurrentUserData,
    feedbackFileData: GetFeedbackFileData
  }),
  (dispatch) => ({
    getFeedbackDetails: (feedbackId) => {
      dispatch(getFeedbackDetails(feedbackId));
    },
    replyFeedback: (object) => {
      dispatch(createFeedbackReply(object));
    },
    rateFeedback: ({ feedbackReplyId, isHappy }) => {
      dispatch(updateFeedbackRate({ feedbackReplyId, isHappy }));
    },
    getFeedbackFile: (fileId) => {
      dispatch(getFeedbackFile(fileId));
    },
    resetData: () => dispatch(GetFeedbackDetailsResetter),
    resetCreateFeedbackReply: () => dispatch(CreateFeedbackReplyResetter),
    resetUpdateFeedbackRate: () => dispatch(UpdateFeedbackRateResetter)
  })
);

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
  />
);
const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <Form
    autoComplete="new-password"
    className="register-form"
    onFinish={onSubmit}
  >
    <Form.Item
      name="reply"
      rules={[
        {
          required: true,
          message: 'Please Enter Your Reply'
        }
      ]}
    >
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} type="primary">
        Reply
      </Button>
    </Form.Item>
  </Form>
);

const FeedBackCard = ({ children, title }) => {
  return (
    <Card
    // style={{ backgroundColor: '#199EB8', color: '#FFFFFF' }}
    // bordered={false}
    >
      <div style={{ fontSize: '14px' }}>{title}</div>
      <br />
      <div style={{ fontSize: '17px', fontWeight: 'bold' }}>{children}</div>
    </Card>
  );
};

const Happy = ({ isHappy }) => (
  <img
    alt=""
    src="/static/images/vote-up.png"
    value={true}
    height={20}
    style={isHappy === true ? { opacity: '1' } : { opacity: '0.3' }}
  />
);

const Unhappy = ({ isHappy }) => (
  <img
    alt=""
    src="/static/images/vote-down.png"
    height={20}
    style={isHappy === false ? { opacity: '1' } : { opacity: '0.3' }}
  />
);

const displayServiceName = (serviceName) =>
  serviceName
    ? serviceName.length > 38
      ? serviceName.slice(0, 38) + ' ...'
      : serviceName
    : '';

const UserFeedbackDetailComponent = ({
  currentUser,
  getFeedbackDetails,
  feedbackDetailsData,
  resetData,
  replyFeedback,
  createFeedbackReplyData,
  resetCreateFeedbackReply,
  rateFeedback,
  updateFeedbackRateData,
  resetUpdateFeedbackRate,
  getFeedbackFile,
  feedbackFileData
}) => {
  const router = useRouter();
  const feedbackId = router.query.id;
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const [isReply, setIsReply] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isFeedbackSystem, setIsFeedbackSystem] = useState(true);
  const [serviceName, setServiceName] = useState('');

  const rate = (feedbackItem, isHappy) => {
    rateFeedback({
      feedbackReplyId: (feedbackItem || {}).id,
      isHappy: isHappy
    });
  };

  const handleSubmit = () => {
    replyFeedback({
      description: value,
      feedbackId: feedbackDetailsData.id
    });
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    if (!!feedbackId) getFeedbackDetails(feedbackId);
  }, [feedbackId, getFeedbackDetails]);

  useEffect(() => {
    if (createFeedbackReplyData) {
      getFeedbackDetails(feedbackId);
      resetCreateFeedbackReply();
    }
  }, [createFeedbackReplyData]);

  useEffect(() => {
    if (updateFeedbackRateData) {
      getFeedbackDetails(feedbackId);
      resetUpdateFeedbackRate();
    }
  }, [updateFeedbackRateData]);

  useEffect(() => {
    setFileList([]);
    setComments([]);
    if (feedbackDetailsData) {
      if (feedbackDetailsData.reverseAuction) {
        setServiceName((feedbackDetailsData.reverseAuction || {}).description);
        setIsFeedbackSystem(false);
      } else if (feedbackDetailsData.order) {
        setServiceName((feedbackDetailsData.order || {}).description);
        setIsFeedbackSystem(false);
      } else if (feedbackDetailsData.request) {
        setServiceName((feedbackDetailsData.request || {}).description);
        setIsFeedbackSystem(false);
      }
      if (feedbackDetailsData.feedbackReplies) {
        for (let i = 0; i < feedbackDetailsData.feedbackReplies.length; i++) {
          const feedbackItem = feedbackDetailsData.feedbackReplies[i];
          const { user = {} } = feedbackItem;
          setComments((comments) => [
            ...comments,
            {
              author: user.firstName + ' ' + user.lastName,
              avatar: user.avatar
                ? getCurrentUserImage(user.id)
                : '/static/images/avatar.png',
              content: (
                <div>
                  <Card>{feedbackItem.description}</Card>
                </div>
              ),
              datetime: getFromNowTime(feedbackItem.dateCreated),
              actions: [
                !feedbackItem.isUser ? (
                  <Tooltip key="comment-basic-like" title="Happy">
                    <span
                      onClick={() => {
                        rate(feedbackItem, true);
                      }}
                    >
                      <Happy isHappy={feedbackItem.isHappy} />
                    </span>
                  </Tooltip>
                ) : (
                  ''
                ),
                !feedbackItem.isUser ? (
                  <Tooltip key="comment-basic-dislike" title="Not Happy">
                    <span
                      onClick={() => {
                        rate(feedbackItem, false);
                      }}
                    >
                      <Unhappy isHappy={feedbackItem.isHappy} />
                    </span>
                  </Tooltip>
                ) : (
                  ''
                )
              ]
            }
          ]);
        }
      }
      if (feedbackDetailsData.files) {
        for (let i = 0; i < feedbackDetailsData.files.length; i++) {
          const feedbackFileItem = feedbackDetailsData.files[i];
          getFeedbackFile(feedbackFileItem.id);
          setFileList((fileList) => [
            ...fileList,
            {
              uid: i,
              name: feedbackFileItem.description,
              status: 'done',
              url: getFeedbackFileURL(feedbackFileItem.id)
            }
          ]);
        }
      }
      if (feedbackDetailsData.feedbackStatus.id === F_CLOSED) {
        setIsReply(true);
      } else if (feedbackDetailsData.feedbackStatus.id === F_OPEN) {
        setIsReply(false);
      }
    }
  }, [feedbackDetailsData]);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  if (!feedbackDetailsData) {
    return <Skeleton active />;
  }
  const {
    title,
    order,
    request,
    reverseAuction,
    dateCreated,
    feedbackStatus = {},
    user = {},
    description
  } = feedbackDetailsData || {};
  console.log({ format: getFromNowTime(dateCreated), dateCreated });
  return (
    <Fragment>
      <Row style={{ paddingBottom: 24 }} justify="space-between" align="middle">
        <Button
          type="link"
          onClick={() => {
            if (currentUser.role === 'Supplier') {
              Router.push(`/supplier/feedback`);
            } else if (currentUser.role === 'Buyer') {
              Router.push(`/buyer/feedback`);
            }
          }}
        >
          <LeftOutlined /> Back to feedback list
        </Button>
      </Row>

      <Space direction="vertical" style={{ width: '100%' }}>
        <Row span={24} gutter={16} justify="space-between">
          <Col span={isFeedbackSystem ? 8 : 6}>
            <FeedBackCard title="Type">
              <FeedbackTypeComponent feedback={feedbackDetailsData} />
            </FeedBackCard>
          </Col>
          <Col span={isFeedbackSystem ? 8 : 6}>
            <FeedBackCard title="Date Created">
              <Moment format={DATE_TIME_FORMAT}>
                {getUtcTime(dateCreated)}
              </Moment>
            </FeedBackCard>
          </Col>
          <Col span={isFeedbackSystem ? 8 : 6}>
            <FeedBackCard title="Status">
              {feedbackStatus.id === F_CLOSED ? (
                <Tag style={{ fontSize: 16, padding: '4px 12px' }} color="#f50">
                  {feedbackStatus.description}
                </Tag>
              ) : (
                <Tag
                  style={{ fontSize: 16, padding: '4px 12px' }}
                  color="#108ee9"
                >
                  {feedbackStatus.description}
                </Tag>
              )}
            </FeedBackCard>
          </Col>
          {!isFeedbackSystem ? (
            <Col span={6}>
              <FeedBackCard title="Service Name">
                <Popover content={serviceName}>
                  <div style={{ fontSize: '17px', fontWeight: 'bold' }}>
                    {displayServiceName(serviceName)}
                  </div>
                </Popover>
              </FeedBackCard>
            </Col>
          ) : (
            ''
          )}
        </Row>
        {feedbackStatus.id === F_CLOSED ? (
          <Card
            bodyStyle={{
              color: 'rgb(184 165 109)',
              borderColor: '#fac839',
              borderStyle: 'dashed',
              backgroundColor: '#fcebbb'
            }}
            style={{ width: '100%' }}
          >
            <i style={{ fontSize: '16px' }}>
              <WarningOutlined /> This feedback has been closed, you can reply
              to open this feedback again
            </i>
          </Card>
        ) : (
          ''
        )}
        <Card
          title={<Title level={5}>Title: {title}</Title>}
          style={{ width: '100%' }}
        >
          <Comment
            author={user.firstName + ' ' + user.lastName}
            avatar={
              user.avatar
                ? getCurrentUserImage(user.id)
                : '/static/images/avatar.png'
            }
            content={
              <Card>
                <div
                  dangerouslySetInnerHTML={{
                    __html: description
                  }}
                />
                {fileList.length > 0 ? (
                  <div>
                    <Divider />
                    File Attachment
                  </div>
                ) : (
                  ''
                )}
                <Upload
                  title="File Attachment List"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="text"
                  fileList={fileList}
                  disabled
                  previewFile={false}
                  // onPreview={this.handlePreview}
                  // onChange={this.handleChange}
                ></Upload>
              </Card>
            }
            datetime={getFromNowTime(dateCreated)}
          />
          {comments.length > 0 && <CommentList comments={comments} />}
          {isReply ? (
            <Comment
              author={currentUser.firstName + ' ' + currentUser.lastName}
              avatar={
                currentUser.avatar
                  ? getCurrentUserImage(currentUser.id)
                  : '/static/images/avatar.png'
              }
              content={
                <Editor
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  value={value}
                />
              }
            />
          ) : (
            ''
          )}
        </Card>
      </Space>
      <style jsx global>{`
        .ant-col .ant-card-head {
          font-size: 13px;
        }
        .ant-col .ant-card-body {
          font-size: 15px;
        }
      `}</style>
    </Fragment>
  );
};
export default connectToRedux(UserFeedbackDetailComponent);
