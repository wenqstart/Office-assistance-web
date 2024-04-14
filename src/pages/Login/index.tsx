import { Image, Tabs } from 'antd';
import * as React from 'react';
import { useMemo } from 'react';
import { useModel, useLocation } from '@umijs/max';
import circulation from '../../assets/login/circulation.svg';
import LoginForm from './components/login-form';
import RegisterForm from './components/register-form';
import styles from './index.less';

const LoginPage: React.FC = () => {
  const { isLogin } = useModel('Login.login');
  console.log('isLogin', isLogin);
  const { search } = useLocation();
  let searchParams = new URLSearchParams(search);
  console.log('searchParams', searchParams.get('backUrl'));
  const loginItems = [
    {
      key: '1',
      label: '登录',
      children: <LoginForm backUrl={searchParams.get('backUrl')}/>,
    },
  ];
  const registerItems = [
    {
      key: '2',
      label: '注册',
      children: <RegisterForm/>,
    },
  ];
  const renderItems = useMemo(() => {
    return isLogin ? loginItems : registerItems;
  }, [isLogin]);
  return (
    <div className={`${styles.login} `}>
      <div className={styles.login_mask}></div>
      <div className={styles.login_box}>
        <div className={styles.login_box_left}>
          <div className={styles.login_box_left_logo}>
            <Image width={150} src={circulation} preview={false} />
          </div>
          <div className={styles.login_box_left_tip}>
            <ul>
              <li>办公辅助系统-Office auxiliary system</li>
              <li>支持任务发布、学生任务反馈等</li>
              <li>高效率、低成本、时效性、多人协同合作</li>
            </ul>
          </div>
        </div>
        <div
          className={`${styles.login_box_form} ${
            isLogin ? styles.fadeIn : styles.fadeOut
          }`}
        >
          <Tabs defaultActiveKey="1" items={renderItems} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
