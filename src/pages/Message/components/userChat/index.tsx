import WangEditor from '@/components/WangEditor'
import { UserOutlined } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Avatar, Divider, List, Skeleton, Empty } from 'antd'
import { useRef, useState, useEffect, useMemo } from 'react'
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
  // const [messageList, setMessageList] = useState([])
  const { userInfo } = useModel('user')
  const {
    chatId,
    setChatId,
    sendMessage,
    currentMsg,
    messageList,
  } = useModel('websocket')
  const [loading, setLoading] = useState(false)

  const inputRef = useRef()
  const editorRef = useRef()
  const scrollViewRef = useRef()
  const userId = userInfo?.id
  const userName = userInfo?.name
  const userNumber = userInfo?.number
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
    listItemStart,
    listItemEnd,
    messageStart,
    messageEnd,
    titleEnd,
    titleStart,
    createTimeStart,
    createTimeEnd
  } = styles
  // 使用 ctrl+enter 或 cmd+enter 换行。
  function handleKeydown(event: any) {
    console.log('handleKeydown', chatId)

    const { keyCode, ctrlKey, metaKey } = event

    // console.log(sessionStorage.getItem('chatId'))

    // ctrl 17 enter 13 meta 91
    // 发送消息
    if (keyCode === 13 && !ctrlKey && !metaKey) {
      sendMessage({
        userId: userId,
        chatId: chatId,
        number: userNumber,
        content: editorRef.current?.html,
      })
    }
    console.log(event)
  }
  function loadMoreData(params: any) {
    console.log('loadMoreData')
    // if (loading) {
    //   return
    // }
    // setLoading(true)

    // setTimeout(() => {
    //   setMessageList([...messageList, ...defaultMessageList])
    //   // 需要手动移动滚动条，防止一直触发
    //   if (scrollViewRef.current && scrollViewRef.current.el) {
    //     scrollViewRef.current.el.scrollTop += 150
    //   }
    //   console.log('scrollViewRef', scrollViewRef.current)
    //   // userChatRef.scrollTop = 30
    //   setLoading(false)
    // }, 1000)
  }

  // useEffect(() => {
  //   loadMoreData()
  // }, [])
  return (
    <>
      <div className={topHeader}>
        <div className={topLeft}>
          <Avatar size={32} icon={<UserOutlined />} />
          <div className={title}>{currentMsg.name?.last}</div>
        </div>
      </div>
      <div className={mainContent}>
        {messageList?.length === 0 ? (
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
              padding: '0 16px 0 30px',
              height: '55vh',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column-reverse',
            }}
          >
            <InfiniteScroll
              ref={scrollViewRef}
              dataLength={messageList.length}
              next={loadMoreData}
              style={{
                display: 'flex',
                flexDirection: 'column-reverse',
              }}
              hasMore={messageList.length < 50}
              inverse={true}
              loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
              endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
              scrollableTarget="userChat"
            >
              <List
                dataSource={messageList}
                bordered={false}
                split={false}
                renderItem={(item, index) => (
                  <>
                    {item.number === userNumber ? (
                      <List.Item className={listItemEnd} key={index}>
                        <div className={messageEnd}>
                          <span className={titleEnd}><span className={createTimeEnd}>{item.createTime}</span> {userName}</span>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.content,
                            }}
                          >
                          </div>
                        </div>
                        <Avatar
                          shape="square"
                          size={32}
                          style={{ backgroundColor: '#377DF7' }}
                        >
                          {userName?.slice(0, 1)}
                        </Avatar>
                      </List.Item>
                    ) : (
                      <List.Item className={listItemStart} key={index}>
                        <Avatar
                          shape="square"
                          size={32}
                          style={{ backgroundColor: '#377DF7' }}
                        >
                          {currentMsg?.fullnName?.slice(0, 1)}
                        </Avatar>
                        <div className={messageStart}>
                          <span className={titleStart}>{currentMsg?.fullnName} <span className={createTimeStart}>{item.createTime}</span></span>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.content,
                            }}
                          >
                          </div>
                        </div>
                      </List.Item>
                    )}
                  </>
                )}
              />
            </InfiniteScroll>
          </div>
        )}
      </div>
      <div className={footerContent}>
        {currentMsg?.name && (
          <WangEditor
            ref={editorRef}
            content={'www'}
            toolbarConfig={toolbarConfig}
            handleKeydown={handleKeydown}
          />
        )}
      </div>
    </>
  )
}

export default UserChat
