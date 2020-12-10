import React, { useEffect, useState } from 'react';

import { Layout, Menu, Row, Dropdown, Badge, Space, Divider } from 'antd';
import {
  DownOutlined,
  LoginOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FileDoneOutlined,
  BellOutlined,
  ProfileOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import MemberNavComponent from '../component/MemberNavComponent';
import { currentPath } from '../utils';
import Link from 'next/link';
import { removeToken } from '../libs/localStorage';
import Router from 'next/router';
import SignalR from '../libs/signalR';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getNotification,
  getNotificationCount,
  GetNotificationCountData,
  GetNotificationData,
  seenNotification,
  SeenNotificationData,
  SeenNotificationResetter
} from '../stores/NotificationState';
import { BUYER } from '../enums/accountRoles';
import NotifyItem from './NotifyItem';
import { CurrentUserData } from '../stores/UserState';

const { Header, Content, Sider } = Layout;
const BUYER_MENU = [
  // {
  //   key: "1",
  //   icon: <UserOutlined />,
  //   label: "Dashboard",
  //   link: "/buyer",
  //   subMenu: [],
  // },
  {
    key: '2',
    icon: <ProfileOutlined />,
    label: 'Your RFQ',
    link: '/buyer/rfq',
    subMenu: []
  },
  {
    key: '3',
    icon: <FileDoneOutlined />,
    label: 'Order',
    link: '/buyer/order'
  }
  // {
  //   key: '4',
  //   icon: (
  //     <img
  //       style={{ paddingRight: 10 }}
  //       alt=""
  //       className="imgicon"
  //       src="/static/images/feedback.png"
  //       height={16}
  //     />
  //   ),
  //   label: 'Feedback',
  //   link: '/buyer/feedback'
  // }
  // {
  //   key: '6',
  //   icon: <LogoutOutlined style={{ color: 'red' }} />,
  //   label: 'Logout',
  //   action: () => {
  //     Router.push('/login');
  //     removeToken();
  //   }
  // }
];
const connectToRedux = connect(
  createStructuredSelector({
    notificationData: GetNotificationData,
    seenNotificationData: SeenNotificationData,
    notificationCountData: GetNotificationCountData,
    currentUserData: CurrentUserData
  }),
  (dispatch) => ({
    getNotification: ({ pageIndex, pageSize }) =>
      dispatch(getNotification({ pageIndex, pageSize })),
    getNotificationCount: () => dispatch(getNotificationCount()),
    seenNotification: () => dispatch(seenNotification()),
    resetSeenNotify: () => dispatch(SeenNotificationResetter)
  })
);
const PROFILE_MENU = (
  <Menu>
    <Menu.Item>
      <Link href="/buyer/user-profile">
        <a>Profile</a>
      </Link>
    </Menu.Item>
    <Menu.Item
      danger
      onClick={() => {
        removeToken();
        Router.push('/login');
      }}
    >
      <LoginOutlined /> Sign out
    </Menu.Item>
  </Menu>
);
const signalR = new SignalR({
  hubDomain: 'notificationHub'
});
signalR.startConnection();
const SupplierLayout = ({
  children,
  isVertical = true,
  getNotification,
  notificationData,
  getNotificationCount,
  notificationCountData,
  resetSeenNotify,
  seenNotificationData,
  seenNotification,
  currentUserData,
  hasBackground = true
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [openMessage, setOpenMessage] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [menuNotify, setMenuNotify] = useState([]);
  const [notifyCount, setNotifyCount] = useState(null);

  useEffect(() => {
    if (seenNotificationData) {
      setNotifyCount(0);
      resetSeenNotify();
    }
  }, [seenNotificationData, resetSeenNotify]);

  useEffect(() => {
    return () => {
      setNotifyCount(0);
    };
  }, []);

  useEffect(() => {
    if (firstTime) {
      getNotification({});
      getNotificationCount();
      setFirstTime(false);
    }
  }, [getNotification, firstTime, getNotificationCount]);

  useEffect(() => {
    if (notificationData) {
      setMenuNotify(notificationData.data);
    }
  }, [notificationData]);

  useEffect(() => {
    if (notificationCountData) {
      setNotifyCount(notificationCountData);
    }
  }, [notificationCountData]);

  useEffect(() => {
    signalR.onListen('NewNotify', (newNotify) => {
      if (newNotify && newNotify.id) {
        console.log({ newNotify });
        setMenuNotify((prev) => {
          const tmp = [...prev];
          tmp.unshift(newNotify);
          return tmp;
        });
      }
    });
  }, []);

  useEffect(() => {
    signalR.onListen('NewNotifyCount', (newCount) => {
      if (newCount) {
        setNotifyCount(newCount);
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      // signalR.stopConnection();
      resetSeenNotify();
    };
  }, [resetSeenNotify]);
  return (
    <div
      style={{
        background: '#f8f8f8',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      <div className="">
        <Layout>
          {isVertical && (
            <Sider
              style={{ minHeight: '100vh' }}
              trigger={null}
              collapsible
              collapsed={collapsed}
            >
              <Row style={{ minHeight: 64 }} justify="center" align="middle">
                <Link href="/">
                  <img
                    style={{
                      width: 64,
                      transform: `scale(${collapsed ? 1 : 1.5})`
                    }}
                    src="/static/images/logo.png"
                    alt="B2B Market"
                  />
                </Link>
              </Row>
              <MemberNavComponent path={currentPath()} menus={BUYER_MENU} />
            </Sider>
          )}

          <Layout style={{ background: '#f8f8f8' }} className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
              <Row justify="space-between" align="middle">
                {isVertical ? (
                  collapsed ? (
                    <MenuUnfoldOutlined
                      style={{ marginLeft: 24 }}
                      className="trigger"
                      onClick={() => setCollapsed((prev) => !prev)}
                    />
                  ) : (
                    <MenuFoldOutlined
                      style={{ marginLeft: 24 }}
                      className="trigger"
                      onClick={() => setCollapsed((prev) => !prev)}
                    />
                  )
                ) : (
                  <div></div>
                )}
                <Space style={{ marginRight: 24 }}>
                  <Dropdown
                    overlay={
                      <NotifyItem notify={menuNotify || []} role={BUYER} />
                    }
                    onVisibleChange={setOpenMessage}
                    visible={openMessage}
                    trigger={['click']}
                    placement="bottomCenter"
                  >
                    {notifyCount ? (
                      <Badge
                        onClick={() => {
                          notifyCount !== 0 && seenNotification();
                        }}
                        style={{ cursor: 'pointer' }}
                        count={notifyCount}
                      >
                        <BellOutlined style={{ fontSize: 16 }} />
                      </Badge>
                    ) : (
                      <BellOutlined style={{ fontSize: 16 }} />
                    )}
                  </Dropdown>
                  <Divider type="vertical" />
                  <Dropdown overlay={PROFILE_MENU}>
                    <a
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      Hi, {(currentUserData || {}).firstName}{' '}
                      {(currentUserData || {}).lastName} <DownOutlined />
                    </a>
                  </Dropdown>
                </Space>
              </Row>
            </Header>
            <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: hasBackground ? '#fff' : 'transparent'
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </div>
      <style jsx>
        {`
          #components-layout-demo-custom-trigger .trigger {
            font-size: 18px;
            line-height: 64px;
            padding: 0 24px;
            cursor: pointer;
            transition: color 0.3s;
          }

          #components-layout-demo-custom-trigger .trigger:hover {
            color: #1890ff;
          }

          #components-layout-demo-custom-trigger .logo {
            height: 32px;
            background: rgba(255, 255, 255, 0.2);
            margin: 16px;
          }

          .site-layout .site-layout-background {
            background: #fff;
          }
        `}
      </style>
    </div>
  );
};

export default connectToRedux(SupplierLayout);
