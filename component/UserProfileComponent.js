import React, { useState } from "react";
import { Form, Button } from "antd";
import { connect } from "react-redux";
/*import { createStructuredSelector } from "reselect";
import { userLogin, userLoginDataSelector } from "../stores/UserState";*/
import { compose } from "redux";
import {
  Descriptions,
  Row,
  Avatar,
  Col,
  Divider,
  Modal,
  Typography,
} from "antd";

import UserProfileEditComponent from "./UserProfileEditComponent";
import { render } from "less";
const { Title } = Typography;
const DescriptionItem = ({ title, content }) => (
  <Col span={24}>
    <Row className="site-description-item-profile-wrapper">
      <Col span={8}>
        <p className="site-description-item-profile-p-label">{title}:</p>
      </Col>
      <Col span={16}>
        <b>{content}</b>
      </Col>
    </Row>
  </Col>
);

const FormItem = Form.Item;

const connectToRedux = connect();
/*createStructuredSelector({
      userLoginData: userLoginDataSelector,
  }),
  (dispatch) => ({
      loginUser: ({ email, password }) =>
          dispatch(userLogin({ email, password })),
  })*/

const enhance = compose(connectToRedux);

const USER_PROFILE = {
  email: "duyquanghoang27@gmail.com",
  firstName: "Duy",
  lastName: "Quang",
  companyName: "B2S Corp",
  address: "string",
  telephone: "0919727775",
  isEmailVerified: false,
  fax: "None",
  alternativeEmail: "None",
  mobile: "None",
  tradeTerms: "FOB",
  certifi: "ISO/TS16949",
};
const UserProfileComponent = ({ isDrawer, userId }) => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    console.log("show");
    setVisible(true);
  };

  const handleOk = (e) => {
    console.log("ok");
    setVisible(false);
  };

  const handleCancel = (e) => {
    console.log("cancel");
    setVisible(false);
  };
  if (isDrawer) {
    return (
      <Row span={24}>
        <Col span={6}>
          <Avatar size={120} src="/static/images/avatar.png" />
        </Col>
        <Col span={18}>
          <Descriptions
            title={USER_PROFILE.firstName + " " + USER_PROFILE.lastName}
            column={1}
          >
            <Descriptions.Item label="at">
              {USER_PROFILE.companyName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {USER_PROFILE.email}
              {(() => {
                if (USER_PROFILE.isEmailVerified) {
                  return <font color="green"> [Verified]</font>;
                } else {
                  return <font color="red"> [Unverified]</font>;
                }
              })()}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Divider />
        <Col span={24}>
          <Title level={5}>Supplier Basic Information</Title>
        </Col>
        <DescriptionItem title="Email" content={USER_PROFILE.email} />
        <DescriptionItem
          title="Alternative Email"
          content={USER_PROFILE.alternativeEmail}
        />
        <DescriptionItem title="Fax" content={USER_PROFILE.fax} />
        <DescriptionItem title="Mobile" content={USER_PROFILE.mobile} />
        <DescriptionItem title="Telephone" content={USER_PROFILE.telephone} />
        <DescriptionItem title="Address" content={USER_PROFILE.address} />
        <Divider />
        <Col span={24}>
          <Title level={5}>Company Information</Title>
        </Col>
        <DescriptionItem
          title="Certifications"
          content={USER_PROFILE.certifi}
        />
        <DescriptionItem title="Trade Term" content={USER_PROFILE.tradeTerms} />
        <Divider />

        <style jsx global>{`
          .site-description-item-profile-wrapper {
            margin-bottom: 7px;
            color: rgba(0, 0, 0, 0.65);
            font-size: 14px;
            line-height: 1.5715;
          }

          [data-theme="compact"] .site-description-item-profile-wrapper {
            font-size: 24px;
            line-height: 1.66667;
          }

          .ant-drawer-body p.site-description-item-profile-p {
            display: block;
            margin-bottom: 16px;
            color: rgba(0, 0, 0, 0.85);
            font-size: 16px;
            line-height: 1.5715;
          }

          [data-theme="compact"]
            .ant-drawer-body
            p.site-description-item-profile-p {
            font-size: 14px;
            line-height: 1.66667;
          }

          .site-description-item-profile-p-label {
            display: inline-block;
            margin-right: 8px;
            color: rgba(0, 0, 0, 0.85);
          }
        `}</style>
      </Row>
    );
  } else
    return (
      <Form>
        <Row span={24}>
          <Col span={4}>
            <div>
              <Avatar size={120} src="/static/images/avatar.png" />
            </div>
          </Col>
          <Col span={20}>
            <Descriptions
              title={USER_PROFILE.firstName + " " + USER_PROFILE.lastName}
              extra={
                <Button type="primary" onClick={showModal}>
                  Edit
                </Button>
              }
              column={1}
            >
              <Descriptions.Item label="at">
                {USER_PROFILE.companyName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {USER_PROFILE.email}
                {(() => {
                  if (USER_PROFILE.isEmailVerified) {
                    return <font color="green"> [Verified]</font>;
                  } else {
                    return <font color="red"> [Unverified]</font>;
                  }
                })()}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Divider dashed />
        <Descriptions title="Contact Information">
          <Descriptions.Item label="Email">
            {USER_PROFILE.email}
          </Descriptions.Item>
          <Descriptions.Item label="Alternative Email">
            {USER_PROFILE.alternativeEmail}
          </Descriptions.Item>
          <Descriptions.Item label="Fax">{USER_PROFILE.fax}</Descriptions.Item>
          <Descriptions.Item label="Mobile">
            {USER_PROFILE.mobile}
          </Descriptions.Item>
          <Descriptions.Item label="Telephone">
            {USER_PROFILE.telephone}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {USER_PROFILE.address}
          </Descriptions.Item>
        </Descriptions>
        <Divider dashed />
        <Descriptions title="Company Information">
          <Descriptions.Item label="Email">
            {USER_PROFILE.email}
          </Descriptions.Item>
          <Descriptions.Item label="Telephone">
            {USER_PROFILE.telephone}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {USER_PROFILE.address}
          </Descriptions.Item>
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
