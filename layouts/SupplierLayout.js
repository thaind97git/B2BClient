import React, { Fragment, useEffect, useState } from 'react';

import {
  Layout,
  Menu,
  Row,
  Dropdown,
  Divider,
  Badge,
  Space,
  Typography
} from 'antd';
import {
  DownOutlined,
  LoginOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PicLeftOutlined,
  BellOutlined,
  FileDoneOutlined,
  FallOutlined,
  MessageOutlined
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
  GetNotificationData
} from '../stores/NotificationState';
import { SUPPLIER } from '../enums/accountRoles';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const SUPPLIER_MENU = [
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
    label: 'Product Listing',
    link: '/supplier/product/listing'
  },
  {
    key: '3',
    icon: <FallOutlined />,
    label: 'Available reverse auctions',
    link: '/supplier/bidding',
    subMenu: []
  },
  {
    key: '5',
    icon: <FileDoneOutlined />,
    label: 'Order',
    link: '/supplier/order'
  },
  {
    key: '6',
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
    link: '/supplier/feedback'
  }
];

const connectToRedux = connect(
  createStructuredSelector({
    notificationData: GetNotificationData
  }),
  (dispatch) => ({
    getNotification: ({ pageIndex, pageSize }) =>
      dispatch(getNotification({ pageIndex, pageSize }))
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
            group || request || reverseAuction || invitation || {};
          const { label, link } = getLabelNotify({
            type: (notificationType || {}).id,
            id,
            role: SUPPLIER,
            title
          });
          return (
            <Fragment>
              <Menu.Item key={notifyId}>
                <a href={link}>{label}</a>
              </Menu.Item>
              <Menu.Divider />
            </Fragment>
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
  isChat,
  getNotification,
  notificationData
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [openMessage, setOpenMessage] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [menuNotify, setMenuNotify] = useState([]);
  const [notifyCount, setNotifyCount] = useState(null);
  useEffect(() => {
    if (firstTime) {
      getNotification({});
      setFirstTime(false);
    }
  }, [getNotification, firstTime]);

  useEffect(() => {
    if (notificationData) {
      setMenuNotify(notificationData.data);
    }
  }, [notificationData, firstTime]);

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
      console.log({ newCountBeforeCheck: newCount });
      if (newCount) {
        console.log({ newCountAfterCheck: newCount });
        setNotifyCount((prev) => {
          console.log({ prev });
          console.log(prev + newCount);
          return 10;
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
                    height={collapsed ? 32 : 32}
                    style={{ margin: '16px 0px' }}
                  /> */}
                </a>
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
                    overlay={getMenuNotify(menuNotify || [])}
                    onVisibleChange={setOpenMessage}
                    visible={openMessage}
                    trigger={['click']}
                  >
                    {notifyCount ? (
                      <Badge style={{ cursor: 'pointer' }} count={notifyCount}>
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
                height: isChat ? 'calc(100vh - 64px - 48px)' : 'auto',
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
