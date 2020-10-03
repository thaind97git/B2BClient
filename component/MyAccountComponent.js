import React from "react";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { LoginOutlined } from "@ant-design/icons";
import { GUEST, SUPPLIER } from "../enums/accountRoles";
import Link from "next/link";
import { removeToken } from "../libs/localStorage";
import Router from "next/router";
const { Item } = Menu;

const MENU_SUPPLIER = (
  <Menu>
    <Item>
      <Link href="/member">
        <a>Supplier Information</a>
      </Link>
    </Item>
    <Item>
      <Link href="/member">
        <a>Promotion</a>
      </Link>
    </Item>
    <Item>
      <Link href="/member">
        <a href="#">Notification</a>
      </Link>
    </Item>
    <Item>
      <Link href="/member">
        <a href="#">Chats</a>
      </Link>
    </Item>
    <Item>
      <Link href="/member">
        <a href="#">Create product</a>
      </Link>
    </Item>
    <Item>
      <Link href="/member">
        <a href="#">List product</a>
      </Link>
    </Item>
    <Item
      danger
      onClick={() => {
        removeToken();
        Router.push("/login");
      }}
    >
      <LoginOutlined /> Sign out
    </Item>
  </Menu>
);

const MENU_BUYER = (
  <Menu>
    <Item>
      <Link href="/member">
        <a href="#">Buyer Information</a>
      </Link>
    </Item>
    <Item>
      <a href="#">Promotion</a>
    </Item>
    <Item>
      <a href="#">Notification</a>
    </Item>
    <Item>
      <a href="#">Chats</a>
    </Item>
    <Item
      danger
      onClick={() => {
        removeToken();
        Router.push("/login");
      }}
    >
      <LoginOutlined /> Sign out
    </Item>
  </Menu>
);
const MyAccountComponent = ({ role = SUPPLIER }) => {
  if (role === GUEST) {
    return null;
  }
  return (
    <Dropdown overlay={role === SUPPLIER ? MENU_SUPPLIER : MENU_BUYER}>
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        My Account <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default MyAccountComponent;
