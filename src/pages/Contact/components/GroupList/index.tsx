import React from 'react'
import './index.less'

const GroupList: React.FC<any> = (props: any) => {
  const { groupList, style } = props
  return (
    <div className="groupList" style={style}>
      {(groupList.length &&
        groupList.map((item: any) => {
          return (
            <div key={item.id} className="groupListItem">
              <div className="icon"></div>
              <div className="itemName">{item.name}</div>
            </div>
          )
        })) || <div>暂无加入的群组</div>}
    </div>
  )
}

export default GroupList
