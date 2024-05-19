import { request } from '@umijs/max'

const BASE_API = process.env.BASE_API
const group_api = `${BASE_API}/label`

// 建群
export const createGroup = ({ userId, name, picture, members }) => {
  return request(`${group_api}/addNewLabelAndUserToLabel`, {
    method: 'put',
    params: {
      userId,
      name,
      picture,
    },
    data: members,
  })
}

// 退群
export const exitGroupApi = ({ userId, labelId }) => {
  return request(`${group_api}/outLabel`, {
    method: 'put',
    params: {
      userId,
      labelId,
    },
  })
}
// 拉用户进群
export const pullUserToLabelApi = ({ userId, labelId, data }) => {
  return request(`${group_api}/pullUserToLabel`, {
    method: 'post',
    params: {
      userId,
      labelId,
    },
    data: data,
  })
}
