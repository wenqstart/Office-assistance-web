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
//  获取消息列表
export const getChatContent = (params: any) => {
  return request(`${chat_api}/getChat`, {
    method: 'get',
    params,
  })
}
//  获取会话列表
export const getChatList = (params: any) => {
  return request(`${chat_api}/getChat`, {
    method: 'get',
    params,
  })
}
