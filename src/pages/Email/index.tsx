import { Button, Flex } from 'antd'
import React, { useState } from 'react'
import EmailList from './components/EmailList'
import TabList from './components/TabList'
import './index.less'

const Email: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tabClick = (tabNum: number) => {
    console.log('tabNum', tabNum)
    setActiveTab(tabNum)
  }

  return (
    <div>
      <div>
        <Flex gap="small" wrap="wrap">
          <Button>写邮件</Button>
          <Button>回复</Button>
          <Button>删除</Button>
        </Flex>
      </div>
      <div className="content">
        <TabList tabClick={tabClick}></TabList>
        <EmailList activeTab={activeTab}></EmailList>
      </div>
    </div>
  )
}

export default Email
