import React from 'react'
import styles from './index.less'

const GroupList: React.FC<any> = (props: any) => {
  const { groupList, style, clickItem } = props
  return (
    <div className={styles.groupList} style={style}>
      {(groupList.length &&
        groupList.map((item: any) => {
          return (
            <div
              key={item.id}
              className={styles.groupListItem}
              onClick={() => clickItem(item)}
            >
              <div className={styles.icon}></div>
              <div className={styles.itemName}>{item.name}</div>
            </div>
          )
        })) || <div>暂无加入的群组</div>}
    </div>
  )
}

export default GroupList
