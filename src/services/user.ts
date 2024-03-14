const BASE_API = process.env.BASE_API
import { request } from '@@/plugin-request'
const user_api = BASE_API + '/user'
// 获取用户信息
export const fetchUserInfo = (number: string) => {
  return request(`${user_api}/getUserInfo`, {
    method: 'get',
    params: { number },
  })
}
export const changeUserPassword = (data: any, token = '') => {
  return request(`${user_api}/users/password`, {
    method: 'post',
    data,
    headers: { Authorization: token },
  })
}
export const changeUserInfoData = (data: any) => {
  return request(`${user_api}/users/update`, {
    method: 'post',
    data,
  })
}
// 用户登录
export const accountSignIn = (loginData: any) => {
  return request(`${user_api}/login`, {
    method: 'post',
    data: loginData
  })
}

// 用户登出
export const accountSignOut = () => {
  return request(`${user_api}/users/logout`, {
    method: 'post',
  })
}
