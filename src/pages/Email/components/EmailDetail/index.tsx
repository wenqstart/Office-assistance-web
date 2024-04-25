import { getTaskDetail } from '@/services/task'
import { useModel } from '@umijs/max'
import React, { useEffect } from 'react'
import styles from './index.less'

type TEmailDetailProp = {
  id: string
}
const EmailDetail: React.FC = (props: TEmailDetailProp) => {
  const { id } = props
  const { userInfo } = useModel('user', (model: any) => ({
    userInfo: model.userInfo,
  }))

  const _getTaskDetail = async () => {
    const { data } = await getTaskDetail(userInfo.id, id)
  }

  useEffect(() => {
    _getTaskDetail()
  }, [id])

  return <div className={styles.emailDetail}></div>
}

export default EmailDetail
