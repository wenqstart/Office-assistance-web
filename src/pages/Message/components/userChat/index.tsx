import WangEditor from '@/components/WangEditor'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Empty } from 'antd'
import { useRef, useState } from 'react'
import styles from './index.less'
import { toolbarConfig } from './data'

const UserChat = () => {
  const [messageList, setMessageList] = useState([])
  const inputRef = useRef()

  const {
    userChat,
    topHeader,
    topLeft,
    title,
    mainContent,
    emptyContent,
    footerContent,
  } = styles
  // 使用 ctrl+enter 或 cmd+enter 换行。
  function handleKeydown(params: any) {
    const { keyCode, ctrlKey, metaKey } = params
    // ctrl 17 enter 13 meta 91
    // 发送消息
    if (keyCode === 13 && !ctrlKey && !metaKey) {
      console.log('send')
    }
    console.log(params)
  }
  return (
    <>
      <div className={topHeader}>
        <div className={topLeft}>
          <Avatar size={32} icon={<UserOutlined />} />
          <div className={title}>Jensen</div>
        </div>
      </div>
      <div className={mainContent}>
        {messageList.length === 0 ? (
          <Empty description={false} imageStyle={{ height: 100 }} />
        ) : (
          <div>
            {messageList.map((item, index) => (
              <div key={index}></div>
            ))}
          </div>
        )}
      </div>
      <div className={footerContent}>
        <WangEditor
          content={'www'}
          toolbarConfig={toolbarConfig}
          handleKeydown={handleKeydown}
        />
      </div>
    </>
  )
}

export default UserChat
