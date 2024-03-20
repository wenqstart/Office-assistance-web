import WangEditor from '@/components/WangEditor'
import { UserOutlined } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Avatar, Divider, List, Skeleton, Empty } from 'antd'
import { useRef, useState, useEffect } from 'react'
import { useModel } from '@umijs/max'
import styles from './index.less'
import { toolbarConfig } from './data'

const UserChat = () => {
  const defaultMessageList = [
    {
      senderId: '1',
      senderName: '张三',
      receiverId: '1764134456541143041',
      recevierName: '温泉',
      message: '消息 1',
    },
    {
      senderId: '1',
      senderName: '张三',
      receiverId: '1764134456541143041',
      recevierName: '温泉',
      message: '消息 2',
    },
    {
      senderId: '1764134456541143041',
      senderName: '温泉',
      receiverId: '1',
      recevierName: '张三',
      message: '消息 3',
    },
    {
      senderId: '1764134456541143041',
      senderName: '温泉',
      receiverId: '1',
      recevierName: '张三',
      message: '消息 4',
    },
    {
      senderId: '1764134456541143041',
      senderName: '温泉',
      receiverId: '1',
      recevierName: '张三',
      message: '消息 5',
    },
    {
      senderId: '1764134456541143041',
      senderName: '温泉',
      receiverId: '1',
      recevierName: '张三',
      message: '消息 6',
    },
  ]
  const [messageList, setMessageList] = useState([])
  const { userInfo } = useModel('user')
  const [loading, setLoading] = useState(false)

  const inputRef = useRef()
  const userId = userInfo?.id
  const {
    userChat,
    topHeader,
    topLeft,
    title,
    mainContent,
    emptyContent,
    footerContent,
    messageWrap,
    renderItem,
    renderRight,
    renderLeft,
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
  function loadMoreData(params: type) {
    console.log('loadMoreData')
    if (loading) {
      return
    }
    setLoading(true)
    setMessageList([...messageList, ...defaultMessageList])
    setLoading(false)
  }
  useEffect(() => {
    loadMoreData()
  }, [])
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
          // <div className={messageWrap}>
          //   {messageList.map((item, index) => (
          //     <div className={renderItem} key={index}>
          //       {
          //         item.receiverId === userId ? (
          //           <div className={renderRight}>
          //             <span>{ item.message }</span>
          //             <Avatar size={32} >{ item.senderName?.slice(0, 1) }</Avatar>
          //           </div>
          //         ) : (<div className={renderLeft}>
          //             <Avatar size={32} >{ item.senderName?.slice(0, 1) }</Avatar>
          //             <span>{ item.message }</span>

          //         </div>)
          //       }
          //     </div>
          //   ))}
          // </div>
          <div
            id="userChat"
            style={{
              width: '100%',
              paddingLeft: '30px',
              height: '55vh',
              overflow: 'auto',
              paddingRight: '16px',
            }}
          >
            <InfiniteScroll
              dataLength={messageList.length}
              next={loadMoreData}
              style={{
                display: 'flex',
                flexDirection: 'column-reverse',
              }}
              hasMore={messageList.length < 10}
              inverse={true}
              initialScrollY={100}
              loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
              endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
              scrollableTarget="userChat"
            >
              <List
                dataSource={messageList}
                bordered={false}
                split={false}
                renderItem={(item, index) => (
                  <List.Item key={index}>
                    <List.Item.Meta
                      avatar={
                        <Avatar size={32}>
                          {item.senderName?.slice(0, 1)}
                        </Avatar>
                      }
                      title={<a href="https://ant.design">{item.senderName}</a>}
                      // description={item.email}
                    />
                    <div>{item.message}</div>
                  </List.Item>
                )}
              />
            </InfiniteScroll>
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
