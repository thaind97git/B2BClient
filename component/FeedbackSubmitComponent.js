import { Button, Card, Col, Input, Rate, Row } from 'antd';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import React, { Fragment, useEffect, useState } from 'react';
import { displayCurrency } from '../utils';
const styles = {
  rate: {
    margin: '8px 0px 8px 12px'
  }
};
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
  supplier
}) => {
  console.log({ supplier });
  const [answer1, setAnswer1] = useState(null);
  const [answer2, setAnswer2] = useState(null);
  const [answer3, setAnswer3] = useState(null);
  const [answer4, setAnswer4] = useState(null);

  const customIcons1 = getIconList(answer1);
  const customIcons2 = getIconList(answer2);
  const customIcons3 = getIconList(answer3);
  const customIcons4 = getIconList(answer4);
  if (!supplier) {
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
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      color: 'rgba(0, 0, 0, 0.65)',
                      fontSize: 14
                    }}
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
                      Product Name: Product 1
                      <br />
                      Quantity: 120 Units
                      <br />
                      Unit Price: {displayCurrency(200000)}
                    </div>
                  </div>
                  <div
                    style={{
                      color: 'rgba(0, 0, 0, 0.65)',
                      fontSize: 14,
                      textAlign: 'right'
                    }}
                  >
                    <b>Supplier Information</b>
                    <br />
                    Feedback to: supplier1@gmail.com
                    <br />
                    Company Name: FP Company
                  </div>
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
              1. Mức độ hài lòng về thời gian giao hàng.
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
              2. Mức độ hài lòng về chất lượng sản phâm.
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
              3. Mức độ hài lòng về giá nhà cung cấp đưa ra.
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
              4. Mức độ hài lòng về đóng gói sản phẩm.
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
              5. Thank you for your feedback. <br />
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>Any suggestions for
              improvement?.
              <br />
              <div style={styles.rate}>
                <Input.TextArea
                  autoSize={{ minRows: 5, maxRows: 6 }}
                  placeholder="Ý kiến đóng góp về chất lượng dịch vụ."
                />
              </div>
            </Col>
          </Row>
          {!isAdmin && (
            <Row justify="center">
              <Button type="primary">Submit</Button>
            </Row>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default FeedbackSubmitComponent;
