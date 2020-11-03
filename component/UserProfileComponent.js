import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  Descriptions,
  Row,
  Avatar,
  Col,
  Divider,
  Modal,
  Typography,
  Upload,
  Form,
  Button,
  Skeleton,
  Input
} from "antd";
import { UploadOutlined, LockOutlined } from "@ant-design/icons";
// import UserProfileEditComponent from "./UserProfileEditComponent";
import { createStructuredSelector } from "reselect";
import { CurrentUserData, userUploadAvatar, userUpdatePassword } from "../stores/UserState";
import { acceptFileMimes, acceptFileTypes, openNotification, fallbackImage, getCurrentUserImage } from "../utils";
import ImgCrop from 'antd-img-crop';
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

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const connectToRedux = connect(
  createStructuredSelector({
    currentUser: CurrentUserData
  }),
  (dispatch) => ({
    uploadAvatar: (fileList) =>
      dispatch(userUploadAvatar(fileList)),
    updatePassword: ({oldPassword,newPassword}) =>
      dispatch(userUpdatePassword({oldPassword,newPassword})),
  })
);

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
const UserProfileComponent = ({ isDrawer, userId, currentUser, uploadAvatar, updatePassword }) => {
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(getCurrentUserImage(currentUser.avatar ? currentUser.avatar : fallbackImage));
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState({
    previewVisible: false,
    previewImage: "",
  });
  const updatePasswordRef = useRef();
  const [fileList, setList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: imageUrl
    }
  ]);
  const showChangePasswordModal = () => {
    setChangePasswordVisible(true);
  };

  const handleChangePasswordOk = (e) => {
    updatePasswordRef.current.submit();
  };
  //handle User Profile Edit Cancel
  const handleChangePasswordCancel = (e) => {
    setChangePasswordVisible(false);
  };

  //Finish Update Password form
  const onUpdatePasswordFinish = (values) => {
    updatePassword({ oldPassword: values[`old-password`], newPassword: values[`new-password`] });
    setChangePasswordVisible(false);
  }

  // const checkPassword = (rule, value = {}) => {
  //   if (value.value) {
  //     return Promise.resolve();
  //   }

  //   return Promise.reject("Please enter the password !");
  // };

  const checkNewPassword = (rule, value = {}) => {
    const form = updatePasswordRef.current;
    if (!value || form.getFieldValue("new-password") === value) {
      return Promise.resolve();
    }
    return Promise.reject("Confirm password not match !");
  };

  //handle After upload avatar
  const handleAvatarChange = (info) => {

    // if (info.file.status === 'uploading') {
    //   setLoading(true)
    //   return;
    // }
    // if (info.file.status === 'done') {
    //   // Get this url from response in real world.
    //   getBase64(info.file.originFileObj, imageUrl => {
    //     setImageUrl(imageUrl);
    //     setLoading(false);
    //   }
    //   );
    // }

    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    // 2. Read from response and show file link
    // fileList = fileList.map((file) => {
    //   if (file.response) {
    //     // Component will show file.url as link
    //     file.url = file.response.url;
    //   }
    //   return file;
    // });
    uploadAvatar(fileList);
    setList(fileList);
  };

  if (loading) {
    return <Skeleton active />;
  }

  //Handle Picture Preview
  const handlePreviewCancel = () => setPreview({ previewVisible: false });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreview({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  // const uploadButton = (
  //   <div>
  //     {loading ? <LoadingOutlined /> : <PlusOutlined />}
  //     <div style={{ marginTop: 8 }}>Upload</div>
  //   </div>
  // );

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
          <Col span={4} align="left">
            <div>
              {/* <Avatar size={120} src={getCurrentUserImage(currentUser.avatar)} fallback={fallbackImage} /> */}
              <ImgCrop>
                <Upload
                  name="avatar"
                  accept=".png, .jpg, .jpeg"
                  listType="picture-card"
                  className="avatar-uploader"
                  beforeUpload={(file) => {
                    if (acceptFileMimes.includes(file.type)) {
                      return true;
                    }
                    openNotification("error", {
                      message: `We just accept file type for ${acceptFileTypes}`,
                    });
                    return false;
                  }}
                  onChange={handleAvatarChange}
                  fileList={fileList}
                  onPreview={handlePreview}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                >
                  <Button icon={<UploadOutlined />}>Update</Button>
                </Upload>
              </ImgCrop>
            </div>
          </Col>
          <Col span={20}>
            <Descriptions
              title={currentUser.firstName + " " + currentUser.lastName}
              extra={
                <Button type="primary" onClick={showChangePasswordModal}>
                  Change Password
                </Button>
              }
              column={1}
            >
              <Descriptions.Item label="at">
                {currentUser.companyName ? currentUser.companyName : "None"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {currentUser.email ? currentUser.email : "None"}
                {/* {(() => {
                  if (USER_PROFILE.isEmailVerified) {
                    return <font color="green"> [Verified]</font>;
                  } else {
                    return <font color="red"> [Unverified]</font>;
                  }
                })()} */}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Divider dashed />
        <Descriptions title="Contact Information">
          <Descriptions.Item label="Email">
            {currentUser.email ? currentUser.email : "None"}
          </Descriptions.Item>
          <Descriptions.Item label="Alternative Email">
            {currentUser.alternativeEmail ? currentUser.alternativeEmail : "None"}
          </Descriptions.Item>
          <Descriptions.Item label="Fax">
            {currentUser.fax ? currentUser.fax : "None"}
          </Descriptions.Item>
          <Descriptions.Item label="Mobile">
            {currentUser.phoneNumber ? currentUser.phoneNumber : "None"}
          </Descriptions.Item>
          <Descriptions.Item label="Telephone">
            {currentUser.telephone ? currentUser.telephone : "None"}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {currentUser.address ? currentUser.address : "None"}
          </Descriptions.Item>
        </Descriptions>
        <Divider dashed />
        {/* <Descriptions title="Company Information">
          <Descriptions.Item label="Email">
            {USER_PROFILE.email}
          </Descriptions.Item>
          <Descriptions.Item label="Telephone">
            {USER_PROFILE.telephone}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {USER_PROFILE.address}
          </Descriptions.Item>
        </Descriptions> */}
        <Modal
          title="Change Password"
          visible={changePasswordVisible}
          onOk={handleChangePasswordOk}
          onCancel={handleChangePasswordCancel}
        >
          <Form
            autoComplete="new-password"
            className="register-form"
            ref={updatePasswordRef}
            onFinish={onUpdatePasswordFinish}
          // initialValues={{
          //   isBuyer: role,
          // }}
          >
            <Row align="middle">
              <Col span={24}>
                <div className="label">Old Password:</div>
                <FormItem
                  name="old-password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your old login password",
                    },
                  ]}
                >
                  <Input
                    autoComplete="old-password"
                    size="large"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Please enter your old login password"
                  />
                </FormItem>
              </Col>
              <Col span={24}>
                <div className="label">New Password:</div>
                <FormItem
                  name="new-password"
                  rules={[
                    {
                      required: true,
                      message: "Please set your new login password",
                    },
                  ]}
                >
                  <Input
                    autoComplete="new-password"
                    size="large"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Please set your new login password"
                  />
                </FormItem>
              </Col>
              <Col span={24}>
                <div className="label">Confirm New Password:</div>
                <FormItem
                  name="re-password"
                  rules={[
                    {
                      required: true,
                      message: "Your confirm login password not match",
                      validator: checkNewPassword
                    },
                  ]}
                >
                  <Input
                    autoComplete="re-password"
                    size="large"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Please confirm your new login password"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          visible={preview.previewVisible}
          title={"Your Avatar"}
          footer={null}
          onCancel={handlePreviewCancel}
        >
          <img
            alt="example"
            style={{ width: "100%" }}
            src={preview.previewImage}
          />
        </Modal>
        <style jsx global>{`
          .avatar-uploader .ant-upload-list-picture-card {
            display: flex;
            flex-direction: column;
          }
          .avatar-uploader .ant-upload .ant-btn{
            top: -35px;
            visibility: visible;
          }
          .avatar-uploader .ant-upload-select-picture-card {
            visibility: hidden;
          }
        `}</style>
      </Form>
    );
};
export default connectToRedux(UserProfileComponent);
