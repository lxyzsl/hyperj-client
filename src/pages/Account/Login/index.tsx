import {message, Tabs } from 'antd';
import React from 'react';
import { Link,history, useModel } from 'umi';
import Footer from '@/components/Footer';
import styles from './index.less';
import Storage from '@/constants/storage'
import LoginWithPassword from './LoginWithPassword';
import LoginWithMobileCode from './LoginWithMobileCode';

const { TabPane } = Tabs;

/** 此方法会跳转到 redirect 参数所在的位置 */
const goto = () => {
  if (!history) return;
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    history.push(redirect || '/');
  }, 10);
};

const Login: React.FC = () => {

  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      setInitialState({
        ...initialState,
        currentUser: userInfo,
      });
    }
  };

  /**
   * 登录成功
   * @param data 用户登录数据
   */
  const loginComplete = async (token:string) => {
    localStorage.setItem(Storage.TOKEN_KEY, token);
    await fetchUserInfo();
    message.success('登录成功！');
    goto();
  }



  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.main}>
          <div className={styles.slogan}>
            <Link to="/">
            <img
              className={styles.sloganImage}
              src="/logo-2.png"
            />
            </Link>
          </div>
          <div className={styles.form}>
            <Tabs>
            <TabPane tab="密码登录" key="1">
              <LoginWithPassword onCompleted={loginComplete}></LoginWithPassword>
            </TabPane>
            <TabPane tab="验证码登录" key="2">
              <LoginWithMobileCode onCompleted={loginComplete} ></LoginWithMobileCode>
            </TabPane>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
