import React from "react";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { LoginOutlined } from "@ant-design/icons";
import { GUEST, SUPPLIER } from "../enums/accountRoles";
const { Item } = Menu;

const MENU_SUPPLIER = (
  <Menu>
    <Item>
      <a href="#">Supplier Information</a>
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
    <Item>
      <a href="#">Create product</a>
    </Item>
    <Item>
      <a href="#">List product</a>
    </Item>
    <Item danger>
      <LoginOutlined /> Sign out
    </Item>
  </Menu>
);

const MENU_BUYER = (
  <Menu>
    <Item>
      <a href="#">Buyer Information</a>
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
    <Item danger>
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
