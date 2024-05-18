import { Input } from 'antd'
import * as React from 'react'
import { useState } from 'react'
import UserChat from './components/userChat'
import ViewList from './components/viewList'
import styles from './index.less'

const { Search } = Input

const Contact: React.FC = () => {
  const [searchLoading, setSearchLoading] = useState(false)
  const [keyWord, setKeyWord] = useState('')
  function onSearch(params: any) {
    setKeyWord(params)
  }
  return (
    <div className={styles.contact}>
      {/* 左侧联系人列表 */}
      <div className={styles.viewList}>
        <h3>消息列表</h3>
        <Search
          className={styles.search}
          placeholder="搜索联系人"
          allowClear
          onSearch={onSearch}
          loading={searchLoading}
        />
        <ViewList keyWord={keyWord} />
      </div>
      <div className={styles.userChat}>
        <UserChat />
      </div>
    </div>
  )
}

export default Contact
