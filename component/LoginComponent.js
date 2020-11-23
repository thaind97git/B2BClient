import React, { useEffect } from 'react';
import { Checkbox, Form, Input, Button } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  userLogin,
  userLoginDataErrorSelector,
  userLoginResetter
} from '../stores/UserState';
import { compose } from 'redux';
const FormItem = Form.Item;

const connectToRedux = connect(
  createStructuredSelector({
    userLoginError: userLoginDataErrorSelector
  }),
  (dispatch) => ({
    loginUser: ({ email, password }) =>
      dispatch(userLogin({ email, password })),
    resetData: () => dispatch(userLoginResetter)
  })
);

const enhance = compose(connectToRedux);

const LoginComponent = ({ loginUser, resetData }) => {
  const onFinish = (values) => {
    loginUser(values);
  };
  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true
      }}
      autoComplete="new-password"
      onFinish={onFinish}
    >
      <FormItem
        name="email"
        rules={[
          {
            required: true,
            message: 'Please enter your Email'
          }
        ]}
      >
        <Input size="large" prefix={<MailOutlined />} placeholder="Email" />
      </FormItem>
      <FormItem
        autoComplete="new-password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please enter your Password'
          }
        ]}
      >
        <Input
          autoComplete="new-password"
          size="large"
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </FormItem>
      <FormItem>
        <FormItem name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </FormItem>

        <a className="login-form-forgot" href="/forgot-password">
          Forgot password?
        </a>
      </FormItem>

      <FormItem>
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          Log in
        </Button>
      </FormItem>
      <FormItem>
        <div className="other">
          <Link className="register" href="/register">
            REGISTER NOW
          </Link>
        </div>
      </FormItem>
    </Form>
  );
};
export default enhance(LoginComponent);
