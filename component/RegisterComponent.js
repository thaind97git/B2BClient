import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Radio } from "antd";
import {
  UserOutlined,
  LockOutlined,
  AuditOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import Link from "next/link";
const FormItem = Form.Item;
const RegisterComponent = () => {
  const [role, setRole] = useState(1);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <Row align="middle" justify="center">
      <Col sm={12} md={8}>
        <Form
          className="register-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Row align="middle">
            <Col className="label" span={8}>
              Please select trade role:
            </Col>
            <Col span={16}>
              <Radio.Group
                onChange={(e) => setRole(e.target.value)}
                value={role}
              >
                <Radio value={1}>Buyer</Radio>
                <Radio value={2}>Supplier</Radio>
              </Radio.Group>
            </Col>
          </Row>
          <Row align="middle">
            <Col className="label" span={8}>
              Email:
            </Col>
            <Col span={16}>
              <FormItem
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter Email",
                  },
                ]}
              >
                <Input
                  size="large"
                  autoComplete="new-password"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Email will be used as Login ID"
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="middle">
            <Col className="label" span={8}>
              Password:
            </Col>
            <Col span={16}>
              <FormItem
                autoComplete="new-password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please set login password",
                  },
                ]}
              >
                <Input
                  autoComplete="dontshow"
                  size="large"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Please set login password"
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="middle">
            <Col className="label" span={8}>
              Confirm password:
            </Col>
            <Col span={16}>
              <FormItem
                autoComplete="new-password"
                name="re-password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your login password again",
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Please enter your login password again"
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="middle">
            <Col className="label" span={8}>
              Company Name:
            </Col>
            <Col span={16}>
              <FormItem
                name="company-name"
                rules={[
                  {
                    required: true,
                    message: "Enter the company name",
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<AuditOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Must be a legally registered company"
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="middle">
            <Col className="label" span={8}>
              First Name:
            </Col>
            <Col span={16}>
              <FormItem
                name="first-name"
                rules={[
                  {
                    required: true,
                    message: "Please enter your first name",
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Please enter your first name"
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="middle">
            <Col className="label" span={8}>
              Last Name:
            </Col>
            <Col span={16}>
              <FormItem
                autoComplete="new-password"
                name="company-name"
                rules={[
                  {
                    required: true,
                    message: "Please enter your last name",
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Please enter your last name"
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="middle">
            <Col className="label" span={8}>
              Tel:
            </Col>
            <Col span={16}>
              <FormItem
                name="tel"
                rules={[
                  {
                    required: true,
                    message: "Please enter your phone",
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<PhoneOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Please enter your phone"
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="middle" justify="center">
            <Col span={8}></Col>
            <Col span={16}>
              <Row justify="center">
                <Button
                  // style={{ margin: "auto" }}
                  size="large"
                  className="submit"
                  type="primary"
                  htmlType="submit"
                >
                  Register
                </Button>
              </Row>
              <Row style={{ marginTop: 12 }} justify="center">
                Existing Account? <span>&nbsp;</span>
                <div className="login">
                  <Link href="/login">LOGIN</Link>
                </div>
              </Row>
            </Col>
          </Row>
          {/* <Row align="middle">
            <Col className="label" span={8}></Col>
            <Col span={16}></Col>
          </Row> */}
        </Form>
      </Col>
    </Row>
  );
};
export default RegisterComponent;
