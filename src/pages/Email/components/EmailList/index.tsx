import MySkeleton from '@/components/MySkeleton/index'
import {
  getDraftList,
  getUserReceivedTask,
  getUserSendedTask,
} from '@/services/task'
import { useModel } from '@umijs/max'
import React, { useEffect, useState } from 'react'
import EmailDetail from '../EmailDetail'
import { EmailListItem, type TEmaliData } from '../EmailListItem'
import styles from './index.less'

type TEmailListProp = {
  activeTab: number
}

enum TaskListType {
  RECEIVED_TASK = 0, // 收件箱
  DRAFTS_TASK = 1, // 草稿箱
  SENDED_TASK = 2, // 已发送
  DELETED_TASK = 3, // 已删除
}

const EmailList: React.FC = (props: TEmailListProp) => {
  const { activeTab, onSelectEmailItem } = props

  const [activeEmail, setActiveEmail] = useState(-1)
  const [emailId, setEmailId] = useState('')
  const { userInfo } = useModel('user', (model: any) => ({
    userInfo: model.userInfo,
  }))
  const [loading, setLoading] = useState(false)
  const [currentEmailList, setCurrentEmailList] = useState<TEmaliData[]>([])

  const emailStateHandler = (listData: any[]) => {
    setEmailId(listData[0]?.id ?? '')
    onSelectEmailItem(listData[0]?.id ?? '')
    setCurrentEmailList(
      listData.map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        subtitle: item.publisher,
        desc: item.updateTime ?? '',
      })),
    )
  }

  const _getUserReceivedTask = async () => {
    setLoading(true)
    const { data } = await getUserReceivedTask(userInfo.id, 10, 1)
    setLoading(false)
    emailStateHandler(data.records ?? [])
  }

  const _getUserSendedTask = async () => {
    setLoading(true)
    const { data } = await getUserSendedTask(userInfo.id, 10, 1)
    setLoading(false)
    emailStateHandler(data.records ?? [])
  }

  const _getDraftList = async () => {
    setLoading(true)
    const { data } = await getDraftList(userInfo.id)
    setLoading(false)
  }

  useEffect(() => {
    setCurrentEmailList([])
    switch (activeTab) {
      case TaskListType.RECEIVED_TASK:
        _getUserReceivedTask()
        break
      case TaskListType.DRAFTS_TASK:
        _getDraftList()
        break
      case TaskListType.SENDED_TASK:
        _getUserSendedTask()
        break
      case TaskListType.DELETED_TASK:
        console.log(TaskListType.DELETED_TASK)
        break
      default:
        return
    }
  }, [activeTab])

  const clickItem = (i: number, id: string) => {
    setActiveEmail(i)
    setEmailId(id)
    onSelectEmailItem(id)
  }

  return (
    <div className={styles.container}>
      <div className={styles.emailList}>
        <MySkeleton loading={loading} count={4}></MySkeleton>
        {!loading && !currentEmailList.length && (
          <div className={styles.emptyContent}>暂无内容</div>
        )}
        {!loading &&
          currentEmailList.map((item, i) => (
            <EmailListItem
              key={i}
              onClick={() => clickItem(i, item.id)}
              selected={i === activeEmail}
              emailData={item}
            ></EmailListItem>
          ))}
      </div>
      {activeEmail > -1 && emailId && (
        <EmailDetail id={emailId} type={activeTab}></EmailDetail>
      )}
    </div>
  )
}

export default EmailList
