import React, { useState } from "react";

import { Layout, Menu, Row, Dropdown } from "antd";
import {
  DownOutlined,
  LoginOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  OrderedListOutlined,
  FormOutlined,
  BulbOutlined,
  SolutionOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import MemberNavComponent from "../component/MemberNavComponent";
import { currentPath } from "../utils";
import Link from "next/link";
import { removeToken } from "../libs/localStorage";
import Router from "next/router";

const { Header, Content, Sider } = Layout;

const ADMIN_MENU = [
  {
    key: "1",
    icon: <BulbOutlined />,
    label: "Product",
    link: undefined,
    subMenu: [
      {
        subKey: "1.1",
        subLink: "/admin/product",
        subIcon: <OrderedListOutlined />,
        subLabel: "Product List",
      },
      {
        subKey: "1.2",
        subLink: "/admin/product/create",
        subIcon: <FormOutlined />,
        subLabel: "Create New Product",
      },
    ],
  },
  {
    key: "2",
    icon: <TeamOutlined />,
    label: "Supplier",
    link: "/admin/supplier",
  },
  {
    key: "3",
    icon: <SolutionOutlined />,
    label: "Buyer",
    link: "/admin/buyer",
  },
];

const PROFILE_MENU = (
  <Menu>
    <Menu.Item>
      <Link href="/admin/user-profile">
        <a>Profile</a>
      </Link>
    </Menu.Item>
    <Menu.Item>
      <a href="#">Company Profile</a>
    </Menu.Item>
    <Menu.Item
      onClick={() => {
        removeToken();
        Router.push("/login");
      }}
      danger
    >
      <LoginOutlined /> Sign out
    </Menu.Item>
  </Menu>
);

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
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
                </a>
              </Link>
            </Row>
            <MemberNavComponent path={currentPath()} menus={ADMIN_MENU} />
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

export default AdminLayout;
