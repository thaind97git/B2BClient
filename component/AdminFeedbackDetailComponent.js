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
  Tag,
  Drawer
} from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import Router, { useRouter } from 'next/router';
import React, { Fragment, useState, useEffect } from 'react';
import { F_CLOSED, F_OPEN } from '../enums/feedbackStatus';
import { F_ORDER, F_AUCTION, F_RFQ, F_SYSTEM} from '../enums/feedbackType';
import FeedbackTypeComponent from './Utils/FeedbackTypeComponent';
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
  GetFeedbackFileData,
  getFeedbackFile
} from '../stores/FeedbackState';
import Moment from 'react-moment';
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';
import UserProfileComponent from './UserProfileComponent';

const { TextArea } = Input;
const { Title } = Typography;
const FormItem = Form.Item;
const connectToRedux = connect(
  createStructuredSelector({
    feedbackDetailsData: GetFeedbackDetailsData,
    createFeedbackReplyData: CreateFeedbackReplyData,
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
    getFeedbackFile: (fileId) => {
      dispatch(getFeedbackFile(fileId));
    },
    resetData: () => dispatch(GetFeedbackDetailsResetter),
    resetCreateFeedbackReply: () => dispatch(CreateFeedbackReplyResetter)
  })
);

const Happy = ({ isHappy }) => (
  <img
    alt=""
    className="rate"
    src="/static/images/vote-up.png"
    value={true}
    height={20}
    style={isHappy === true ? { opacity: '1' } : { opacity: '0.3' }}
  />
);

const Unhappy = ({ isHappy }) => (
  <img
    alt=""
    className="rate"
    src="/static/images/vote-down.png"
    height={20}
    style={isHappy === false ? { opacity: '1' } : { opacity: '0.3' }}
  />
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

const desc1 = ['Not Happy', '', '', '', ''];
const desc2 = ['', 'Happy', '', '', ''];

const displayServiceName = (name) =>
  name ? (name.length > 38 ? name.slice(0, 38) + ' ...' : name) : '';

const AdminFeedbackDetailComponent = ({
  currentUser,
  getFeedbackDetails,
  feedbackDetailsData,
  resetData,
  replyFeedback,
  createFeedbackReplyData,
  resetCreateFeedbackReply,
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
  const [serviceName, setServiceName] = useState('');
  const [isFeedbackSystem, setIsFeedbackSystem] = useState(true);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentUserSelected, setCurrentUserSelected] = useState({});

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
    setFileList([]);
    setComments([]);
    if (feedbackDetailsData) {
      const { feedbackStatus = {} } = feedbackDetailsData;
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
          const feedbackItem = feedbackDetailsData.feedbackReplies[i] || {};
          const { user = {} } = feedbackItem;
          setComments((comments) => [
            ...comments,
            {
              author: feedbackItem.isUser ? (
                <Button
                  onClick={() => {
                    setCurrentUserSelected(user);
                    setOpenDetails(true);
                  }}
                  size="small"
                  type="link"
                >
                  {user.firstName + ' ' + user.lastName}
                </Button>
              ) : (
                user.firstName + ' ' + user.lastName
              ),
              avatar: user.avatar
                ? getCurrentUserImage(user.id)
                : '/static/images/avatar.png',
              content: <Card>{feedbackItem.description}</Card>,
              datetime: getFromNowTime(feedbackDetailsData.dateCreated),
              actions: [
                !feedbackItem.isUser ? (
                  <Tooltip key="comment-basic-like" title="Happy">
                    <span>
                      <Happy isHappy={feedbackItem.isHappy} />
                    </span>
                  </Tooltip>
                ) : (
                  ''
                ),
                !feedbackItem.isUser ? (
                  <Tooltip key="comment-basic-dislike" title="Not Happy">
                    <span>
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
          const feedbackItem = feedbackDetailsData.files[i] || {};
          getFeedbackFile(feedbackItem.id);
          setFileList((fileList) => [
            ...fileList,
            {
              uid: i,
              name: feedbackItem.description,
              status: 'done',
              url: getFeedbackFileURL(feedbackItem.id)
            }
          ]);
        }
      }
      if (feedbackStatus.id === F_OPEN) {
        setIsReply(true);
      } else if (feedbackStatus.id === F_CLOSED) {
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

  return (
    <Fragment>
      <Drawer
        width={640}
        title="User Details"
        placement={'right'}
        closable={true}
        onClose={() => setOpenDetails(false)}
        visible={openDetails}
        key={'right'}
      >
        <UserProfileComponent
          isDrawer
          userId={(currentUserSelected || {}).id}
        />
      </Drawer>
      <Row style={{ paddingBottom: 24 }} justify="space-between" align="middle">
        <Button
          type="link"
          onClick={() => {
            Router.push(`/admin/feedback`);
          }}
        >
          <LeftOutlined /> Back to feedback list
        </Button>
      </Row>
      <Row justify="space-between">
        <Title level={4}>{feedbackDetailsData.title}</Title>
      </Row>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row span={24} gutter={16} justify="space-between">
          <Col span={isFeedbackSystem ? 8 : 6}>
            <FeedBackCard title="Type">
              <FeedbackTypeComponent
                status={
                  request
                    ? F_RFQ
                    : reverseAuction
                    ? F_AUCTION
                    : order
                    ? F_ORDER
                    : F_SYSTEM
                }
              ></FeedbackTypeComponent>
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
                <Tag color="#f50">
                  {feedbackStatus.description}
                </Tag>
              ) : (
                <Tag
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
        <Card
          title={<Title level={5}>Title: {title}</Title>}
          style={{ width: '100%' }}
        >
          <Comment
<<<<<<< HEAD
            author={user.firstName + ' ' + user.lastName}
=======
            author={
              <Button
                onClick={() => {
                  setCurrentUserSelected(user);
                  setOpenDetails(true);
                }}
                size="small"
                type="link"
              >
                {user.firstName + ' ' + user.lastName}
              </Button>
            }
>>>>>>> origin/dev_quang
            avatar={
              user.avatar
                ? getCurrentUserImage(user.id)
                : '/static/images/avatar.png'
            }
            content={
              <Card>
                <div
                  dangerouslySetInnerHTML={{
                    __html: (feedbackDetailsData || {}).description
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
                ></Upload>
              </Card>
            }
            datetime={getFromNowTime(feedbackDetailsData.dateCreated)}
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
        .rate {
          transition: all 0.2s ease-in-out;
        }
        .rate:hover {
          transform: scale(1.5);
        }
        .ant-tag {
          font-size: 16px;
          padding: 4px 12px;
        }
      `}</style>
    </Fragment>
  );
};
export default connectToRedux(AdminFeedbackDetailComponent);
