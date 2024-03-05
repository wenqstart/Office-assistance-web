const API_USER = process.env.API_USER
import { request } from '@@/plugin-request'

export const getUserTemplate = () =>
  request(`/api/admin/getUserTemplate`, {
    method: 'get',
  })
