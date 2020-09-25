import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Radio, Typography } from "antd";
import {
  UserOutlined,
  LockOutlined,
  AuditOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import Link from "next/link";
const { Title } = Typography;
const FormItem = Form.Item;
const styles = {
  colStyle: { padding: "0 8px" },
  titleStyle: { fontWeight: 500 },
};

const RegisterComponent = () => {
  const [role, setRole] = useState(1);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <Row align="middle" justify="center">
      <Col sm={20} md={10}>
        <Form
          autoComplete="new-password"
          className="register-form"
          onFinish={onFinish}
          initialValues={{
            isBuyer: role,
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
                required: true,
              },
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
          <Row align="middle">
            <Col style={styles.colStyle} span={12}>
              <div className="label">Email:</div>
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
                    message: "Please enter your phone",
                  },
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
          <Row align="middle">
            <Col style={styles.colStyle} span={12}>
              <div className="label">First Name:</div>
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
                  placeholder="Please enter your first name"
                />
              </FormItem>
            </Col>
            <Col style={styles.colStyle} span={12}>
              <div className="label">Last Name:</div>
              <FormItem
                name="last-name"
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
                  placeholder="Please enter your last name"
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="middle">
            <Col style={styles.colStyle} span={12}>
              <div className="label">Password:</div>
              <FormItem
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please set login password",
                  },
                ]}
              >
                <Input
                  autoComplete="new-password"
                  size="large"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Please set login password"
                />
              </FormItem>
            </Col>
            <Col style={styles.colStyle} span={12}>
              <div className="label">Confirm Password:</div>
              <FormItem
                name="re-password"
                rules={[
                  {
                    required: true,
                    message: "Please set login password",
                  },
                ]}
              >
                <Input
                  autoComplete="new-password"
                  size="large"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Please set login password"
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="middle">
            <Col style={styles.colStyle} span={24}>
              <div className="label">Company Name:</div>
              <FormItem
                name="companyName"
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
                    message: "Enter the company address",
                  },
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
          <Row align="middle">
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
export default RegisterComponent;
