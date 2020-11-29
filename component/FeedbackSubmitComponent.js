import { Button, Card, Col, Input, message, Rate, Row } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { displayCurrency } from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  createFeedback,
  CreateFeedbackData,
  getFeedbackQuestions,
  GetFeedbackQuestionsData,
  CreateFeedbackError,
  CreateFeedbackResetter
} from '../stores/FeedbackState';
import { get } from 'lodash/fp';
const styles = {
  rate: {
    margin: '8px 0px 8px 12px'
  }
};
const connectToRedux = connect(
  createStructuredSelector({
    questionData: GetFeedbackQuestionsData,
    createFeedbackData: CreateFeedbackData,
    createFeedbackError: CreateFeedbackError
  }),
  (dispatch) => ({
    getQuestions: () => dispatch(getFeedbackQuestions()),
    createFeedback: ({ requestId, description, feedbackAnswers }) => {
      dispatch(createFeedback({ requestId, description, feedbackAnswers }));
    },
    resetSubmitFeedback: () => {
      // dispatch(CreateFeedbackError);
      dispatch(CreateFeedbackResetter);
    }
  })
);
const More = () => (
  <div style={{ marginTop: 4 }}>
    <small>Very dissatisfied</small>
    <small style={{ paddingLeft: 68 }}>Very satisfied</small>
  </div>
);
const getIconList = (answer) => {
  return {
    1: (
      <img
        className={answer === 1 ? 'rate-active' : 'rate-default'}
        width={28}
        src="/static/images/rate/very-bad.png"
        alt="Very Bad"
      />
    ),
    2: (
      <img
        className={answer === 2 ? 'rate-active' : 'rate-default'}
        width={28}
        src="/static/images/rate/bad.png"
        alt="Bad"
      />
    ),
    3: (
      <img
        className={answer === 3 ? 'rate-active' : 'rate-default'}
        width={28}
        src="/static/images/rate/neutral.png"
        alt="Neutral"
      />
    ),
    4: (
      <img
        className={answer === 4 ? 'rate-active' : 'rate-default'}
        width={28}
        src="/static/images/rate/good.png"
        alt="Good"
      />
    ),
    5: (
      <img
        className={answer === 5 ? 'rate-active' : 'rate-default'}
        width={28}
        src="/static/images/rate/very-good.png"
        alt="Very Good"
      />
    )
  };
};
const FeedbackSubmitComponent = ({
  isAdmin = false,
  span = 16,
  title = true,
  supplier,
  questionData,
  getQuestions,
  product,
  quantity,
  unitPrice,
  createFeedback,
  createFeedbackData,
  createFeedbackError,
  requestId,
  resetSubmitFeedback
}) => {
  const [answer1, setAnswer1] = useState(null);
  const [answer2, setAnswer2] = useState(null);
  const [answer3, setAnswer3] = useState(null);
  const [answer4, setAnswer4] = useState(null);
  const [description, setDescription] = useState('');

  const customIcons1 = getIconList(answer1);
  const customIcons2 = getIconList(answer2);
  const customIcons3 = getIconList(answer3);
  const customIcons4 = getIconList(answer4);

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);
  useEffect(() => {
    resetSubmitFeedback();
  }, [resetSubmitFeedback]);

  useEffect(() => {
    if (createFeedbackError) {
      message.error('Submit feedback fail!');
    }
  }, [createFeedbackError]);

  if (!supplier && !questionData && !product) {
    return null;
  }

  return (
    <Row justify="center">
      <Col span={span}>
        <Card
          bordered={false}
          title={
            <Row>
              {title ? (
                <Col span={24}>
                  <Row justify="center" style={{ marginBottom: 12 }}>
                    <b>{isAdmin ? 'Feedback Details' : 'Submit Feedback'}</b>
                  </Row>
                </Col>
              ) : null}
              <Col span={24}>
                <Row justify="space-between" align="middle">
                  <Col
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      color: 'rgba(0, 0, 0, 0.65)',
                      whiteSpace: 'normal',
                      fontSize: 14
                    }}
                    span={15}
                  >
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    <div>
                      <b>RFQ Information</b>
                      {isAdmin && (
                        <Fragment>
                          <br />
                          Feedback from: Buyer1
                        </Fragment>
                      )}
                      <br />
                      <div>Product Name: {product.productName}</div>
                      Quantity: {quantity}{' '}
                      {get('unitOfMeasure.description')(product)}
                      <br />
                      Unit Price: {displayCurrency(unitPrice)}
                    </div>
                  </Col>
                  <Col
                    style={{
                      color: 'rgba(0, 0, 0, 0.65)',
                      fontSize: 14,
                      textAlign: 'right'
                    }}
                    span={8}
                  >
                    <b>Supplier Information</b>
                    <br />
                    Feedback to: {supplier.email}
                    <br />
                    Company Name: {supplier.companyName}
                  </Col>
                </Row>
              </Col>
            </Row>
          }
        >
          <Row justify="space-between">
            <Col
              md={12}
              sm={24}
              style={{ margin: '12px 0px 24px 0px', paddingLeft: '10%' }}
            >
              1. {get('[0].description')(questionData)}
              <br />
              <div style={styles.rate}>
                <Rate
                  onChange={(value) => setAnswer1(value)}
                  tooltips={['Very Bad', 'Bad', 'Neutral', 'Good', 'Very Good']}
                  defaultValue={0}
                  character={({ index }) => {
                    return customIcons1[index + 1];
                  }}
                />
                <More />
              </div>
            </Col>
            <Col
              md={12}
              sm={24}
              style={{ margin: '12px 0px 24px 0px', paddingLeft: '10%' }}
            >
              2. {get('[1].description')(questionData)}
              <br />
              <div style={styles.rate}>
                <Rate
                  onChange={(value) => setAnswer2(value)}
                  tooltips={['Very Bad', 'Bad', 'Neutral', 'Good', 'Very Good']}
                  defaultValue={0}
                  character={({ index }) => {
                    return customIcons2[index + 1];
                  }}
                />
                <More />
              </div>
            </Col>
          </Row>
          <Row>
            <Col
              md={12}
              sm={24}
              style={{ margin: '24px 0px', paddingLeft: '10%' }}
            >
              3. {get('[2].description')(questionData)}
              <br />
              <div style={styles.rate}>
                <Rate
                  onChange={(value) => setAnswer3(value)}
                  tooltips={['Very Bad', 'Bad', 'Neutral', 'Good', 'Very Good']}
                  defaultValue={0}
                  character={({ index }) => {
                    return customIcons3[index + 1];
                  }}
                />
                <More />
              </div>
            </Col>
            <Col
              md={12}
              sm={24}
              style={{ margin: '24px 0px', paddingLeft: '10%' }}
            >
              4. {get('[3].description')(questionData)}
              <br />
              <div style={styles.rate}>
                <Rate
                  onChange={(value) => setAnswer4(value)}
                  tooltips={['Very Bad', 'Bad', 'Neutral', 'Good', 'Very Good']}
                  defaultValue={0}
                  character={({ index }) => {
                    return customIcons4[index + 1];
                  }}
                />
                <More />
              </div>
            </Col>
          </Row>
          <Row>
            <Col
              md={22}
              sm={24}
              style={{ margin: '24px 0px', paddingLeft: '10%' }}
            >
              5. Is there anything we can do to improve ?
              <br />
              <div style={styles.rate}>
                <Input.TextArea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={300}
                  showCount={true}
                  autoSize={{ minRows: 5, maxRows: 6 }}
                />
              </div>
            </Col>
          </Row>
          {!isAdmin && (
            <Row justify="center">
              <Button
                disabled={!answer1 || !answer2 || !answer3 || !answer4}
                onClick={() => {
                  if (!answer1 || !answer2 || !answer3 || !answer4) {
                    return;
                  } else {
                    createFeedback({
                      requestId,
                      description,
                      feedbackAnswers: [
                        {
                          feedbackQuestionId: 1,
                          rating: answer1
                        },
                        {
                          feedbackQuestionId: 2,
                          rating: answer2
                        },
                        {
                          feedbackQuestionId: 3,
                          rating: answer3
                        },
                        {
                          feedbackQuestionId: 4,
                          rating: answer4
                        }
                      ]
                    });
                  }
                }}
                type="primary"
              >
                Submit
              </Button>
            </Row>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default connectToRedux(FeedbackSubmitComponent);
