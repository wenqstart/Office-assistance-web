import { request } from '@umijs/max'
const BASE_API = process.env.BASE_API
const user_api = BASE_API + '/user'
// 获取用户信息
export const fetchUserInfo = (number: string) => {
  return request(`${user_api}/getUserInfo`, {
    method: 'get',
    params: { number },
  })
}
// 修改用户信息
export const changeUserInfoData = (data: any) => {
  const { number, userDto } = data
  return request(`${user_api}/getUserInfo`, {
    method: 'post',
    params: { number },
    data: userDto,
  })
}
// 修改用户密码
export const changeUserPassword = (data: any) => {
  const { number, password } = data
  return request(`${user_api}/updatePassword`, {
    method: 'put',
    params: { number },
    data: { password },
  })
}

// 用户登录
export const accountSignIn = (loginData: any) => {
  return request(`${user_api}/login`, {
    method: 'post',
    data: loginData,
  })
}

// 用户登出
export const accountSignOut = () => {
  return request(`${user_api}/users/logout`, {
    method: 'post',
  })
}

// 获取用户的聊天列表
export const getUserChatList_API = (params: any) => {
  return request(`${user_api}/getMessage`, {
    method: 'get',
    params,
  })
}

// 获取组织架构信息
export const getOrganizationData = () => {
  return request(`${BASE_API}/group/getDefaultGroup`, {
    method: 'get',
  })
}

export const getOrganizationMembers = (groupId: string) => {
  return request(`${BASE_API}/group/getGroupMembers`, {
    method: 'get',
    params: { groupId },
  })
}
