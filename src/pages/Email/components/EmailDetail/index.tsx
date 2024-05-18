import { getTaskDetail } from '@/services/task'
import { useModel } from '@umijs/max'
import { Button } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.less'

enum TaskListType {
  RECEIVED_TASK = 0, // 收件箱
  DRAFTS_TASK = 1, // 草稿箱
  SENDED_TASK = 2, // 已发送
  DELETED_TASK = 3, // 已删除
}

type TEmailDetailProp = {
  id: string
  type: number
}

type TEmailContent = {
  id: string
  publisher: string
  read: string | number
  state: number
  sum: number
  title: string
  type: string
  content: string
  createTime: string
  updateTime: string
}

const EmailDetail: React.FC = (props: TEmailDetailProp) => {
  const { id, type } = props
  const { userInfo } = useModel('user', (model: any) => ({
    userInfo: model.userInfo,
  }))

  const htmlDetail = useRef()
  const [emailContent, setEmailContent] = useState<TEmailContent>(null)

  const _getTaskDetail = async () => {
    if (!id) return
    const { code, data } = await getTaskDetail(userInfo.id, id)

    if (code === 200 && data) {
      setEmailContent(data)
    }
  }

  useEffect(() => {
    _getTaskDetail()
    console.log(htmlDetail)
    htmlDetail.current.innerHTML = emailContent?.content || '暂无内容'
  }, [id])

  const button = (() => {
    switch (type) {
      case TaskListType.RECEIVED_TASK:
        return <Button>回复</Button>
      case TaskListType.DRAFTS_TASK:
        return <Button>继续编写</Button>
      case TaskListType.SENDED_TASK:
        return <Button>查看详情</Button>
      case TaskListType.DELETED_TASK:
        return <></>
      default:
        return <></>
    }
  })()

  return (
    <div className={styles.emailDetail}>
      <div className={styles.title}>{emailContent?.title || '(暂无主题)'}</div>
      <div className={styles.content}>
        <div>
          <span>{emailContent?.publisher || '无发送人'}</span>
        </div>
        <div ref={htmlDetail}></div>
        <div></div>
      </div>
      {button}
    </div>
  )
}

export default EmailDetail
