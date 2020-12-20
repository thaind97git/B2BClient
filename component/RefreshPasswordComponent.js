import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
    userUpdatePasswordByCode,
    userUpdatePasswordByCodeResetter,
    userUpdatePasswordByCodeError
} from "../stores/UserState";
import { compose } from "redux";
import { openNotification } from "../utils";
import { useRouter } from "next/router";
const FormItem = Form.Item;

const connectToRedux = connect(
    createStructuredSelector({
        userUpdateError: userUpdatePasswordByCodeError,
    }),
    (dispatch) => ({
        updatePassword: ({email,password,code}) =>
            dispatch(userUpdatePasswordByCode({email,password,code})),
        resetData: () => dispatch(userUpdatePasswordByCodeResetter),
    })
);

const enhance = compose(connectToRedux);

const RefreshPasswordComponent = ({ updatePassword, userUpdateError, resetData }) => {
    const router = useRouter();
    const email = router.query.email;
    const onFinish = (values) => {
        let object = {email:email,password:values.password,code:values.activeCode};
        console.log(object);
        updatePassword(object);
    };
    useEffect(() => {
        return () => {
            resetData();
        };
    }, [resetData]);

    useEffect(() => {
        if (userUpdateError) {
            openNotification("error", { message: userUpdateError });
        }
    }, [userUpdateError]);

    return (
      <Form
        name="normal_login"
        className="login-form"
        autoComplete="new-password"
        onFinish={onFinish}
      >
        <div className="label" style={{ color: 'green' }}>
          We sent an email with Refesh Code to your account!
        </div>
        <br />
        <div className="label">
          <span style={{ color: 'red' }}>*</span> Code
        </div>
        <FormItem
          name="activeCode"
          rules={[
            {
              required: true,
              message: 'Please enter your active code'
            }
          ]}
        >
          <Input
            size="large"
            type="password"
            prefix={<UserOutlined />}
            placeholder="Type your code received from your email"
          />
        </FormItem>
        <div className="label">
          <span style={{ color: 'red' }}>*</span> New Password
        </div>
        <FormItem
          name="password"
          rules={[
            {
              required: true,
              message: 'Please enter your new password'
            }
          ]}
        >
          <Input.Password
            autoComplete="new-password"
            size="large"
            prefix={<UserOutlined />}
            minLength={6}
            placeholder="Type your password"
          />
        </FormItem>
        <div className="label">
          <span style={{ color: 'red' }}>*</span> Re-password
        </div>
        <FormItem
          name="re-password"
          rules={[
            {
              required: true,
              message: 'Please enter your re-password'
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
            minLength={6}
            prefix={<UserOutlined />}
            placeholder="Please confirm your password"
          />
        </FormItem>

        <FormItem>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Next
          </Button>
        </FormItem>
        <FormItem>
          <div className="other">
            Don't have an account? Sign-up here
            <br />
            <Link className="register" href="/register">
              SIGN-UP
            </Link>
          </div>
        </FormItem>
      </Form>
    );
};
export default enhance(RefreshPasswordComponent);
