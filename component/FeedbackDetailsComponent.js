import {
  Alert,
  Button,
  Col,
  Divider,
  Empty,
  Row,
  Skeleton,
  Tooltip,
  Typography
} from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { get } from 'lodash/fp';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getFeedbackDetails,
  GetFeedbackDetailsData,
  GetFeedbackDetailsError,
  GetFeedbackDetailsResetter
} from '../stores/FeedbackState';
import { getUtcTime } from '../utils';
import DisplayStarComponent from './Utils/DisplayStarComponent';
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    feedbackDetailsData: GetFeedbackDetailsData,
    feedbackDetailsError: GetFeedbackDetailsError
  }),
  (dispatch) => ({
    getFeedbackDetails: (id) => dispatch(getFeedbackDetails(id)),
    resetData: () => {
      dispatch(GetFeedbackDetailsResetter);
    }
  })
);

const DescriptionItem = ({ title, content }) => (
  <Col span={24}>
    <Row className="site-description-item-profile-wrapper">
      <Col span={8}>
        <p className="site-description-item-profile-p-label">{title}:</p>
      </Col>
      <Col span={16}>
        <b>{content}</b>
      </Col>
    </Row>
  </Col>
);

const getIconByRate = (rate) => {
  let iconName = '',
    label;
  switch (rate) {
    case 1:
      iconName = 'very-bad';
      label = 'Very Bad';
      break;
    case 2:
      iconName = 'bad';
      label = 'Bad';
      break;
    case 3:
      iconName = 'neutral';
      label = 'Neutral';
      break;
    case 4:
      iconName = 'good';
      label = 'Good';
      break;
    case 5:
      iconName = 'very-good';
      label = 'Very Good';
      break;

    default:
      break;
  }
  return (
    <Tooltip title={label}>
      <img width={28} src={`/static/images/rate/${iconName}.png`} alt={label} />
    </Tooltip>
  );
};

const FeedbackDetailsComponent = ({
  isAdmin = false,
  feedbackDetailsData,
  getFeedbackDetails,
  feedbackDetailsError,
  feedbackId,
  resetData,
  isAtOrder = false
}) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (feedbackId) {
      getFeedbackDetails(feedbackId);
      setLoading(true);
    }
    return () => {
      resetData();
    };
  }, [feedbackId, getFeedbackDetails, resetData]);

  useEffect(() => {
    if (!!feedbackDetailsData || !!feedbackDetailsError) {
      setLoading(false);
    }
  }, [feedbackDetailsData, feedbackDetailsError]);

  if (!feedbackId) {
    return <Empty description="Can not find any feedback !" />;
  }
  if (loading) {
    return <Skeleton active />;
  }
  const {
    id,
    buyer = {},
    supplier = {},
    feedbackAnswers = [],
    averageRating,
    totalStar,
    dateCreated,
    description,
    product = {},
    orderId
  } = feedbackDetailsData || {};

  return (
    <Row style={{ width: '100%' }}>
      <Col span={24}>
        <Title level={5}>Feedback Information</Title>
      </Col>

      <DescriptionItem title="Date Create" content={getUtcTime(dateCreated)} />
      {feedbackAnswers.map((answer = {}, index) => {
        return (
          <Fragment>
            <DescriptionItem
              title={`Question ${index + 1}`}
              content={
                <Fragment>
                  {get('feedbackQuestion.description')(answer)}
                  <br />
                  {!isAdmin && 'Your '} Answer: {getIconByRate(answer.rating)} ({' '}
                  {<DisplayStarComponent star={answer.rating} />})
                </Fragment>
              }
            />
          </Fragment>
        );
      })}
      <DescriptionItem title="Description" content={description || 'N/A'} />
      <Col span={24}>
        <Row justify="end">
          {isAdmin ? (
            !isAtOrder ? (
              <Button type="link" size="small">
                <a
                  href={`/admin/order/details?id=${orderId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Go to Order Details <RightOutlined />
                </a>
              </Button>
            ) : (
              ''
            )
          ) : (
            <Alert
              message="Thanks for your feedback !"
              type="success"
              showIcon
            />
          )}
        </Row>
      </Col>
      <Divider />
      {isAdmin && (
        <Fragment>
          <Col span={24}>
            <Title level={5}>Feedback From</Title>
          </Col>
          <DescriptionItem title="Email" content={buyer.email} />
          <DescriptionItem
            title="Full Name"
            content={`${buyer.firstName} ${buyer.lastName}`}
          />
          <DescriptionItem title="Phone Number" content={buyer.phoneNumber} />
          <DescriptionItem title="Address" content={buyer.address} />
          <DescriptionItem title="Company Name" content={buyer.companyName} />

          <Divider />
        </Fragment>
      )}
      <Col span={24}>
        <Title level={5}>Supplier Information</Title>
      </Col>
      <DescriptionItem title="Email" content={supplier.email} />
      <DescriptionItem
        title="Full Name"
        content={`${supplier.firstName} ${supplier.lastName}`}
      />
      <DescriptionItem title="Phone Number" content={supplier.phoneNumber} />
      <DescriptionItem title="Address" content={supplier.address} />
      <DescriptionItem title="Company Name" content={supplier.companyName} />

      <style jsx global>{`
        .site-description-item-profile-wrapper {
          margin-bottom: 7px;
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          line-height: 1.5715;
        }

        [data-theme='compact'] .site-description-item-profile-wrapper {
          font-size: 24px;
          line-height: 1.66667;
        }

        .ant-drawer-body p.site-description-item-profile-p {
          display: block;
          margin-bottom: 16px;
          color: rgba(0, 0, 0, 0.85);
          font-size: 16px;
          line-height: 1.5715;
        }

        [data-theme='compact']
          .ant-drawer-body
          p.site-description-item-profile-p {
          font-size: 14px;
          line-height: 1.66667;
        }

        .site-description-item-profile-p-label {
          display: inline-block;
          margin-right: 8px;
          color: rgba(0, 0, 0, 0.85);
        }
      `}</style>
    </Row>
  );
};

export default connectToRedux(FeedbackDetailsComponent);
