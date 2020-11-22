import React, { useEffect, useState } from 'react';

import {
  Layout,
  Menu,
  Row,
  Dropdown,
  Badge,
  Space,
  Divider,
  Typography
} from 'antd';
import {
  DownOutlined,
  LoginOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FileDoneOutlined,
  FallOutlined,
  BellOutlined,
  CustomerServiceOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import MemberNavComponent from '../component/MemberNavComponent';
import { currentPath, getLabelNotify } from '../utils';
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
  GetNotificationData
} from '../stores/NotificationState';
import { BUYER } from '../enums/accountRoles';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
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
    link: '/buyer/feedback'
  }
];
const connectToRedux = connect(
  createStructuredSelector({
    notificationData: GetNotificationData,
    notificationCountData: GetNotificationCountData
  }),
  (dispatch) => ({
    getNotification: ({ pageIndex, pageSize }) =>
      dispatch(getNotification({ pageIndex, pageSize })),
    getNotificationCount: () => dispatch(getNotificationCount())
  })
);
const PROFILE_MENU = (
  <Menu>
    <Menu.Item>
      <Link href="/buyer/user-profile">
        <a>Profile</a>
      </Link>
    </Menu.Item>
    {/* <Menu.Item>
      <a href="#">Company Profile</a>
    </Menu.Item> */}
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
const getMenuNotify = (notify = []) => {
  return (
    <Menu style={{ width: 360, maxHeight: '90vh', overflowY: 'scroll' }}>
      <Menu.ItemGroup title={<Title level={4}>Notification</Title>}>
        {notify.map((item) => {
          const {
            group = {},
            invitation = {},
            request = {},
            reverseAuction = {},
            notificationType = {},
            id: notifyId
          } = item || {};
          const { id, description: title } =
            group || request || reverseAuction || invitation;
          const { label, link } = getLabelNotify({
            type: notificationType.id,
            id,
            role: BUYER,
            title
          });
          return (
            <Menu.Item
              onClick={() => Router.push(link)}
              className="dropdown-notify"
              key={notifyId}
            >
              {label}
              <Menu.Divider />
            </Menu.Item>
          );
        })}
      </Menu.ItemGroup>
    </Menu>
  );
};
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
  notificationCountData
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [openMessage, setOpenMessage] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [menuNotify, setMenuNotify] = useState([]);
  const [notifyCount, setNotifyCount] = useState(null);

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
    signalR.onListen('newNotify', (newNotify) => {
      console.log({ newNotify });
      if (newNotify && newNotify.length > 0) {
        setMenuNotify((prev) => {
          const tmp = [...prev];
          tmp.unshift(newNotify);
          return tmp;
        });
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      signalR.stopConnection();
    };
  }, []);
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
                  <a
                    style={{
                      fontSize: 13,
                      transform: `scale(${collapsed ? 1 : 1.5})`
                    }}
                  >
                    B2B Market
                    {/* <img
                    alt="B2BMarket"
                    src="/static/images/logo.png"
                    height={collapsed ? 16 : 32}
                    style={{ margin: "16px 0px" }}
                  /> */}
                  </a>
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
                    overlay={getMenuNotify(menuNotify || [])}
                    onVisibleChange={setOpenMessage}
                    visible={openMessage}
                    trigger={['click']}
                  >
                    {notifyCount ? (
                      <Badge style={{ cursor: 'pointer' }} count={notifyCount}>
                        <BellOutlined />
                      </Badge>
                    ) : (
                      <BellOutlined />
                    )}
                  </Dropdown>
                  <Divider type="vertical" />
                  <Dropdown overlay={PROFILE_MENU}>
                    <a
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      My Account <DownOutlined />
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

export default connectToRedux(SupplierLayout);
