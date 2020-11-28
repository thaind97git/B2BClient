import React, { useEffect, useState } from 'react';

import { Layout, Menu, Row, Dropdown, Divider, Badge, Space } from 'antd';
import {
  DownOutlined,
  LoginOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PicLeftOutlined,
  BellOutlined,
  FileDoneOutlined,
  FallOutlined,
  MessageOutlined,
  LogoutOutlined,
  DashboardOutlined
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
import { SUPPLIER } from '../enums/accountRoles';
import NotifyItem from './NotifyItem';
import { CurrentUserData } from '../stores/UserState';

const { Header, Content, Sider } = Layout;

const SUPPLIER_MENU = [
  {
    key: '0',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    link: '/supplier'
  },
  {
    key: '4',
    icon: <MessageOutlined />,
    label: 'Chat',
    link: '/supplier/chat',
    subMenu: []
  },
  {
    key: '2',
    icon: <PicLeftOutlined />,
    label: 'Product Registered',
    link: '/supplier/product/listing'
  },
  {
    key: '3',
    icon: <FallOutlined />,
    label: 'Reverse Auction',
    link: '/supplier/bidding',
    subMenu: []
  },
  {
    key: '5',
    icon: <FileDoneOutlined />,
    label: 'Order',
    link: '/supplier/order'
  }
  // {
  //   key: '6',
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
  //   link: '/supplier/feedback'
  // }
  // {
  //   key: '7',
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
    seenNotification: () => dispatch(seenNotification()),
    resetSeenNotify: () => dispatch(SeenNotificationResetter),
    getNotificationCount: () => dispatch(getNotificationCount())
  })
);

const PROFILE_MENU = (
  <Menu>
    <Menu.Item>
      <Link href="/supplier/user-profile">
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
  isChat,
  getNotification,
  notificationData,
  seenNotification,
  seenNotificationData,
  resetSeenNotify,
  notificationCountData,
  getNotificationCount,
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
    if (firstTime) {
      getNotificationCount();
      getNotification({});
      setFirstTime(false);
    }
  }, [getNotification, firstTime, getNotificationCount]);

  useEffect(() => {
    if (notificationCountData) {
      setNotifyCount(notificationCountData);
    }
  }, [notificationCountData]);

  useEffect(() => {
    if (notificationData) {
      setMenuNotify(notificationData.data);
    }
  }, [notificationData, firstTime]);

  useEffect(() => {
    signalR.onListen('NewNotify', (newNotify) => {
      if (newNotify && newNotify.id) {
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
      resetSeenNotify();
      // signalR.stopConnection();
    };
  }, [resetSeenNotify]);
  if (!currentUserData) {
    return null;
  }
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
            <MemberNavComponent path={currentPath()} menus={SUPPLIER_MENU} />
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
                <Space style={{ marginRight: 24 }}>
                  <Dropdown
                    overlay={
                      <NotifyItem notify={menuNotify || []} role={SUPPLIER} />
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
                height: isChat ? 'calc(100vh - 64px - 48px)' : 'auto',
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
