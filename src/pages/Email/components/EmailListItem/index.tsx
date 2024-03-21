import React from 'react'
import './index.less'

const EmailListItem: React.FC<any> = (props) => {
  const clickItem = () => {
    props.onClick()
  }

  return (
    <div
      onClick={clickItem}
      className={`box ${props.selected ? 'active' : ''}`}
    ></div>
  )
}

export default EmailListItem
