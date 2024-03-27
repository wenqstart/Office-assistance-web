import { request } from '@umijs/max'
const BASE_API = process.env.BASE_API

// 获取用户创建的群聊
export const getUserCreateGroup = (userId: string) => {
  return request(`${BASE_API}/label/getMyLabels`, {
    method: 'get',
    params: {
      userId,
    },
  })
}

// 获取用户加入的群聊
export const getJoiningGroup = (userId: string) => {
  return request(`${BASE_API}/label/getNoMyLabels`, {
    method: 'get',
    params: {
      userId,
    },
  })
}
