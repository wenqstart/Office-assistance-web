import React, { useState } from 'react'
import EmailDetail from '../EmailDetail'
import EmailListItem from '../EmailListItem'
import styles from './index.less'

const EmailList: React.FC<{ activeTab: number }> = (props) => {
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
