import { UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import styles from './index.less'

const UserChat = (props: any) => {
  const { loading = true, text, ...rest } = props
  return (
    <div>
      <div className={styles.topHeader}>
        <div>
          <Avatar size={32} icon={<UserOutlined />} />
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default UserChat
