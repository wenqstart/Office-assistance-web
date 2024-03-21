import React, { useState } from 'react'
import EmailDetail from '../EmailDetail'
import EmailListItem from '../EmailListItem'
import './index.less'

const EmailList: React.FC<{ activeTab: number }> = (props) => {
  const [activeEmail, setActiveEmail] = useState(-1)

  const clickItem = (i: number) => {
    console.log(i)
    setActiveEmail(i)
  }

  return (
    <div className="container">
      <div className="emailList">
        {new Array(props.activeTab + 1).fill(0).map((item, i) => {
          return (
            <EmailListItem
              key={i}
              onClick={() => clickItem(i)}
              selected={i === activeEmail}
            ></EmailListItem>
          )
        })}
      </div>
      {activeEmail > -1 && <EmailDetail></EmailDetail>}
    </div>
  )
}

export default EmailList
