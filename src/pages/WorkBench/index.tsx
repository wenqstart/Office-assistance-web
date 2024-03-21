import { Tabs, type TabsProps } from 'antd'
import React, { useState } from 'react'
import AppList from './components/AppList'
import { allAppList, interactionList } from './components/AppList/data'
import styles from './index.less'

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
      <div className={styles.title}>工作台</div>
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
