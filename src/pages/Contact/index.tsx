import React, { useState } from 'react'
import Group from './components/Group'
import Organization from './components/Organization'
import './index.less'

const Contact: React.FC = () => {
  const list = [
    {
      key: 'organization',
      text: '组织架构',
      icon: '',
      component: <Organization></Organization>,
    },
    {
      key: 'group',
      text: '我的群组',
      icon: '',
      component: <Group></Group>,
    },
  ]
  const [activeKey, setActiveKey] = useState(list[0].key)

  const clickItem = (key: string) => {
    setActiveKey(key)
  }

  return (
    <div className="contactWrapper">
      <div className="left">
        <div className="title">通讯录</div>
        <div className="leftList">
          {list.map((item) => {
            return (
              <div
                className={`listItem ${
                  item.key === activeKey ? 'activeItem' : ''
                }`}
                key={item.key}
                onClick={() => clickItem(item.key)}
              >
                {item.text}
              </div>
            )
          })}
        </div>
      </div>
      <div className="right">
        <div className="rightHeader">
          <div className="headerTitle">
            {list.find((item) => item.key === activeKey)?.text || ''}
          </div>
        </div>
        <div className="content">
          {list.find((item) => item.key === activeKey)?.component || ''}
        </div>
      </div>
    </div>
  )
}

export default Contact
