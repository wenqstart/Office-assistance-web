import { Page } from '@/components'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd';

import { FC, useEffect, useState } from 'react'
import ChangePwd from './ChangePwd'
import UserInfo from './UserInfo'

const PersonCenter: FC = (props: any) => {
  const [activeKey, setActiveKey] = useState('userInfo')
  const items: TabsProps['items'] = [
    {
      key: 'userInfo',
      label: '个人信息',
      children: <UserInfo />,
    },
    {
      key: 'changepwd',
      label: '修改密码',
      children: <ChangePwd />,
    },
  ]
  useEffect(() => {
    if (props?.location?.state?.tabKey) {
      setActiveKey(props.location.state.tabKey)
    }
  }, [props])
  return (
    <Page>
      <Tabs
        activeKey={activeKey}
        items={items}
        onChange={(value: string) => setActiveKey(value)}
      />
    </Page>
  )
}

export default PersonCenter
