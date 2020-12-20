import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Typography, Card } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  AuditOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import {
  createNewAggregator,
  CreateNewAggregatorResetter
} from '../stores/BuyerState';
const { Title } = Typography;
const FormItem = Form.Item;
const styles = {
  colStyle: { padding: '0 8px' },
  titleStyle: { fontWeight: 500 }
};

const connectToRedux = connect(
  createStructuredSelector({
    
  }),
  (dispatch) => ({
    createAggregator: (values) => dispatch(createNewAggregator(values)),
    resetData: () => dispatch(CreateNewAggregatorResetter)
  })
);

const AdminAggregatorCreateComponent = ({ createAggregator, resetData }) => {
  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  const onFinish = (values) => {
    createAggregator(values);
  };

  return (
    <Row align="middle" justify="center">
      <Col sm={24} md={12}>
        <Form
          autoComplete="new-password"
          className="register-form"
          onFinish={onFinish}
        >
          <Row justify="center">
            <Title style={styles.titleStyle} level={2}>
              CREATE NEW AGGREGATOR
            </Title>
          </Row>
          <Card
            bordered={false}
            title={<b>Aggregator Basic Information</b>}
            style={{
              width: '100%',
              boxShadow: '2px 2px 14px 0 rgba(0,0,0,.1)',
              marginTop: 16
            }}
          >
            <Row align="top">
              <Col style={styles.colStyle} span={12}>
                <div className="label">
                  <span style={{ color: 'red' }}>* </span>Email:
                </div>
                <FormItem
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter Email'
                    },
                    {
                      type: 'email',
                      message: 'Please enter the correct Email'
                    }
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<MailOutlined className="site-form-item-icon" />}
                    placeholder="Email will be used as Login ID"
                  />
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={12}>
                <div className="label">
                  <span style={{ color: 'red' }}>* </span>Phone Number:
                </div>
                <FormItem
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the aggregator's phone"
                    },
                    {
                      pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                      message: 'Please enter the correct phone number'
                    }
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<PhoneOutlined className="site-form-item-icon" />}
                    placeholder="Please enter the aggregator's phone"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row align="top">
              <Col style={styles.colStyle} span={12}>
                <div className="label">
                  <span style={{ color: 'red' }}>* </span>First Name:
                </div>
                <FormItem
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the aggregator's first name"
                    }
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Please enter the aggregator's first name"
                  />
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={12}>
                <div className="label">
                  <span style={{ color: 'red' }}>* </span>Last Name:
                </div>
                <FormItem
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the aggregator's last name"
                    }
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Please enter the aggregator's last name"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row align="top">
              <Col style={styles.colStyle} span={12}>
                <div className="label">
                  <span style={{ color: 'red' }}>* </span>Password:
                </div>
                <FormItem
                  dependencies={['password']}
                  hasFeedback
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please set the aggregator's login password"
                    }
                  ]}
                >
                  <Input.Password
                    autoComplete="new-password"
                    size="large"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Please set the aggregator's login password"
                  />
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={12}>
                <div className="label">
                  <span style={{ color: 'red' }}>* </span>Confirm Password:
                </div>
                <FormItem
                  hasFeedback
                  name="re-password"
                  rules={[
                    {
                      required: true,
                      message: "Please confirm the aggregator's password"
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          'The two passwords that you entered do not match!'
                        );
                      }
                    })
                  ]}
                >
                  <Input.Password
                    autoComplete="new-password"
                    size="large"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Please confirm the aggregator's password"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row align="top">
              <Col style={styles.colStyle} span={24}>
                <div className="label">
                  <span style={{ color: 'red' }}>* </span>Address:
                </div>
                <FormItem
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Enter the aggregator's address"
                    }
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<AuditOutlined className="site-form-item-icon" />}
                    placeholder="Please enter the aggregator's address"
                  />
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Row justify="center" align="middle" style={{ marginTop: 16 }}>
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
export default connectToRedux(AdminAggregatorCreateComponent);
