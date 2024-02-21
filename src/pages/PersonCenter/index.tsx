import { FC, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import UserInfo from './UserInfo';
import ChangePwd from './ChangePwd';
import { Page } from '@/components';

interface PageProps {}

const PersonCenter: FC<PageProps> = (props: any) => {
  const [defaultActiveKey, setDefaultActiveKey] = useState('userInfo');

  useEffect(() => {
    if (props?.location?.state?.tabKey) {
      setDefaultActiveKey(props.location.state.tabKey);
    }
  }, [props]);
  return (
    <Page>
      <Tabs activeKey={defaultActiveKey} onChange={(value: string) => setDefaultActiveKey(value)}>
        <Tabs.TabPane key="userInfo" tabKey="userInfo" tab="个人信息">
          <UserInfo />
        </Tabs.TabPane>
        <Tabs.TabPane key="changepwd" tabKey="changepwd" tab="修改密码">
          <ChangePwd />
        </Tabs.TabPane>
      </Tabs>
    </Page>
  );
};

export default PersonCenter;
