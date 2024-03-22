import { Button, Flex } from 'antd'
import React, { useState } from 'react'
import EmailEditorDialog from './components/EmailEditorDialog'
import EmailList from './components/EmailList'
import TabList from './components/TabList'
import './index.less'

const Email: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [isShowEmailModal, setIsShowEmailModal] = useState(false)

  const tabClick = (tabNum: number) => {
    setActiveTab(tabNum)
  }

  const showEmailEditor = () => {
    setIsShowEmailModal(true)
  }
  const closeModal = (val: boolean) => {
    setIsShowEmailModal(val)
  }

  return (
    <div className="emailContainer">
      <div>
        <Flex gap="small" wrap="wrap">
          <Button onClick={showEmailEditor}>写邮件</Button>
          <Button>回复</Button>
          <Button>删除</Button>
        </Flex>
      </div>
      <div className="content">
        <TabList tabClick={tabClick}></TabList>
        <EmailList activeTab={activeTab}></EmailList>
      </div>
      <EmailEditorDialog isShowModal={isShowEmailModal} onClose={closeModal} />
    </div>
  )
}

export default Email
