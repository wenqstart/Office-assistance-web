import { request } from '@umijs/max'

const BASE_API = process.env.BASE_API
const group_api = `${BASE_API}/label`

// 建群
export const createGroup = ({ userId, name, picture, members }) => {
  return request(`${group_api}/addNewLabelAndUserToLabel`, {
    method: 'post',
    params: {
      userId,
      name,
      picture,
    },
    data: members,
  })
}
