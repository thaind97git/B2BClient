import { connect } from 'react-redux';
import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Row,
  Space,
  Table,
  Typography,
  Modal,
  Col,
  Comment,
  Tooltip,
  Input,
  Form,
  List,
  Avatar
} from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import Router from 'next/router';
import React, { Fragment, useState, useRef } from 'react';
import { getCurrentUserImage } from '../utils';
import { CurrentUserData } from '../stores/UserState';
import { createStructuredSelector } from 'reselect';

const { TextArea } = Input;
const { Title } = Typography;
const FormItem = Form.Item;
const connectToRedux = connect(
  createStructuredSelector({
    // productPagingData: GetProductPagingData,
    // productPagingError: GetProductPagingError,
    currentUser: CurrentUserData
  })
  //   (dispatch) => ({
  //     getProduct: (pageIndex, pageSize, searchMessage, dateRange, category) => {
  //       dispatch(
  //         getProductPaging({
  //           pageIndex,
  //           pageSize,
  //           categoryID: category,
  //           productName: searchMessage,
  //         })
  //       );
  //     },
);
const feedbackUser = {
  title:'About current system',
  type:'auction',
  firstName: 'Trần',
  lastName: 'Vũ',
  dateCreated:'October 22, 2020 17:00 GTM',
  dateUpdated:'October 22, 2020 17:00 GTM',
  description:
    'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  //avatar: 'e0452b3a-6988-41de-9839-11402c4ea799',
  status:'Opening'
};


const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    //header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
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
        Add Comment
      </Button>
    </FormItem>
  </>
);
const AdminFeedbackDetailComponent = ({ currentUser }) => {
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const [isReply, setIsReply] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setValue('');
      setComments([
        {
          author: currentUser.firstName + ' ' + currentUser.lastName,
          avatar: currentUser.avatar
            ? getCurrentUserImage(currentUser.avatar)
            : '/static/images/avatar.png',
          content: <p>{value}</p>,
          datetime: moment().fromNow()
        },
        ...comments
      ]);
      setIsReply(true);
    }, 1000);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    console.log(value);
  };
  return (
    <Fragment>
      <Row style={{ paddingBottom: 24 }} justify="space-between" align="middle">
        <Button
          type="primary"
          onClick={() => {
            Router.push('/admin/feedback');
          }}
        >
          <LeftOutlined /> Back to feedback list
        </Button>
      </Row>
      <Row justify="space-between">
        <Title level={4}>{feedbackUser.title}</Title>
      </Row>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card style={{ width: '100%' }}>
          <Row span={24} gutter={16} justify="space-between">
            <Col span={6}>
              <Card
                title={<div style={{ color: '#FFFFFF' }}>Type</div>}
                style={{ backgroundColor: '#199EB8', color: '#FFFFFF' }}
                bordered={false}
              >
                {feedbackUser.type}
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title={<div style={{ color: '#FFFFFF' }}>Date Created</div>}
                style={{ backgroundColor: '#199EB8', color: '#FFFFFF' }}
                bordered={false}
              >
                {feedbackUser.dateCreated}
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title={<div style={{ color: '#FFFFFF' }}>Date Update</div>}
                style={{ backgroundColor: '#199EB8', color: '#FFFFFF' }}
                bordered={false}
              >
                {feedbackUser.dateUpdated}
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title={<div style={{ color: '#FFFFFF' }}>Status</div>}
                style={{ backgroundColor: '#199EB8', color: '#FFFFFF' }}
                bordered={false}
              >
                {feedbackUser.status}
              </Card>
            </Col>
          </Row>
        </Card>
        <Card style={{ width: '100%' }}>
          <Comment
            author={feedbackUser.firstName + ' ' + feedbackUser.lastName}
            avatar={
              feedbackUser.avatar
                ? getCurrentUserImage(feedbackUser.avatar)
                : '/static/images/avatar.png'
            }
            content={feedbackUser.description}
            datetime={
              <Tooltip
                title={moment()
                  .subtract(1, 'days')
                  .format('YYYY-MM-DD HH:mm:ss')}
              >
                <span>{moment('October 22, 2020 17:00:00').fromNow()}</span>
              </Tooltip>
            }
          />
          {comments.length > 0 && <CommentList comments={comments} />}
          {!isReply ? (
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
            <></>
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
export default connectToRedux(AdminFeedbackDetailComponent);
