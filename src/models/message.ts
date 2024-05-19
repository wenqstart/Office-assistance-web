import { getChatContent, getUsersChatId } from '@/services/chat'
import { clearMsgList, getChatId, getMsgList } from '@/utils/tool'
import { useModel } from '@umijs/max'
import { useCallback, useEffect, useRef, useState } from 'react'

const ws_ip =
  process.env.NODE_ENV === 'development'
    ? process.env.dev_ip
    : process.env.prod_ip
// 获取告警数量
const UNREAD_WARN_COUNT = 'UNREAD_WARN_COUNT'
// 获取消息数量
const UNREAD_MSG_COUNT = 'UNREAD_MSG_COUNT'
// 获取消息的间隔
const INT_TIME = 5000
// websocket状态
const webSocketStatus = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
}

export default function useMessage() {
  const [reset, setReset] = useState<boolean>(false)
  const socket = useRef<WebSocket>()
  const sendCount = useRef<number>(1)
  const [alarmCount, setAlarmCount] = useState<number>(0)
  const [messageCount, setMessageCount] = useState<number>(0)
  const [messageTotal, setMessageTotal] = useState<number>(0)
  const [chatId, setChatId] = useState<string>(getChatId() || '')
  const [currentMsg, setCurrentMsg] = useState({})
  const [messageList, setMessageList] = useState([])
  const [socketUrl, setSocketUrl] = useState()
  const { userInfo } = useModel('user')
  const userId = userInfo?.id
  const userNumber = userInfo?.number

  // 开启事件,主动获取数据
  const socketOnOpen = useCallback(() => {
    console.log('onopen')

    // 判断连接状态是不是open
    // if (socket?.current?.readyState === webSocketStatus.OPEN) {
    //   // 第一次加载触发一次
    //   // socket?.current?.send(
    //   //   JSON.stringify({ businessKey: [UNREAD_MSG_COUNT, UNREAD_WARN_COUNT] }),
    //   // )
    // }
    // const timer = setInterval(() => {
    //   if (socket?.current?.readyState === webSocketStatus.OPEN) {
    //     // socket?.current?.send(
    //     //   JSON.stringify({
    //     //     businessKey: [UNREAD_MSG_COUNT, UNREAD_WARN_COUNT],
    //     //   }),
    //     // )
    //   }
    // }, INT_TIME)
    // 返回信息出错清除定时器
    if (sendCount.current === 0) {
      // clearInterval(timer)
      setReset(true)
    }
  }, [sendCount])

  // 关闭事件重新连接
  const socketOnClose = useCallback((e: any) => {
    console.log('onclose', e)

    setReset(true)
  }, [])
  async function getChatMessage(
    currChatId: string = getChatId() || '',
    current = 1,
  ) {
    try {
      const res = await getChatContent({
        chatId: currChatId,
        size: 10,
        current,
      })
      if (res.data) {
        const { total, userChatIdChats } = res.data
        console.log('messageList', getMsgList())

        setMessageList(userChatIdChats?.reverse().concat(getMsgList()))
        setMessageTotal(total)
        sessionStorage.setItem(
          'office_system_msgList',
          JSON.stringify(userChatIdChats.concat(getMsgList())),
        )
      }
    } catch (error) {
      console.log('error', error)
    }
  }
  // 出错事件
  const socketOnError = useCallback((err: any) => {
    console.log('onerror: ', err)
  }, [])

  // 收发信息
  const socketOnMessage = useCallback(
    (e: any) => {
      console.log('onmessage', e.data)
      // "MessageDvo(chatId=1770820205788975105, name=温泉, image=null, number=200030111, content=<p>www快快快</p>, read=null, createTime=Fri Mar 22 10:06:00 CST 2024)"
      // const messageRes = e.data.slice(11, -1)?.split(', ')
      const messageRes = JSON.parse(e.data || '{}')
      console.log('messageList', getMsgList())
      const { content, createTime, sayNumber, readCount, name } = messageRes
      // const chatId = messageRes[0].split('=')[1]
      // const name = messageRes[1].split('=')[1]
      // const number = messageRes[3].split('=')[1]
      // const content = messageRes[4].split('=')[1]
      // const createTime = messageRes[6].split('=')[1]
      // console.log('{chatId, name, number, content, createTime}', {
      //   chatId,
      //   name,
      //   number,
      //   content,
      //   createTime,
      // })
      // console.log([...messageList, { chatId, name, number, content, createTime }])
      // console.log('messageList', messageList)
      // getChatMessage()
      const curMsgList = getMsgList()
      setMessageList(
        curMsgList.concat([
          {
            content,
            createTime,
            number: sayNumber,
            readCount,
            name,
          },
        ]),
      )
      sessionStorage.setItem(
        'office_system_msgList',
        JSON.stringify(
          curMsgList.concat([
            {
              content,
              createTime,
              number: sayNumber,
              readCount,
              name,
            },
          ]),
        ),
      )
      // setMessageList([...messageList, {chatId, name, number, content, createTime}])
      // if (e.data === 'success') return
      // const alarmCountObj = JSON.parse(e.data)
      // const paramNameArr = Object.keys(alarmCountObj)
      // // 判断返回告警保持连接否则断开连接
      // if (paramNameArr[1] === 'UNREAD_WARN_COUNT') {
      //   sendCount.current += 1
      //   setAlarmCount(alarmCountObj.UNREAD_WARN_COUNT)
      //   setMessageCount(alarmCountObj.UNREAD_MSG_COUNT)
      // } else {
      //   sendCount.current = 0
      // }
    },
    [messageList],
  )

  const onTaskSend = useCallback((message) => {
    console.log('taskSend-----------------', message)
    if (socket?.current?.readyState === webSocketStatus.OPEN) {
      socket?.current?.send(JSON.stringify(message))
    }
  }, [])

  const onTaskReceived = useCallback((e) => {
    console.log('onTaskReceived-----------------', e)
  }, [])

  const sendMessage = useCallback(
    (message: any) => {
      console.log('message', JSON.stringify(message))
      console.log('socket?.current', socket?.current)
      if (socket?.current?.readyState === webSocketStatus.OPEN) {
        socket?.current?.send(JSON.stringify(message))
        // getChatMessage()
      }
    },
    [chatId],
  )

  // 初始化连接 socket
  const socketInit = useCallback(
    (url: string = socketUrl || '') => {
      try {
        console.log('socketInit ws_ip', ws_ip)
        console.log('socketInit url', url)
        setSocketUrl(url)
        let wsUrl = `ws://${ws_ip}/${url}`
        const socketObj = new WebSocket(wsUrl)
        socketObj.addEventListener('close', socketOnClose)
        socketObj.addEventListener('error', socketOnError)
        socketObj.addEventListener('message', socketOnMessage)
        socketObj.addEventListener('message', onTaskReceived)
        socketObj.addEventListener('open', socketOnOpen)
        socket.current = socketObj
        sendCount.current = 1
      } catch (err) {
        console.log('err: ', err)
      }
    },
    [
      socketOnClose,
      socketOnError,
      socketOnMessage,
      socketOnOpen,
      chatId,
      onTaskReceived,
    ],
  )
  // 获取 chatId（会话列表不需要，后续放在联系人界面使用）
  async function getCurrentChatId(contactInfo: any = {}) {
    try {
      const { number: contactNumber, group, labelId } = contactInfo
      let params = { numberA: userNumber, numberB: '' }
      let url = ''
      let newChatId = ''
      if (group) {
        params.numberB = labelId
        const res = await getUsersChatId(params)
        newChatId = res.data
        sessionStorage.setItem('office_system_chatId', res.data)
        url = `chat/group/${userId}/${res.data}`
      } else {
        params.numberB = contactNumber
        const res = await getUsersChatId(params)
        newChatId = res.data
        sessionStorage.setItem('office_system_chatId', res.data)
        url = `chat/single/${userId}/${res.data}`
      }
      socketInit(url)
      getChatMessage(newChatId)
      setChatId(newChatId)
    } catch (error) {
      console.log(error)
    }
  }
  // 断线重连
  useEffect(() => {
    if (!reset) return
    setTimeout(() => {
      socketInit()
      setReset(false)
    }, 30000)
  }, [reset, socketInit])
  // 左侧选择消息
  function chooseMessage(msgInfo: any) {
    console.log('msgInfo', msgInfo)
    setMessageList([])
    setCurrentMsg(msgInfo)
    clearMsgList()
    sessionStorage.setItem('office_system_chatId', msgInfo.chatId)
    let url = `chat/${msgInfo.group ? 'group' : 'single'}/${userId}/${
      msgInfo.chatId
    }`
    socketInit(url)
    getChatMessage(msgInfo.chatId, 1)
    setChatId(msgInfo.chatId)
  }

  return {
    onTaskSend,
    alarmCount,
    messageCount,
    socketInit,
    chatId,
    sendMessage,
    currentMsg,
    getChatMessage,
    messageList,
    chooseMessage,
    getCurrentChatId,
    messageTotal,
    setMessageTotal,
  }
}
