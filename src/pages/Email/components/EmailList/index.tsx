import { getUserReceivedTask } from '@/services/task'
import React, { useEffect, useState } from 'react'
import EmailDetail from '../EmailDetail'
import EmailListItem from '../EmailListItem'
import styles from './index.less'

type TEmailListProp = {
  activeTab: number
}

enum TaskListType {
  RECEIVED_TASK = 0,
  DRAFTS_TASK = 1,
  SENDED_TASK = 2,
  DELETED_TASK = 3,
}

const EmailList: React.FC = (props: TEmailListProp) => {
  const { activeTab } = props
  const [activeEmail, setActiveEmail] = useState(0)

  const test = [
    {
      type: 0,
      title: 'xx老师',
      subtitle: 'xx作业',
      desc: 'xx任务',
    },
    {
      type: 1,
      title: 'xx老师',
      subtitle: 'xx公告',
      desc: 'xx内容',
    },
  ]

  const _getUserReceivedTask = async () => {
    const { data } = await getUserReceivedTask()
  }
  useEffect(() => {
    switch (activeTab) {
      case TaskListType.RECEIVED_TASK:
        console.log(TaskListType.RECEIVED_TASK)
        break
      case TaskListType.DRAFTS_TASK:
        console.log(TaskListType.DRAFTS_TASK)
        break
      case TaskListType.SENDED_TASK:
        console.log(TaskListType.SENDED_TASK)
        break
      case TaskListType.DELETED_TASK:
        console.log(TaskListType.DELETED_TASK)
        break
      default:
        return
    }
  }, [activeTab])
  const clickItem = (i: number) => {
    setActiveEmail(i)
  }

  return (
    <div className={styles.container}>
      <div className={styles.emailList}>
        {test.map((item, i) => {
          return (
            <EmailListItem
              key={i}
              onClick={() => clickItem(i)}
              selected={i === activeEmail}
              emailData={item}
            ></EmailListItem>
          )
        })}
      </div>
      {activeEmail > -1 && <EmailDetail></EmailDetail>}
    </div>
  )
}

export default EmailList
