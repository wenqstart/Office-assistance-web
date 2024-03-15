import { Page } from '@/components'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd';

import { FC, useEffect, useState } from 'react'
import ChangePwd from './ChangePwd'
import UserInfo from './UserInfo'

const PersonCenter: FC = (props: any) => {
  const [defaultActiveKey, setDefaultActiveKey] = useState('userInfo')
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
      setDefaultActiveKey(props.location.state.tabKey)
    }
  }, [props])
  return (
    <Page>
      <Tabs
        activeKey={defaultActiveKey}
        items={items}
        onChange={(value: string) => setDefaultActiveKey(value)}
      />
    </Page>
  )
}

export default PersonCenter
