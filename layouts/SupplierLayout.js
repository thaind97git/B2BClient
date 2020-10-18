import React, { useState } from "react";

import { Layout, Menu, Row, Dropdown, Divider, Badge, Space } from "antd";
import {
  DownOutlined,
  LoginOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ExperimentOutlined,
  OrderedListOutlined,
  PicLeftOutlined,
  WechatOutlined,
  BellOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import MemberNavComponent from "../component/MemberNavComponent";
import { currentPath } from "../utils";
import Link from "next/link";
import { removeToken } from "../libs/localStorage";
import Router from "next/router";

const { Header, Content, Sider } = Layout;

const SUPPLIER_MENU = [
  // {
  //   key: "1",
  //   icon: <UserOutlined />,
  //   label: "Dashboard",
  //   link: "/supplier",
  //   subMenu: [],
  // },
  {
    key: "4",
    icon: <WechatOutlined />,
    label: "Chat",
    link: "/supplier/chat",
    subMenu: [],
  },
  {
    key: "2",
    icon: <PicLeftOutlined />,
    label: "Product",
    link: undefined,
    subMenu: [
      {
        subKey: "2.1",
        subLink: "/supplier/product/register",
        subIcon: <ShoppingCartOutlined />,
        subLabel: "Product Register",
      },
      {
        subKey: "2.2",
        subLink: "/supplier/product/listing",
        subIcon: <OrderedListOutlined />,
        subLabel: "Product Listing",
      },
    ],
  },
  {
    key: "3",
    icon: <ExperimentOutlined />,
    label: "Available Bidding",
    link: "/supplier/bidding",
    subMenu: [],
  },
];

const PROFILE_MENU = (
  <Menu>
    <Menu.Item>
      <Link href="/supplier/user-profile">
        <a>Profile</a>
      </Link>
    </Menu.Item>
    <Menu.Item>
      <a href="#">Company Profile</a>
    </Menu.Item>
    <Menu.Item
      danger
      onClick={() => {
        removeToken();
        Router.push("/login");
      }}
    >
      <LoginOutlined /> Sign out
    </Menu.Item>
  </Menu>
);
const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="#">Message 01</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="1">
      <a href="#">Message 02</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">Message 03</Menu.Item>
  </Menu>
);
const SupplierLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [openMessage, setOpenMessage] = useState(false);
  return (
    <div
      style={{
        background: "#f8f8f8",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <div className="">
        <Layout>
          <Sider
            style={{ minHeight: "100vh" }}
            trigger={null}
            collapsible
            collapsed={collapsed}
          >
            <Row style={{ minHeight: 64 }} justify="center" align="middle">
              <Link href="/">
                <a
                  style={{
                    fontSize: 13,
                    transform: `scale(${collapsed ? 1 : 1.5})`,
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
            <MemberNavComponent path={currentPath()} menus={SUPPLIER_MENU} />
          </Sider>

          <Layout style={{ background: "#f8f8f8" }} className="site-layout">
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
                    overlay={menu}
                    onVisibleChange={setOpenMessage}
                    visible={openMessage}
                    trigger={["click"]}
                  >
                    <Badge style={{ cursor: "pointer" }} count={3}>
                      <BellOutlined />
                    </Badge>
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
                margin: "24px 16px",
                padding: 24,
                minHeight: 280,
                background: "#fff",
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

export default SupplierLayout;
