import React, { useState } from 'react'
import './index.less'

const TabList: React.FC = () => {
  const listData = [
    {
      text: '收件箱',
      icon: '',
    },
    {
      text: '草稿箱',
      icon: '',
    },
    {
      text: '已发送',
      icon: '',
    },
    {
      text: '已删除',
      icon: '',
    },
  ]

  const [activeId, setActiveId] = useState(0)

  const clickItem = (i: number) => {
    setActiveId(i)
    console.log(activeId)
  }

  return (
    <div className="list">
      {listData.map((item, i) => {
        return (
          <div
            key={i}
            className={`item ${activeId === i ? 'activeItem' : ''}`}
            onClick={() => clickItem(i)}
          >
            {item.text}
          </div>
        )
      })}
    </div>
  )
}

export default TabList
