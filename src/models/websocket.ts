import { useCallback, useEffect, useRef, useState } from 'react'
import { useModel } from '@umijs/max'
import { getChatContent } from '@/services/chat'

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

export default function useWebsocket() {
  const [reset, setReset] = useState<boolean>(false)
  const socket = useRef<WebSocket>()
  const sendCount = useRef<number>(1)
  const [alarmCount, setAlarmCount] = useState<number>(0)
  const [messageCount, setMessageCount] = useState<number>(0)
  const [chatId, setChatId] = useState<string>('')
  const [currentMsg, setCurrentMsg] = useState({})
  const [messageList, setMessageList] = useState([])

  const { userInfo } = useModel('user')
  const userId = userInfo?.id

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
  const socketOnClose = useCallback(() => {
    console.log('onclose')

    setReset(true)
  }, [])

  // 出错事件
  const socketOnError = useCallback((err: any) => {
    console.log('onerror: ', err)
  }, [])

  // 收发信息
  const socketOnMessage = useCallback(
    (e: any) => {
      console.log('onmessage', e)

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
    [sendCount],
  )
  function sendMessage(message: any) {
    console.log('message', message)
    socket.current?.send(JSON.stringify(message))
  }
  async function getChatMessage(message: any) {
    try {
    const res = await getChatContent({ chatId })
    setMessageList(res.data?.reverse())
    } catch (error) {
      console.log('error', error);
      
    }
  }
  // 初始化连接 socket
  const socketInit = useCallback(() => {
    try {
      console.log('socketInit userId', userId)
      console.log('socketInit chatId', chatId)

      if (userId && chatId) {
        const ip = '62137560yh.vicp.fun'
        const scoketUrl = `ws://${ip}/chat/single/${userId}/${chatId}`
        console.log('scoketUrl', scoketUrl)

        const socketObj = new WebSocket(scoketUrl)
        socketObj.addEventListener('close', socketOnClose)
        socketObj.addEventListener('error', socketOnError)
        socketObj.addEventListener('message', socketOnMessage)
        socketObj.addEventListener('open', socketOnOpen)
        socket.current = socketObj
        sendCount.current = 1
      }
    } catch (err) {
      console.log('err: ', err)
    }
  }, [socketOnClose, socketOnError, socketOnMessage, socketOnOpen, chatId])
  // 初始化连接socket
  useEffect(() => {
    socketInit()
  }, [chatId])
  // 断线重连
  useEffect(() => {
    if (!reset) return
    setTimeout(() => {
      socketInit()
      setReset(false)
    }, 30000)
  }, [reset, socketInit])

  return {
    alarmCount,
    messageCount,
    socketInit,
    setChatId,
    chatId,
    sendMessage,
    currentMsg,
    setCurrentMsg,
    getChatMessage,
    messageList
  }
}
