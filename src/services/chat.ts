import { request } from '@@/plugin-request'

const BASE_API = process.env.BASE_API
const chat_api = BASE_API + '/userChat'

// 获取 chatId
export const getUsersChatId = (params: any) => {
  return request(`${chat_api}/getChatId`, {
    method: 'get',
    params,
  })
}
//  获取右侧消息列表
export const getChatContent = (params: any) => {
  return request(`${chat_api}/getChat`, {
    method: 'get',
    params,
  })
}
//  获取左侧聊天列表
export const getChatList = (params: any) => {
  return request(`${chat_api}/getMessage`, {
    method: 'get',
    params,
  })
}

// 点击用户或群组出现消息列表
export const getMessageByPoint = (
  userId: string,
  toIdOrNumber: string,
  isNumber: boolean,
) => {
  return request(`${chat_api}/getMessageByPoint`, {
    params: {
      userId,
      toIdOrNumber,
      isNumber,
    },
  })
}
