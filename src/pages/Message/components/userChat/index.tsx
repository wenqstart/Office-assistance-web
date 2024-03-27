import WangEditor from '@/components/WangEditor'
import { getChatId } from '@/utils/tool'
import { useModel } from '@umijs/max'
import { Avatar, List, Skeleton } from 'antd'
import { useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { SlateTransforms } from '@wangeditor/editor'

import { toolbarConfig } from './data'
import styles from './index.less'

const UserChat = () => {
  const { userInfo } = useModel('user')
  const { chatId, setChatId, sendMessage, currentMsg, messageList } =
    useModel('message')
  const [loading, setLoading] = useState(false)

  const inputRef = useRef()
  const editorRef = useRef(null)
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
    createTimeEnd,
    contentWrapEnd,
    contentWrapStart,
  } = styles
  // 使用 ctrl+enter 或 cmd+enter 换行。
  function handleKeydown(event: any) {
    const { keyCode, ctrlKey, metaKey } = event

    // console.log(sessionStorage.getItem('chatId'))

    // ctrl 17 enter 13 meta 91
    // 发送消息
    if (keyCode === 13 && !ctrlKey && !metaKey) {
      sendMessage({
        userId: userId,
        chatId: getChatId(),
        number: userNumber,
        content: editorRef.current?.html,
      })
      editorRef?.current?.resetContent()
    }
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
        {currentMsg.chatId && (
          <div className={topLeft}>
            <Avatar
              shape="square"
              size={32}
              style={{ backgroundColor: '#377DF7' }}
            >
              {currentMsg.chatName?.slice(0, 1)}
            </Avatar>
            <div className={title}>{currentMsg.chatName}</div>
          </div>
        )}
      </div>
      <div className={mainContent}>
        {messageList?.length !== 0 && (
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
              hasMore={false}
              inverse={true}
              loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
              // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
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
                          <span className={titleEnd}>
                            <span className={createTimeEnd}>
                              {item.createTime}
                            </span>
                            {item.name}
                          </span>
                          <div
                            className={contentWrapEnd}
                            dangerouslySetInnerHTML={{
                              __html: item.content,
                            }}
                          ></div>
                        </div>
                        <Avatar
                          shape="square"
                          size={32}
                          style={{ backgroundColor: '#377DF7' }}
                        >
                          {item.name?.slice(0, 1)}
                        </Avatar>
                      </List.Item>
                    ) : (
                      <List.Item className={listItemStart} key={index}>
                        <Avatar
                          shape="square"
                          size={32}
                          style={{ backgroundColor: '#377DF7' }}
                        >
                          {item.name?.slice(0, 1)}
                        </Avatar>
                        <div className={messageStart}>
                          <span className={titleStart}>
                            {item.name}
                            <span className={createTimeStart}>
                              {item.createTime}
                            </span>
                          </span>
                          <div
                            className={contentWrapStart}
                            dangerouslySetInnerHTML={{
                              __html: item.content,
                            }}
                          ></div>
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
        {currentMsg?.chatId && (
          <WangEditor
            ref={editorRef}
            toolbarConfig={toolbarConfig}
            handleKeydown={handleKeydown}
          />
        )}
      </div>
    </>
  )
}

export default UserChat
