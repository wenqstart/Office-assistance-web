import { getToken, getUserinfo } from '@/utils/tool'
import { useCallback, useEffect, useRef, useState } from 'react'

const token = getToken()
const userId = getUserinfo()?.id
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

const useWebSocket = () => {
  const [reset, setReset] = useState<boolean>(false)
  const socket = useRef<WebSocket>()
  const sendCount = useRef<number>(1)
  const [alarmCount, setAlarmCount] = useState<number>(0)
  const [messageCount, setMessageCount] = useState<number>(0)

  // 开启事件,主动获取数据
  const socketOnOpen = useCallback(() => {
    // 判断连接状态是不是open
    if (socket?.current?.readyState === webSocketStatus.OPEN) {
      // 第一次加载触发一次
      socket?.current?.send(
        JSON.stringify({ businessKey: [UNREAD_MSG_COUNT, UNREAD_WARN_COUNT] }),
      )
    }
    const timer = setInterval(() => {
      if (socket?.current?.readyState === webSocketStatus.OPEN) {
        socket?.current?.send(
          JSON.stringify({
            businessKey: [UNREAD_MSG_COUNT, UNREAD_WARN_COUNT],
          }),
        )
      }
    }, INT_TIME)
    // 返回信息出错清除定时器
    if (sendCount.current === 0) {
      clearInterval(timer)
      setReset(true)
    }
  }, [sendCount])

  // 关闭事件重新连接
  const socketOnClose = useCallback(() => {
    setReset(true)
  }, [])

  // 出错事件
  const socketOnError = useCallback((err: any) => {
    console.log('err: ', err)
  }, [])

  // 收发信息
  const socketOnMessage = useCallback(
    (e: any) => {
      if (e.data === 'success') return
      const alarmCountObj = JSON.parse(e.data)
      const paramNameArr = Object.keys(alarmCountObj)
      // 判断返回告警保持连接否则断开连接
      if (paramNameArr[1] === 'UNREAD_WARN_COUNT') {
        sendCount.current += 1
        setAlarmCount(alarmCountObj.UNREAD_WARN_COUNT)
        setMessageCount(alarmCountObj.UNREAD_MSG_COUNT)
      } else {
        sendCount.current = 0
      }
    },
    [sendCount],
  )

  // 初始化连接 socket
  const socketInit = useCallback(() => {
    try {
      if (userId && token) {
        const scoketUrl = `wss://${window.location.host}/aapp_socket/${userId}/${token}`
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
  }, [socketOnClose, socketOnError, socketOnMessage, socketOnOpen])
  // 初始化连接socket
  useEffect(() => {
    socketInit()
  }, [socketInit])
  // 断线重连
  useEffect(() => {
    if (!reset) return
    setTimeout(() => {
      socketInit()
      setReset(false)
    }, 30000)
  }, [reset, socketInit])

  return [alarmCount, messageCount]
}

export default useWebSocket
