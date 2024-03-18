import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import * as React from 'react'
import { useState } from 'react'

import AppList from './components/AppList'
import { allAppList, interactionList } from './components/AppList/data'

const WorkBench: React.FC = () => {
  const items: TabsProps['items'] = [
    {
      key: 'allApp',
      label: '全部应用',
      children: <AppList appListData={allAppList} />,
    },
    {
      key: 'interaction',
      label: '教学互动',
      children: <AppList appListData={interactionList} />,
    },
  ]
  const [activeKey, setActiveKey] = useState('allApp')

  return (
    <div>
      <div>工作台</div>
      <Tabs
        onChange={(value: string) => setActiveKey(value)}
        items={items}
        activeKey={activeKey}
        type="card"
      />
    </div>
  )
}

export default WorkBench
