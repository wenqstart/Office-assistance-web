import WangEditor from '@/components/WangEditor'
import { exitGroupApi, pullUserToLabelApi } from '@/services/group.ts'
import { getAllPeopleApi } from '@/services/task.ts'
import { getChatId } from '@/utils/tool'
import { UnorderedListOutlined } from '@ant-design/icons'
import { useModel } from '@umijs/max'
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  List,
  Modal,
  Skeleton,
  TreeSelect,
  message,
} from 'antd'
import { useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { toolbarConfig } from './data'
import styles from './index.less'
const UserChat = () => {
  const { userInfo } = useModel('user')
  const {
    chatId,
    setChatId,
    sendMessage,
    currentMsg,
    messageList,
    getChatMessage,
    messageTotal,
    setMessageTotal,
  } = useModel('message')
  const [loading, setLoading] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [current, setCurrent] = useState(1)
  const [allPeople, setAllPeople] = useState({})
  const [treeData, setTreeData] = useState<string>()

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
  function loadMoreData() {
    console.log('loadMoreData')

    if (loading) {
      return
    }
    setLoading(true)

    setTimeout(() => {
      getChatMessage(getChatId(), current + 1)
      setCurrent(current + 1)
      // 需要手动移动滚动条，防止一直触发
      if (scrollViewRef.current && scrollViewRef.current.el) {
        scrollViewRef.current.el.scrollTop += 150
      }
      console.log('scrollViewRef', scrollViewRef.current)
      // userChatRef.scrollTop = 30
      setLoading(false)
    }, 1000)
  }
  async function invitePeople() {
    // setIsModalOpen(true)
    const res = await getAllPeopleApi()
    console.log('res', Object.entries(res.data))
    const data = Object.entries(res.data).map(([key, value]) => {
      return {
        value: key,
        title: key,
        disabled: true,
        children: value.map((item) => ({
          ...res,
          value: item.number,
          title: item.name,
        })),
      }
    })
    setAllPeople(data)
    setIsInviteModalOpen(true)
  }
  function exitGroup() {
    setIsModalOpen(true)
    // exitGroupApi(userId, )
  }
  function handleOk() {
    console.log('currentMsg', currentMsg)
    exitGroupApi({ userId, labelId: currentMsg.chatId })
      .then((res) => {
        console.log('res', res)
        message.success('退群成功！')
      })
      .finally((res) => {
        setIsModalOpen(false)
        setShowDrawer(false)
      })
  }
  const onChange = (newValue: string) => {
    setTreeData(newValue)
  }

  const onPopupScroll = (e: SyntheticEvent) => {
    console.log('onPopupScroll', e)
  }
  function handleInviteOk() {
    console.log(treeData, currentMsg.chatId)
    pullUserToLabelApi({ userId, labelId: currentMsg.chatId, data: treeData })
      .then((res) => {
        message.success('邀请成功！')
      })
      .finally((res) => {
        setTreeData('')
        setIsInviteModalOpen(false)
      })
  }
  // useEffect(() => {
  //   loadMoreData()
  // }, [])
  return (
    <>
      <div className={topHeader}>
        {currentMsg.chatId && (
          <div className={topLeft} onClick={() => setShowDrawer(true)}>
            <Avatar
              shape="square"
              size={32}
              style={{ backgroundColor: '#377DF7' }}
            >
              {currentMsg.chatName?.slice(0, 1)}
            </Avatar>
            <div className={title}>{currentMsg.chatName}</div>
            <UnorderedListOutlined style={{ fontSize: '20px' }} />
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
              hasMore={messageList.length < messageTotal}
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
      <Drawer
        title="基本信息"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        closable={false}
      >
        {currentMsg.group ? (
          <>
            <p>群聊名称： {currentMsg.chatName}</p>
            <Button
              style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}
              type="primary"
              onClick={invitePeople}
            >
              邀请好友
            </Button>
            <Button
              style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}
              type="primary"
              onClick={exitGroup}
              danger
            >
              退出群聊
            </Button>
          </>
        ) : (
          <p>联系人： {currentMsg.chatName}</p>
        )}
      </Drawer>
      <Modal
        title="确认退出群聊？"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <div style={{ width: '300px' }}></div>
      </Modal>
      <Modal
        title="邀请好友"
        open={isInviteModalOpen}
        onOk={handleInviteOk}
        onCancel={() => setIsInviteModalOpen(false)}
      >
        <div style={{ width: '300px' }}>
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            value={treeData}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择"
            allowClear
            multiple
            treeDefaultExpandAll
            onChange={onChange}
            treeData={allPeople}
            onPopupScroll={onPopupScroll}
          />
        </div>
      </Modal>
    </>
  )
}

export default UserChat
