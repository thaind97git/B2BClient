import { Dropdown, Menu } from "antd";
import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
const { SubMenu, Item } = Menu;
const AllCategoryComponent = () => {
  const [visible, setVisible] = useState(false);
  const menu = (
    <Menu>
      <Item key="1">Bags & Shoes </Item>
      <SubMenu title="Health,Beauty & Body">
        <Item>Lip Care</Item>
        <Item>Products for Men</Item>
        <Item>Feminine Hygiene & Sexual Assistance</Item>
        <Item>Teeth care</Item>
        <Item>Makeup Accessories</Item>
      </SubMenu>
      <SubMenu title="Health,Beauty & Body">
        <Item>Lip Care</Item>
        <Item>Products for Men</Item>
        <Item>Feminine Hygiene & Sexual Assistance</Item>
        <Item>Teeth care</Item>
        <Item>Makeup Accessories</Item>
      </SubMenu>
      <SubMenu title="Health,Beauty & Body">
        <Item>Lip Care</Item>
        <Item>Products for Men</Item>
        <Item>Feminine Hygiene & Sexual Assistance</Item>
        <Item>Teeth care</Item>
        <Item>Makeup Accessories</Item>
      </SubMenu>
      <SubMenu title="Health,Beauty & Body">
        <Item>Lip Care</Item>
        <Item>Products for Men</Item>
        <Item>Feminine Hygiene & Sexual Assistance</Item>
        <Item>Teeth care</Item>
        <Item>Makeup Accessories</Item>
      </SubMenu>
    </Menu>
  );
  return (
    <Dropdown
      overlay={menu}
      onVisibleChange={(flag) => {
        setVisible(flag);
      }}
      visible={visible}
    >
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        All Categories <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default AllCategoryComponent;
