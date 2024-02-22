import * as React from 'react';
import { useMemo } from 'react';
import { useModel } from 'umi';
import { Tabs, Image } from 'antd';
import LoginForm from './components/login-form';
import RegisterForm from './components/register-form';
import styles from './index.less';
import circulation from '../../assets/login/circulation.svg'; 

const LoginPage: React.FC = () => {
  const { isLogin } = useModel('login')
  const loginItems = [
    {
      key: '1',
      label: '登录',
      children: <LoginForm />,
    },
  ];
  const registerItems = [
    {
      key: '2',
      label: '注册',
      children: <RegisterForm />,
    },
  ];
  const renderItems = useMemo(() => {
    return isLogin ? loginItems : registerItems
  }, [isLogin])
  return (
    <div className={styles.login}>
      <div className={styles.login_mask}></div>
      <div className={styles.login_box}>
        <div className={styles.login_box_left}>
          <div className={styles.login_box_left_logo}>
          <Image width={150} src={circulation} preview={false}/>
          </div>
          <div className={styles.login_box_left_tip}>
            <ul>
              <li>办公辅助系统-Office auxiliary system</li>
              <li>支持Word、Excel、TXT、Markdown等多文件类型</li>
              <li>效率高、低成本、时效性、多版本控制</li>
            </ul>
          </div>
        </div>
        <div className={styles.login_box_form}>
          <Tabs defaultActiveKey="1" items={renderItems} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
