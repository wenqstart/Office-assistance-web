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
  const [socketUrl, setSocketUrl] = useState()
  const { userInfo } = useModel('user')
  const userId = userInfo?.id
  const userNumber = userInfo?.number

  // 开启事件,主动获取数据
  const socketOnOpen = useCallback(() => {
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

  // 出错事件
  const socketOnError = useCallback((err: any) => {
    console.log('onerror: ', err)
  }, [])

  const onTaskSend = useCallback((message) => {
    console.log('taskSend-----------------', message)
    if (socket?.current?.readyState === webSocketStatus.OPEN) {
      socket?.current?.send(JSON.stringify(message))
    }
  }, [])

  const onTaskReceived = useCallback((e) => {
    console.log('onTaskReceived-----------------', e)
  }, [])

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
        socketObj.addEventListener('message', onTaskReceived)
        socketObj.addEventListener('open', socketOnOpen)
        socket.current = socketObj
        sendCount.current = 1
      } catch (err) {
        console.log('err: ', err)
      }
    },
    [onTaskReceived],
  )

  // 断线重连
  useEffect(() => {
    if (!reset) return
    setTimeout(() => {
      socketInit()
      setReset(false)
    }, 30000)
  }, [reset, socketInit])

  return {
    onTaskSend,
    socketInit,
  }
}
