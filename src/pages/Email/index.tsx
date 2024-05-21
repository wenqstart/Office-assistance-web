import LazyComponent from '@/components/LazyComponent/index'
import { deleteTask } from '@/services/task'
import { useModel } from '@umijs/max'
import { Button, Flex } from 'antd'
import React, { useEffect, useState } from 'react'
import EmailEditorDialog from './components/EmailEditorDialog'
import EmailList from './components/EmailList'
import TabList from './components/TabList'
import styles from './index.less'

const Email: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [isShowEmailModal, setIsShowEmailModal] = useState(false)
  const [activeEmailId, setActiveEmailId] = useState('')
  const [deleteStatus, setDeleteStatus] = useState(false)
  const { userInfo } = useModel('user', (model: any) => ({
    userInfo: model.userInfo,
  }))
  const { socketInit } = useModel('taskSocket')
  const tabClick = (tabNum: number) => {
    setActiveTab(tabNum)
  }

  const showEmailEditor = () => {
    setIsShowEmailModal(true)
  }

  const closeModal = (val: boolean) => {
    setIsShowEmailModal(val)
  }

  const deleteBtn = async () => {
    const { code } = await deleteTask(userInfo.id, activeEmailId)
    if (code === 200) {
      setActiveEmailId('')
      setDeleteStatus(!deleteStatus)
    }
  }

  const onSelectEmailItem = (id) => {
    setActiveEmailId(id)
  }

  useEffect(() => {
    socketInit(`task/${userInfo.id}`)
  }, [])

  return (
    <div className={styles.emailContainer}>
      <div>
        <Flex gap="small" wrap="wrap">
          <Button onClick={showEmailEditor}>发布任务</Button>
          {/* <Button>回复</Button> */}
          <Button onClick={deleteBtn}>删除任务</Button>
        </Flex>
      </div>
      <div className={styles.content}>
        <TabList tabClick={tabClick}></TabList>
        <EmailList
          deleteStatus={deleteStatus}
          activeTab={activeTab}
          onSelectEmailItem={onSelectEmailItem}
        ></EmailList>
      </div>
      <LazyComponent>
        <EmailEditorDialog
          isShowModal={isShowEmailModal}
          onClose={closeModal}
        />
      </LazyComponent>
    </div>
  )
}

export default Email
