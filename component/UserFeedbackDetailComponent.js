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
  Popover
} from 'antd';
import { LeftOutlined, WarningOutlined } from '@ant-design/icons';
import moment from 'moment';
import Router, { useRouter } from 'next/router';
import React, { Fragment, useState, useEffect } from 'react';
import { F_CLOSED, F_OPEN } from '../enums/feedbackStatus';
import {
  DATE_TIME_FORMAT,
  getCurrentUserImage,
  getFeedbackFileURL
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
  createFeedbackRate,
  CreateFeedbackRateData,
  CreateFeedbackRateResetter,
  GetFeedbackFileData,
  getFeedbackFile
} from '../stores/FeedbackState';

import {
  getAuctionDetails,
  GetAuctionDetailsData
} from '../stores/AuctionState';
import {
  getRequestDetails,
  GetRequestDetailsDataSelector
} from '../stores/RequestState';
import {
  getOrderDetails,
  GetOrderDetailsDataSelector
} from '../stores/OrderState';
import Moment from 'react-moment';
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title } = Typography;
const FormItem = Form.Item;
const connectToRedux = connect(
  createStructuredSelector({
    feedbackDetailsData: GetFeedbackDetailsData,
    createFeedbackReplyData: CreateFeedbackReplyData,
    createFeedbackRateData: CreateFeedbackRateData,
    currentUser: CurrentUserData,
    feedbackFileData: GetFeedbackFileData,
    orderDetails: GetOrderDetailsDataSelector,
    requestDetails: GetRequestDetailsDataSelector,
    auctionDetails: GetAuctionDetailsData
  }),
  (dispatch) => ({
    getFeedbackDetails: (feedbackId) => {
      dispatch(getFeedbackDetails(feedbackId));
    },
    replyFeedback: (object) => {
      dispatch(createFeedbackReply(object));
    },
    rateFeedback: (object) => {
      dispatch(createFeedbackRate(object));
    },
    getFeedbackFile: (fileId) => {
      dispatch(getFeedbackFile(fileId));
    },
    getOrderDetail: (orderId) => {
      dispatch(getOrderDetails(orderId));
    },
    getRequestDetails: (requestId) => {
      dispatch(getRequestDetails(requestId));
    },
    getAuctionDetails: (auctionId) => {
      dispatch(getAuctionDetails(auctionId));
    },
    resetData: () => dispatch(GetFeedbackDetailsResetter),
    resetCreateFeedbackReply: () => dispatch(CreateFeedbackReplyResetter),
    resetCreateFeedbackRate: () => dispatch(CreateFeedbackRateResetter)
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
  <>
    <FormItem>
      <TextArea rows={4} onChange={onChange} value={value} />
    </FormItem>
    <FormItem>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Reply
      </Button>
    </FormItem>
  </>
);
const customIcons1 = {
  1: <FrownOutlined />,
  2: '',
  3: '',
  4: '',
  5: ''
};
const customIcons2 = {
  1: '',
  2: <SmileOutlined />,
  3: '',
  4: '',
  5: ''
};

const displayServiceName = (serviceName) =>
  serviceName
    ? serviceName.length > 38
      ? serviceName.slice(0, 38) + ' ...'
      : serviceName
    : '';

const desc1 = ['Not Happy', '', '', '', ''];
const desc2 = ['', 'Happy', '', '', ''];

const UserFeedbackDetailComponent = ({
  currentUser,
  getFeedbackDetails,
  feedbackDetailsData,
  resetData,
  replyFeedback,
  createFeedbackReplyData,
  resetCreateFeedbackReply,
  rateFeedback,
  createFeedbackRateData,
  resetCreateFeedbackRate,
  getFeedbackFile,
  feedbackFileData,
  auctionDetails,
  getAuctionDetails,
  requestDetails,
  getRequestDetails,
  orderDetails,
  getOrderDetails
}) => {
  const router = useRouter();
  const feedbackId = router.query.id;
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const [isReply, setIsReply] = useState(false);
  const [isHappy, setIsHappy] = useState('None');
  const [fileList, setFileList] = useState([]);
  const [isFeedbackSystem, setIsFeedbackSystem] = useState(true);
  const [serviceName, setServiceName] = useState('');

  const handleSubmit = () => {
    replyFeedback({
      description: value,
      feedbackId: feedbackDetailsData.id
    });
  };

  const handleRate = (value) => {
    rateFeedback({
      isHappy: value,
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
    if (createFeedbackRateData) {
      getFeedbackDetails(feedbackId);
      resetCreateFeedbackRate();
    }
  }, [createFeedbackRateData]);

  useEffect(() => {
    if (requestDetails) {
      setServiceName(
        requestDetails.quantity +
          ' ' +
          requestDetails.product.unitType +
          ' of ' +
          requestDetails.product.description
      );
    }
  }, [requestDetails]);

  useEffect(() => {
    if (auctionDetails) {
      setServiceName(auctionDetails.auctionName);
    }
  }, [auctionDetails]);

  useEffect(() => {
    if (orderDetails) {
      setServiceName(orderDetails.groupName);
    }
  }, [orderDetails]);

  useEffect(() => {
    setFileList([]);
    setComments([]);
    if (feedbackDetailsData) {
      console.log(feedbackDetailsData.user);
      console.log(currentUser.avatar)
      if (feedbackDetailsData.reverseAuctionId) {
        getAuctionDetails(feedbackDetailsData.reverseAuctionId);
        setIsFeedbackSystem(false);
      } else if (feedbackDetailsData.orderId) {
        getOrderDetails(feedbackDetailsData.orderId);
        setIsFeedbackSystem(false);
      } else if (feedbackDetailsData.requestId) {
        getRequestDetails(feedbackDetailsData.requestId);
        setIsFeedbackSystem(false);
      }
      if (feedbackDetailsData.feedbackReplies) {
        for (let i = 0; i < feedbackDetailsData.feedbackReplies.length; i++) {
          const feedbackItem = feedbackDetailsData.feedbackReplies[i];
          const { user = {} } = feedbackItem;
          if (feedbackItem.isHappy) {
            setIsHappy('Happy');
            continue;
          } else if (feedbackItem.isHappy === false) {
            setIsHappy('Not Happy');
            continue;
          }
          setComments((comments) => [
            ...comments,
            {
              author: user.firstName + ' ' + user.lastName,
              avatar: user.avatar
                ? getCurrentUserImage(user.avatar)
                : '/static/images/avatar.png',
              content: <Card>{feedbackItem.description}</Card>,
              datetime: moment(new Date(feedbackDetailsData.dateCreated)).utc().fromNow()
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

  return (
    <Fragment>
      <Row style={{ paddingBottom: 24 }} justify="space-between" align="middle">
        <Button
          type="primary"
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
      <Row justify="space-between">
        <Title level={4}>{feedbackDetailsData.title}</Title>
      </Row>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card style={{ width: '100%' }}>
          <Row span={24} gutter={16} justify="space-between">
            <Col span={isFeedbackSystem ? 8 : 6}>
              <Card
                style={{ backgroundColor: '#199EB8', color: '#FFFFFF' }}
                bordered={false}
              >
                <div style={{ fontSize: '14px' }}>Type</div>
                <br />
                <div style={{ fontSize: '17px', fontWeight: 'bold' }}>
                  {feedbackDetailsData.orderId
                    ? 'Order'
                    : feedbackDetailsData.requestId
                    ? 'Order'
                    : feedbackDetailsData.reverseAuctionId
                    ? 'Auction'
                    : 'System'}
                </div>
              </Card>
            </Col>
            <Col span={isFeedbackSystem ? 8 : 6}>
              <Card
                style={{ backgroundColor: '#199EB8', color: '#FFFFFF' }}
                bordered={false}
              >
                <div style={{ fontSize: '14px' }}>Date Created</div>
                <br />
                <div style={{ fontSize: '17px', fontWeight: 'bold' }}>
                  <Moment format={DATE_TIME_FORMAT}>
                    {moment.utc(new Date(feedbackDetailsData.dateCreated)).local()}
                  </Moment>
                </div>
              </Card>
            </Col>
            <Col span={isFeedbackSystem ? 8 : 6}>
              <Card
                style={{ backgroundColor: '#199EB8', color: '#FFFFFF' }}
                bordered={false}
              >
                <div style={{ fontSize: '14px' }}>Status</div>
                <br />
                <div style={{ fontSize: '17px', fontWeight: 'bold' }}>
                  {feedbackDetailsData.feedbackStatus.description}
                </div>
              </Card>
            </Col>
            {!isFeedbackSystem ? (
              <Col span={6}>
                <Card
                  style={{ backgroundColor: '#199EB8', color: '#FFFFFF' }}
                  bordered={false}
                >
                  <div style={{ fontSize: '14px' }}>Service Name</div>
                  <br />
                  <Popover content={serviceName}>
                    <div style={{ fontSize: '17px', fontWeight: 'bold' }}>
                      {displayServiceName(serviceName)}
                    </div>
                  </Popover>
                </Card>
              </Col>
            ) : (
              ''
            )}
          </Row>
        </Card>
        {feedbackDetailsData.feedbackStatus.id === F_CLOSED ? (
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
        <Card style={{ width: '100%' }}>
          <Comment
            author={
              feedbackDetailsData.user.firstName +
              ' ' +
              feedbackDetailsData.user.lastName
            }
            avatar={
              feedbackDetailsData.user.avatar
                ? getCurrentUserImage(feedbackDetailsData.user.avatar)
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
                  // onPreview={this.handlePreview}
                  // onChange={this.handleChange}
                ></Upload>
              </Card>
            }
            datetime={moment(new Date(feedbackDetailsData.dateCreated))
              .utc()
              .fromNow()}
          />
          {comments.length > 0 && <CommentList comments={comments} />}
          {isReply ? (
            <Comment
              author={currentUser.firstName + ' ' + currentUser.lastName}
              avatar={
                currentUser.avatar
                  ? getCurrentUserImage(currentUser.avatar)
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
          {isHappy === 'None' &&
          feedbackDetailsData.feedbackStatus.id === F_CLOSED ? (
            <div align="center">
              <p style={{ fontSize: '20px', marginBottom: '-20px' }}>
                Are you satisfied with this support content?
              </p>
              <br />
              <Rate
                tooltips={desc1}
                style={{ fontSize: '100px' }}
                onChange={(value) => {
                  handleRate(false);
                }}
                character={({ index }) => {
                  return customIcons1[index + 1];
                }}
              />
              <Rate
                tooltips={desc2}
                style={{ fontSize: '100px' }}
                onChange={(value) => {
                  handleRate(true);
                }}
                character={({ index }) => {
                  return customIcons2[index + 1];
                }}
              />
            </div>
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
