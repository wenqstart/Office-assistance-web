import { getTaskDetail } from '@/services/task'
import { useModel } from '@umijs/max'
import React, { useEffect, useState } from 'react'
import styles from './index.less'

type TEmailDetailProp = {
  id: string
}
const EmailDetail: React.FC = (props: TEmailDetailProp) => {
  const { id } = props
  const { userInfo } = useModel('user', (model: any) => ({
    userInfo: model.userInfo,
  }))
  const [emailContent, setEmailContent] = useState(null)

  const _getTaskDetail = async () => {
    if (!id) return
    const { code, data } = await getTaskDetail(userInfo.id, id)

    if (code === 200 && data) {
      setEmailContent(data)
    }
  }

  useEffect(() => {
    _getTaskDetail()
  }, [id])

  return (
    <div className={styles.emailDetail}>
      <div className={styles.title}>{emailContent.title}</div>
      <div className={styles.content}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default EmailDetail
