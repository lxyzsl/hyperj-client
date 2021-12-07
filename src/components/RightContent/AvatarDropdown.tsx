import React, { useCallback } from "react";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Menu, Spin } from "antd";
import { history, useModel } from "umi";
import { stringify } from "querystring";
import HeaderDropdown from "../HeaderDropdown";
import styles from "./index.less";
// import { outLogin } from "@/services/ant-design-pro/api";
import type { MenuInfo } from "rc-menu/lib/interface";
import URL from '@/constants/url'
import Storage from '@/constants/storage'



export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  // await outLogin();
  const { query = {}, search, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== URL.LOGIN_URL && !redirect) {
    history.replace({
      pathname: URL.LOGIN_URL,
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel("@@initialState");

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === "logout") {
        localStorage.setItem(Storage.USER_INFO_KEY, "")
        localStorage.setItem(Storage.TOKEN_KEY, "")
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState]
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.user.userName) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={currentUser.user.avatar || './icons/icon-128x128.png'}
          alt="avatar"
        />
        <span className={`${styles.name} anticon`}>{currentUser.user.userName}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
