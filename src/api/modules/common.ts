import { request } from '@@/plugin-request'
import qs from 'qs'

export type TLoginData = {
  username: string
  password: string
}
export const login = (loginData: TLoginData) =>
  request('/api/user/login', {
    method: 'post',
    data: qs.stringify(loginData),
  })
