import React, { useEffect, useState } from 'react';

import { Layout, Menu, Row, Dropdown, Badge, Divider } from 'antd';
import {
  DownOutlined,
  LoginOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  OrderedListOutlined,
  AppstoreAddOutlined,
  SolutionOutlined,
  TeamOutlined,
  DashboardOutlined,
  BellOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import MemberNavComponent from '../component/MemberNavComponent';
import { currentPath } from '../utils';
import Link from 'next/link';
import { removeToken } from '../libs/localStorage';
import Router from 'next/router';
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
import SignalR from '../libs/signalR';
import NotifyItem from './NotifyItem';
import { ADMIN } from '../enums/accountRoles';
import { CurrentUserData } from '../stores/UserState';

const { Header, Content, Sider } = Layout;

const ADMIN_MENU = [
  {
    key: '0',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    link: '/admin'
  },
  {
    key: '1',
    icon: <AppstoreAddOutlined />,
    label: 'Product',
    link: '/admin/product'
  },
  {
    key: '5',
    icon: <OrderedListOutlined />,
    label: 'Category',
    link: '/admin/category'
  },
  {
    key: '2',
    icon: <TeamOutlined />,
    label: 'Supplier',
    link: '/admin/supplier'
  },
  {
    key: '3',
    icon: <SolutionOutlined />,
    label: 'Buyer',
    link: '/admin/buyer'
  },
  {
    key: '4',
    icon: (
      <img
        style={{ paddingRight: 10 }}
        alt=""
        className="imgicon"
        src="/static/images/feedback.png"
        height={16}
      />
    ),
    label: 'Feedback',
    link: '/admin/feedback'
  },
  {
    key: '7',
    icon: <LogoutOutlined style={{ color: 'red' }} />,
    label: 'Logout',
    action: () => removeToken(),
    link: '/login'
  }
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
      <Link href="/admin/user-profile">
        <a>Profile</a>
      </Link>
    </Menu.Item>
    <Menu.Item
      onClick={() => {
        removeToken();
        Router.push('/login');
      }}
      danger
    >
      <LoginOutlined /> Sign out
    </Menu.Item>
  </Menu>
);
const signalR = new SignalR({
  hubDomain: 'notificationHub'
});
signalR.startConnection();
const AdminLayout = ({
  children,
  getNotification,
  notificationData,
  getNotificationCount,
  notificationCountData,
  resetSeenNotify,
  seenNotificationData,
  seenNotification,
  currentUserData
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
          <Sider
            style={{ minHeight: '100vh' }}
            trigger={null}
            collapsible
            collapsed={collapsed}
          >
            <Row style={{ minHeight: 64 }} justify="center" align="middle">
              <Link href="/">
                <a
                  style={{
                    fontSize: 13,
                    transform: `scale(${collapsed ? 1 : 1.5})`
                  }}
                >
                  B2B Market
                </a>
              </Link>
            </Row>
            <MemberNavComponent path={currentPath()} menus={ADMIN_MENU} />
          </Sider>

          <Layout style={{ background: '#f8f8f8' }} className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
              <Row justify="space-between" align="middle">
                {collapsed ? (
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
                )}
                <div style={{ marginRight: 24 }}>
                  <Dropdown
                    overlay={
                      <NotifyItem notify={menuNotify || []} role={ADMIN} />
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
                </div>
              </Row>
            </Header>
            <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: '#fff'
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

export default connectToRedux(AdminLayout);
