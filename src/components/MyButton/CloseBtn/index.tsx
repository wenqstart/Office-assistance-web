import { CloseOutlined } from '@ant-design/icons'
import React from 'react'
import styles from './index.less'

const CloseBtn: React.FC<any> = (props: { onClick: () => void }) => {
  return (
    <div className={styles.btn} onClick={props.onClick}>
      <CloseOutlined></CloseOutlined>
    </div>
  )
}

export default CloseBtn
