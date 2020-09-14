import React, { useState } from "react";

import { Layout, Menu, Row, Dropdown } from "antd";
import {
  UserOutlined,
  DownOutlined,
  LoginOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ExperimentOutlined,
  OrderedListOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import MemberNavComponent from "../component/MemberNavComponent";
import { currentPath } from "../utils";
import Link from "next/link";

const { Header, Content, Sider } = Layout;

const SUPPLIER_MENU = [
  {
    key: "1",
    icon: <UserOutlined />,
    label: "Dashboard",
    link: "/member",
    subMenu: [],
  },
  {
    key: "2",
    icon: <ExperimentOutlined />,
    label: "Product",
    link: undefined,
    subMenu: [
      {
        subKey: "2.1",
        subLink: "/member/product/manage",
        subIcon: <OrderedListOutlined />,
        subLabel: "List product",
      },
      {
        subKey: "2.2",
        subLink: "/member/product/create",
        subIcon: <PlusOutlined />,
        subLabel: "Create product",
      },
    ],
  },
];

const PROFILE_MENU = (
  <Menu>
    <Menu.Item>
      <a href="#">Profile</a>
    </Menu.Item>
    <Menu.Item>
      <a href="#">Company Profile</a>
    </Menu.Item>
    <Menu.Item danger>
      <LoginOutlined /> Sign out
    </Menu.Item>
  </Menu>
);

const MemberLayout = ({ children, MENUS = SUPPLIER_MENU }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      style={{
        background: "#f8f8f8",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <div className="container">
        <Layout>
          <Sider
            style={{ minHeight: "100vh" }}
            trigger={null}
            collapsible
            collapsed={collapsed}
          >
            <Row style={{ minHeight: 64 }} justify="center" align="middle">
              <Link href="/">
                <a>
                  <img
                    alt="B2BMarket"
                    src="/static/images/logo.png"
                    height={collapsed ? 16 : 32}
                    style={{ margin: "16px 0px" }}
                  />
                </a>
              </Link>
            </Row>
            <MemberNavComponent path={currentPath()} menus={MENUS} />
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
                <div style={{ marginRight: 24 }}>
                  <Dropdown overlay={PROFILE_MENU}>
                    <a
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      My Account <DownOutlined />
                    </a>
                  </Dropdown>
                </div>
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

export default MemberLayout;
