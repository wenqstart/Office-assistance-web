import { request } from '@umijs/max'

const BASE_API = process.env.BASE_API
const group_api = `${BASE_API}/label`

// 建群
export default createGroup = () => {
  return request(`${group_api}/addNewLabelAndUserToLabel`, {
    method: 'post',
  })
}
