import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Radio, Typography } from 'antd';
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
  userRegister,
  userRegisterErrorSelector,
  userRegisterResetter
} from '../stores/UserState';
import { openNotification, parseBoolean } from '../utils';
const { Title } = Typography;
const FormItem = Form.Item;
const styles = {
  colStyle: { padding: '0 8px' },
  titleStyle: { fontWeight: 500 }
};

const connectToRedux = connect(
  createStructuredSelector({
    userRegisterError: userRegisterErrorSelector
  }),
  (dispatch) => ({
    registerUser: (values) => dispatch(userRegister(values)),
    resetData: () => dispatch(userRegisterResetter)
  })
);

const RegisterComponent = ({ userRegisterError, registerUser, resetData }) => {
  const [role, setRole] = useState(1);

  // useEffect(() => {
  //   if (userRegisterError) {
  //     openNotification("error", { message: "Register account fail" });
  //   }
  // }, [userRegisterError]);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  const onFinish = (values) => {
    values.isBuyer = parseBoolean(values.isBuyer);
    registerUser(values);
  };

  return (
    <Row align="middle" justify="center">
      <Col sm={20} md={10}>
        <Form
          autoComplete="new-password"
          className="register-form"
          onFinish={onFinish}
          initialValues={{
            isBuyer: role
          }}
        >
          <Row justify="center">
            <Title style={styles.titleStyle} level={2}>
              CHOOSE YOUR ACCOUNT TYPE
            </Title>
          </Row>
          <FormItem
            name="isBuyer"
            rules={[
              {
                required: true
              }
            ]}
          >
            <Row justify="center">
              <Radio.Group
                initialValues={role}
                onChange={(e) => setRole(e.target.value)}
                value={role}
                buttonStyle="solid"
              >
                <Radio.Button value={1}>Buyer</Radio.Button>
                <Radio.Button value={0}>Supplier</Radio.Button>
              </Radio.Group>
            </Row>
          </FormItem>
          <Row align="top">
            <Col style={styles.colStyle} span={12}>
              <div className="label">Email:</div>
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
              <div className="label">Phone Number:</div>
              <FormItem
                name="phone"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your phone'
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
                  placeholder="Please enter your phone"
                />
              </FormItem>
            </Col>
          </Row>

          <Row align="top">
            <Col style={styles.colStyle} span={12}>
              <div>&nbsp;&nbsp;Fax:</div>
              <FormItem
                name="fax"
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please enter your fax number'
                //   }
                // ]}
              >
                <Input
                  maxLength={20}
                  size="large"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Please enter your fax number"
                />
              </FormItem>
            </Col>
            <Col style={styles.colStyle} span={12}>
              <div className="label">Tax Identification Number:</div>
              <FormItem
                name="taxIdentificationNumber"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your tax identification number'
                  }
                ]}
              >
                <Input
                  maxLength={20}
                  size="large"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Please enter your tax identification number"
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="top">
            <Col style={styles.colStyle} span={12}>
              <div className="label">First Name:</div>
              <FormItem
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your first name'
                  }
                ]}
              >
                <Input
                  maxLength={20}
                  size="large"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Please enter your first name"
                />
              </FormItem>
            </Col>
            <Col style={styles.colStyle} span={12}>
              <div className="label">Last Name:</div>
              <FormItem
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your last name'
                  }
                ]}
              >
                <Input
                  maxLength={20}
                  size="large"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Please enter your last name"
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="top">
            <Col style={styles.colStyle} span={12}>
              <div className="label">Password:</div>
              <FormItem
                dependencies={['password']}
                hasFeedback
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please set login password'
                  }
                ]}
              >
                <Input.Password
                  minLength={6}
                  autoComplete="new-password"
                  minLength={6}
                  size="large"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Please set login password"
                />
              </FormItem>
            </Col>
            <Col style={styles.colStyle} span={12}>
              <div className="label">Confirm Password:</div>
              <FormItem
                hasFeedback
                name="re-password"
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password'
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
                  minLength={6}
                  size="large"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Please confirm your password"
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="top">
            <Col style={styles.colStyle} span={24}>
              <div className="label">Company Name:</div>
              <FormItem
                name="companyName"
                rules={[
                  {
                    required: true,
                    message: 'Enter the company name'
                  }
                ]}
              >
                <Input
                  size="large"
                  prefix={<AuditOutlined className="site-form-item-icon" />}
                  placeholder="Must be a legally registered company"
                />
              </FormItem>
            </Col>
            <Col style={styles.colStyle} span={24}>
              <div className="label">Address:</div>
              <FormItem
                name="address"
                rules={[
                  {
                    required: true,
                    message: 'Enter the company address'
                  }
                ]}
              >
                <Input
                  size="large"
                  prefix={<AuditOutlined className="site-form-item-icon" />}
                  placeholder="Please enter the company address"
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="top">
            <Col span={12}>
              <Row justify="center">
                Existing Account? <span>&nbsp;</span>
                <div className="login">
                  <Link href="/login">LOGIN</Link>
                </div>
              </Row>
            </Col>
            <Col span={12}>
              <Button
                block
                size="large"
                className="submit"
                type="primary"
                htmlType="submit"
              >
                Get Started
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};
export default connectToRedux(RegisterComponent);
