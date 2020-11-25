import { Menu, Modal } from 'antd';
import React, { useState } from 'react';
import Link from 'next/link';
import { isServer } from '../utils';
const { SubMenu } = Menu;
const findMenuByPath = (path, menuItem = []) =>
  menuItem.find((item) => item.link === path);

const findSubMenuByPath = (path, subItemArray = []) =>
  subItemArray.find((item) => item.subLink === path);

const getOpenKeys = (path, menus) => {
  let openKeysSelected;
  const subMenu = findMenuByPath(path, menus);
  if (subMenu !== undefined) {
    openKeysSelected = subMenu.key;
  } else {
    for (let item of menus) {
      const subItem = findSubMenuByPath(path, item.subMenu);
      if (subItem !== undefined) {
        openKeysSelected = item.key;
      }
    }
  }
  return [openKeysSelected];
};

const getDefaultKeys = (path, menus) => {
  let openDefaultKeys;

  const subMenu = findMenuByPath(path, menus);
  if (subMenu !== undefined) {
    openDefaultKeys = subMenu.key;
  }
  if (subMenu === undefined) {
    for (let item of menus) {
      const subItem = findSubMenuByPath(path, item.subMenu);
      if (subItem !== undefined) {
        openDefaultKeys = subItem.subKey;
      }
    }
  }
  return [openDefaultKeys];
};

const MemberNavComponent = ({ path, menus = [] }) => {
  const [openKeys, setOpenKeys] = useState(getOpenKeys(path, menus));
  const rootSubMenuKeys = menus.map((item) => {
    return item.subKey;
  });
  if (isServer) {
    return null;
  }
  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      defaultSelectedKeys={getDefaultKeys(path, menus)}
      onOpenChange={(keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (rootSubMenuKeys.indexOf(latestOpenKey) === -1) {
          setOpenKeys(keys);
        } else {
          setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
      }}
    >
      {menus.map((menu) => {
        if (!menu.subMenu || menu.subMenu.length === 0) {
          return typeof menu.action === 'function' ? (
            <Menu.Item
              onClick={() => {
                typeof menu.action === 'function' &&
                  Modal.confirm({
                    title: 'Are you sure you want to log out ?',
                    okText: 'Yes',
                    cancelText: 'No',
                    onOk: () => {
                      menu.action();
                    }
                  });
              }}
              key={menu.key}
              icon={menu.icon}
            >
              <a>{menu.label}</a>
            </Menu.Item>
          ) : (
            <Menu.Item key={menu.key} icon={menu.icon}>
              <Link href={!!menu.link ? menu.link : ''}>
                <a>{menu.label}</a>
              </Link>
            </Menu.Item>
          );
        }
        return (
          <SubMenu key={menu.key} icon={menu.icon} title={menu.label}>
            {menu.subMenu.map((subMenu) => {
              return (
                <Menu.Item key={subMenu.subKey} icon={subMenu.subIcon}>
                  <Link href={!!subMenu.subLink ? subMenu.subLink : ''}>
                    <a>{subMenu.subLabel}</a>
                  </Link>
                </Menu.Item>
              );
            })}
          </SubMenu>
        );
      })}
    </Menu>
  );
};

export default MemberNavComponent;
