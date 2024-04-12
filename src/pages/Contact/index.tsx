import React, { useState } from 'react'
import Group from './components/Group'
import Organization from './components/Organization'
import styles from './index.less'

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
    <div className={styles.contactWrapper}>
      <div className={styles.left}>
        <div className={styles.title}>通讯录</div>
        <div className={styles.leftList}>
          {list.map((item) => {
            return (
              <div
                className={`${styles.listItem} ${
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
      <div className={styles.right}>
        {list.find((item) => item.key === activeKey)?.component || ''}
      </div>
    </div>
  )
}

export default Contact
