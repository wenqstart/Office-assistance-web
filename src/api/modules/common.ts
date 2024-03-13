import { request } from '@@/plugin-request'
import qs from 'qs'

export type TLoginData = {
  username: string
  password: string
}
export const login = (loginData: TLoginData) =>
  request('/api/user/login', {
    method: 'post',
    params: { username: loginData.username, password: loginData.password },
  })
