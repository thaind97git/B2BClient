import React, { useState } from "react";
import { Form, Button } from "antd";
import { connect } from "react-redux";
/*import { createStructuredSelector } from "reselect";
import { userLogin, userLoginDataSelector } from "../stores/UserState";*/
import { compose } from "redux";
import { Descriptions, Row, Avatar, Col, Divider, Modal } from 'antd';

import UserProfileEditComponent from "./UserProfileEditComponent";
import { render } from "less";

const FormItem = Form.Item;

const connectToRedux = connect(
  /*createStructuredSelector({
      userLoginData: userLoginDataSelector,
  }),
  (dispatch) => ({
      loginUser: ({ email, password }) =>
          dispatch(userLogin({ email, password })),
  })*/
);


const enhance = compose(connectToRedux);

const USER_PROFILE =
{
  "email": "duyquanghoang27@gmail.com",
  "firstName":"Duy",
  "lastName":"Quang",
  "companyName": "B2S Corp",
  "address": "string",
  "phoneNumber": "0919727775",
  "isEmailVerified": false,
  "fax": "None",
  "alternativeEmail": "None",
  "mobile":"None"
}
const UserProfileComponent = () => {

  const [visible, setVisible] = useState(false);

  const showModal = () => {

    console.log('show');
    setVisible(true);
  };

  const handleOk = e => {
    console.log('ok');
    setVisible(false);
  };

  const handleCancel = e => {
    console.log('cancel');
    setVisible(false);
  };
  return (
    <Form>
      <Row span={24}>
        <Col span={4}>
          <div>
            <Avatar size={120} src="/static/images/avatar.png" />
          </div>
        </Col>
        <Col span={20}>
          <Descriptions title={USER_PROFILE.firstName+" "+USER_PROFILE.lastName} extra={<Button type="primary" onClick={showModal}>Edit</Button>} column={1}>
            <Descriptions.Item label="at">{USER_PROFILE.companyName}</Descriptions.Item>
            <Descriptions.Item label="Email">{USER_PROFILE.email}
              {
                (
                  () => {
                    if (USER_PROFILE.isEmailVerified) {
                      return <font color='green'> [Verified]</font>;
                    }
                    else {
                      return <font color='red'> [Unverified]</font>;
                    }
                  }
                )
                  ()}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Divider dashed />
      <Descriptions title="Contact Information">
        <Descriptions.Item label="Email">{USER_PROFILE.email}</Descriptions.Item>
        <Descriptions.Item label="Alternative Email">{USER_PROFILE.alternativeEmail}</Descriptions.Item>
        <Descriptions.Item label="Fax">{USER_PROFILE.fax}</Descriptions.Item>
        <Descriptions.Item label="Mobile">{USER_PROFILE.mobile}</Descriptions.Item>
        <Descriptions.Item label="Telephone">{USER_PROFILE.phoneNumber}</Descriptions.Item>
        <Descriptions.Item label="Address">{USER_PROFILE.address}</Descriptions.Item>
      </Descriptions>
      <Divider dashed />
      <Descriptions title="Company Information">
        <Descriptions.Item label="Email">{USER_PROFILE.email}</Descriptions.Item>
        <Descriptions.Item label="Telephone">{USER_PROFILE.phoneNumber}</Descriptions.Item>
        <Descriptions.Item label="Address">{USER_PROFILE.address}</Descriptions.Item>
      </Descriptions>
      <Modal
        title="Basic Information"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <UserProfileEditComponent />
      </Modal>
    </Form>
  );

};
export default enhance(UserProfileComponent);
