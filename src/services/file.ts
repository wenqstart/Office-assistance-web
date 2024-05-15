import { request } from '@umijs/max'

const BASE_API = process.env.BASE_API
const file_api = BASE_API + '/file'
export const uploadFileApi = (file: any) => {
  return request(`${file_api}/update`, {
    method: 'post',
    data: file,
    contentType: 'multipart/form-data',
  })
}
