import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import React from 'react'
import './index.less'

const Group: React.FC = () => {
  const onChange = (key: string) => {
    console.log(key)
  }
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: '我创建的群组',
    },
    {
      key: '2',
      label: '我加入的群组',
    },
  ]

  const test = [
    {
      id: '1',
      name: '小程序组',
      icon: '',
    },
    {
      id: '2',
      name: 'web组',
      icon: '',
    },
    {
      id: '3',
      name: '后端组',
      icon: '',
    },
  ]

  return (
    <div className="groupContent">
      <Tabs defaultActiveKey="1" items={tabItems} onChange={onChange}></Tabs>
      <div className="groupList">
        {test.map((item) => {
          return (
            <div key={item.id} className="groupListItem">
              <div className="icon"></div>
              <div className="itemName">{item.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Group
