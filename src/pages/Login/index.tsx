import { Tabs } from 'antd';
import LoginForm from './components/login-form';
import styles from './index.less';

const LoginPage: React.FC = () => {
  // const { name } = useModel('global');
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tab 1',
      children: <LoginForm />,
    },
  ];
  function handleChange(e) {
    console.log('e', e);
  }
  return (
    <div className={styles.login}>
      <div className={styles.login_mask}></div>
      <div className={styles.login_box}>
        <div className={styles.login_box_left}>
          <div className={styles.login_box_left_logo}>
            <i className="iconfont icon-circulation"></i>
          </div>
          <div className={styles.login_box_left_tip}>
            <ul>
              <li>多人协作在线编辑器-Multi Person Online Editor</li>
              <li>支持Word、Excel、TXT、Markdown等多文件类型</li>
              <li>效率高、低成本、时效性、多版本控制</li>
            </ul>
          </div>
        </div>
        <div className={styles.login_box_form}>
          <Tabs defaultActiveKey="1" items={items} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
