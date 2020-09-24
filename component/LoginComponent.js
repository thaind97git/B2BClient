import React from "react";
import { Checkbox, Form, Input, Button } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
const FormItem = Form.Item;
const LoginComponent = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <FormItem
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input
          size="large"
          autoComplete="new-password"
          prefix={<MailOutlined />}
          placeholder="Email"
        />
      </FormItem>
      <FormItem
        autoComplete="new-password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input
          autoComplete="dontshow"
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

        <a className="login-form-forgot" href="">
          Forgot password
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
        {/* Or <a href="">register now!</a> */}
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
export default LoginComponent;
