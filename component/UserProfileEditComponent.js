import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Radio, Typography } from "antd";
import { connect } from 'react-redux';
import {
  UserOutlined,
  LockOutlined,
  AuditOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import {
  CurrentUserData
} from '../stores/UserState';
import { createStructuredSelector } from 'reselect';
import Link from "next/link";
const { Title } = Typography;
const FormItem = Form.Item;
const styles = {
  colStyle: { padding: "0 8px" },
  titleStyle: { fontWeight: 500 },
};

const connectToRedux = connect(
  createStructuredSelector({
    currentUser: CurrentUserData,
  })
);

const UserProfileEditComponent = ({currentUser, setUpdateProfileForm }) => {
  const [form] = Form.useForm();
  
  const onValuesChange =() => {
    const updateProfile = {
      firstName: form.getFieldValue('firstName'),
      lastName: form.getFieldValue('lastName'),
      phone: form.getFieldValue('phoneNumber'),
      address: form.getFieldValue('address'),
      companyName: form.getFieldValue('companyName'),
      fax: form.getFieldValue('fax')
    };
    setUpdateProfileForm(updateProfile);
  }

  return (
    <Row align="middle" justify="center">
      <Col>
        <Form
          form={form}
          autoComplete="new-password"
          className="register-form"
          initialValues={currentUser}
          onValuesChange={onValuesChange}
        >
          <Row align="middle">
            <Col style={styles.colStyle} span={12}>
              <div className="label">
                <span style={{ color: 'red' }}>*</span> First Name:
              </div>
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
                  size="large"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Please enter your first name"
                />
              </FormItem>
            </Col>
            <Col style={styles.colStyle} span={12}>
              <div className="label">
                <span style={{ color: 'red' }}>*</span> Last Name:
              </div>
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
                  size="large"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Please enter your last name"
                />
              </FormItem>
            </Col>
          </Row>

          <Row align="middle">
            <Col style={styles.colStyle} span={24}>
              <div className="label">
                <span style={{ color: 'red' }}>*</span> Phone Number:
              </div>
              <FormItem
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your phone'
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
          <Row align="middle">
            <Col style={styles.colStyle} span={24}>
              <div className="label">
                Fax:
              </div>
              <FormItem
                name="fax"
              >
                <Input
                  size="large"
                  prefix={<PhoneOutlined className="site-form-item-icon" />}
                  placeholder="Please enter your fax number"
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="middle">
            <Col style={styles.colStyle} span={24}>
              <div className="label">
                <span style={{ color: 'red' }}>*</span> Company Name:
              </div>
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
              <div className="label">
                <span style={{ color: 'red' }}>*</span> Address:
              </div>
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
        </Form>
      </Col>
    </Row>
  );
};
export default connectToRedux(UserProfileEditComponent);