import { Input } from 'antd'
import * as React from 'react'
import { useState, useEffect } from 'react'
import UserChat from './components/userChat'
import ViewList from './components/viewList'
import styles from './index.less'
import { useModel } from '@umijs/max'

const { Search } = Input

const Contact: React.FC = () => {
  const [searchLoading, setSearchLoading] = useState(false)
  const { cleanChatId } = useModel('websocket')
  useEffect(() => {
    cleanChatId()
  }, [])

  return (
    <div className={styles.contact}>
      {/* 左侧联系人列表 */}
      <div className={styles.viewList}>
        <h3>消息列表</h3>
        <Search
          className={styles.search}
          placeholder="搜索联系人"
          allowClear
          loading={searchLoading}
        />
        <ViewList />
      </div>
      <div className={styles.userChat}>
        <UserChat />
      </div>
    </div>
  )
}

export default Contact
