import React, { useState, useRef, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
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
  Input,
  Space
} from 'antd';
import { UploadOutlined, LockOutlined } from '@ant-design/icons';
import UserProfileEditComponent from "./UserProfileEditComponent";
import { createStructuredSelector } from 'reselect';
import {
  CurrentUserData,
  userUploadAvatar,
  userUpdatePassword,
  UserUpdatePasswordData,
  UserUpdatePasswordResetter,
  UserUpdatePasswordError,
  getUser,
  getUserData,
  getUserResetter,
  userUpdateAccount,
  UserUpdateAccountData,
  UserUpdateAccountError,
  UserUpdateAccountResetter,
  getCurrentUser,
  CurrentUserResetter,
} from '../stores/UserState';
import {
  acceptFileMimes,
  acceptFileTypes,
  openNotification,
  getCurrentUserImage
} from '../utils';
import ImgCrop from 'antd-img-crop';
import UserStatusComponent from './Utils/UserStatusComponent';
import { U_BANNED } from '../enums/accountStatus';
import { BUYER, MODERATOR } from '../enums/accountRoles';
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
    currentUser: CurrentUserData,
    getUserData: getUserData,
    updatePasswordData: UserUpdatePasswordData,
    updateAccountData: UserUpdateAccountData
  }),
  (dispatch) => ({
    uploadAvatar: (fileList) => dispatch(userUploadAvatar(fileList)),
    updatePassword: ({ oldPassword, newPassword }) =>
      dispatch(userUpdatePassword({ oldPassword, newPassword })),
    updateAccount: ({ firstName, lastName, phone, address, companyName }) =>
      dispatch(
        userUpdateAccount({
          firstName,
          lastName,
          phone,
          address,
          companyName
        })
      ),
    getCurrentUser: () => dispatch(getCurrentUser({})),
    getUser: (id) => dispatch(getUser(id)),
    resetCurrentUser: () => dispatch(CurrentUserResetter),
    resetGetUser: () => dispatch(getUserResetter),
    resetUpdatePassword: () => dispatch(UserUpdatePasswordResetter),
    resetUpdateAccount: () => dispatch(UserUpdateAccountResetter)
  })
);

const UserProfileComponent = ({
  isDrawer,
  userId,
  currentUser,
  uploadAvatar,
  updatePassword,
  getUser,
  getUserData,
  resetGetUser,
  isAdmin = false,
  updatePasswordData,
  resetUpdatePassword,
  updateAccount,
  updateAccountData,
  resetUpdateAccount,
  resetCurrentUser,
  getCurrentUser,
  role = BUYER
}) => {
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [updateProfileVisible, setUpdateProfileVisible] = useState(false);
  const [updateProfile, setUpdateProfile] = useState({});
  const [imageUrl, setImageUrl] = useState(
    currentUser.avatar
      ? getCurrentUserImage(currentUser.id)
      : '/static/images/avatar.png'
  );
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState({
    previewVisible: false,
    previewImage: ''
  });
  const updatePasswordRef = useRef();
  const [fileList, setList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: imageUrl
    }
  ]);
  useEffect(() => {
    if (userId) {
      setLoading(true);
      getUser(userId);
    }
  }, [userId, getUser]);

  useEffect(() => {
    if (getUserData) {
      setLoading(false);
    }
  }, [getUserData]);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    if (updatePasswordData) {
      resetUpdatePassword();
      setChangePasswordVisible(false);
      const form = updatePasswordRef.current;
      console.log(form);
      form.resetFields();
    }
  }, [updatePasswordData]);

  useEffect(() => {
    if (updateAccountData) {
      resetUpdateAccount();
      //resetCurrentUser();
      getCurrentUser();
      setUpdateProfileVisible(false);
    }
  }, [updateAccountData]);

  const showChangePasswordModal = () => {
    setChangePasswordVisible(true);
  };

  const showUpdateProfileModal = () => {
    setUpdateProfileVisible(true);
  };

  useEffect(() => {
    return () => {
      resetGetUser();
    };
  }, [resetGetUser]);

  useEffect(() => {
    return () => {
      resetUpdatePassword();
    };
  }, [resetUpdatePassword]);

  useEffect(() => {
    return () => {
      resetUpdateAccount();
    };
  }, [resetUpdateAccount]);

  useEffect(() => {
    return () => {
      resetCurrentUser();
    };
  }, [resetCurrentUser]);

  const handleChangePasswordOk = () => {
    updatePasswordRef.current.submit();
  };
  //handle User Password Edit Cancel
  const handleChangePasswordCancel = () => {
    setChangePasswordVisible(false);
  };

  //Finish Update Password form
  const onUpdatePasswordFinish = (values) => {
    updatePassword({
      oldPassword: values[`old-password`],
      newPassword: values[`new-password`]
    });
  };

  const checkNewPassword = (rule, value = {}) => {
    const form = updatePasswordRef.current;
    if (!value || form.getFieldValue('new-password') === value) {
      return Promise.resolve();
    }
    return Promise.reject('Confirm password not match !');
  };

  //handle After upload avatar
  const handleAvatarChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    if (fileList.length > 0) {
      fileList[fileList.length - 1].status = 'done';
    }
    uploadAvatar(fileList);
    setList(fileList);
  };

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
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    });
  };

  //handle User Profile Edit Cancel
  const handleUpdateCancel = () => {
    setUpdateProfileVisible(false);
  };

  //handle User Profile Edit OK
  const handleUpdateOK = () => {
    updateAccount(updateProfile);
  };

  if (isDrawer) {
    const {
      id,
      address,
      companyName,
      email,
      firstName,
      lastName,
      phoneNumber,
      userStatus = {},
      bannedReason,
      avatar
    } = getUserData || {};
    if (loading) {
      return <Skeleton active />;
    }
    return (
      <Row span={24}>
        <Col span={6}>
          <Avatar
            size={120}
            src={avatar ? getCurrentUserImage(id) : '/static/images/avatar.png'}
          />
        </Col>
        <Col span={18}>
          <Descriptions title={firstName + ' ' + lastName} column={1}>
            {(isAdmin || role === MODERATOR) && (
              <Descriptions.Item label="at">{companyName}</Descriptions.Item>
            )}
            <Descriptions.Item label="Email">{email}</Descriptions.Item>
            {isAdmin && (
              <Fragment>
                <Descriptions.Item label="Account Status">
                  <UserStatusComponent status={userStatus.id} />
                </Descriptions.Item>
                {userStatus.id === U_BANNED && (
                  <Descriptions.Item label="Ban Reason">
                    {bannedReason || 'N/A'}
                  </Descriptions.Item>
                )}
              </Fragment>
            )}
          </Descriptions>
        </Col>
        <Divider />
        <Col span={24}>
          <Title level={5}>
            {role === BUYER
              ? 'Buyer'
              : role === MODERATOR
              ? 'Aggregator'
              : 'Supplier'}{' '}
            Basic Information
          </Title>
        </Col>
        <DescriptionItem title="Email" content={email} />
        <DescriptionItem title="Mobile" content={phoneNumber} />
        <DescriptionItem title="Address" content={address} />
        <Divider />

        <style jsx global>{`
          .site-description-item-profile-wrapper {
            margin-bottom: 7px;
            color: rgba(0, 0, 0, 0.65);
            font-size: 14px;
            line-height: 1.5715;
          }

          [data-theme='compact'] .site-description-item-profile-wrapper {
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

          [data-theme='compact']
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
  } else {
    const {
      address,
      avatar,
      companyName,
      email,
      firstName,
      lastName,
      phoneNumber,
      userStatus = {}
    } = currentUser || {};
    return (
      <Form>
        <Row span={24}>
          <Col span={4} align="left">
            <div>
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
                    openNotification('error', {
                      message: `We just accept file type for ${acceptFileTypes}`
                    });
                    return false;
                  }}
                  onChange={handleAvatarChange}
                  fileList={fileList}
                  onPreview={handlePreview}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  showUploadList={{ showRemoveIcon: false }}
                >
                  <Button icon={<UploadOutlined />}>Update</Button>
                </Upload>
              </ImgCrop>
            </div>
          </Col>
          <Col span={20}>
            <Descriptions
              title={firstName + ' ' + lastName}
              extra={
                <Space>
                  <Button type="primary" onClick={showUpdateProfileModal}>
                    Update Profile
                  </Button>
                  <Button type="primary" onClick={showChangePasswordModal}>
                    Change Password
                  </Button>
                </Space>
              }
              column={1}
            >
              <Descriptions.Item label="at">
                {companyName || 'None'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {email || 'None'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Divider dashed />
        <Descriptions title="Contact Information">
          <Descriptions.Item label="Email">{email || 'None'}</Descriptions.Item>
          <Descriptions.Item label="Mobile">
            {phoneNumber || 'None'}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {address || 'None'}
          </Descriptions.Item>
        </Descriptions>
        <Divider dashed />
        <Modal
          title="Change Password"
          visible={changePasswordVisible}
          onOk={handleChangePasswordOk}
          onCancel={handleChangePasswordCancel}
          destroyOnClose={true}
        >
          <Form
            autoComplete="new-password"
            className="register-form"
            ref={updatePasswordRef}
            onFinish={onUpdatePasswordFinish}
          >
            <Row align="middle">
              <Col span={24}>
                <div className="label">Old Password:</div>
                <FormItem
                  name="old-password"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your old login password'
                    }
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
                      message: 'Please set your new login password'
                    }
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
                      message: 'Your confirm login password not match',
                      validator: checkNewPassword
                    }
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
          title={'Your Avatar'}
          footer={null}
          onCancel={handlePreviewCancel}
        >
          <img
            alt="example"
            style={{ width: '100%' }}
            src={preview.previewImage}
          />
        </Modal>
        <Modal
          visible={updateProfileVisible}
          title={'Update Profile'}
          onCancel={handleUpdateCancel}
          destroyOnClose={true}
          onOk={handleUpdateOK}
        >
          <UserProfileEditComponent
            setUpdateProfileForm={(updateProfile = {}) => {
              setUpdateProfile(updateProfile);
            }}
          />
        </Modal>
        <style jsx global>{`
          .avatar-uploader .ant-upload-list-picture-card {
            display: flex;
            flex-direction: column;
          }
          .avatar-uploader .ant-upload .ant-btn {
            top: -35px;
            visibility: visible;
          }
          .avatar-uploader .ant-upload-select-picture-card {
            visibility: hidden;
          }
        `}</style>
      </Form>
    );
  }
};
export default connectToRedux(UserProfileComponent);
