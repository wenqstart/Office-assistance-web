import { request } from '@umijs/max'

const BASE_API = process.env.BASE_API
const admin_api = `${BASE_API}/admin`

// 获取分组列表
export const getGroupList = (params) => {
  return request(`${admin_api}/getGroupPage`, {
    method: 'get',
    params,
  })
}

export const addNewGroup = (params) => {
  return request(`${admin_api}/addNewGroup`, {
    method: 'put',
    params,
  })
}

export const deleteGroup = (adminId, strings = []) => {
  return request(`${admin_api}/deleteGroup`, {
    method: 'delete',
    params: { adminId },
    data: strings,
  })
}
export const updateGroup = (params) => {
  return request(`${admin_api}/updateGroup`, {
    method: 'post',
    params,
  })
}

// 获取用户列表
export const getUserPage = (params) => {
  return request(`${admin_api}/getUserPage`, {
    method: 'get',
    params,
  })
}

export const addUser = (adminId, fields) => {
  return request(`${admin_api}/addUser`, {
    method: 'post',
    params: { adminId },
    data: fields,
  })
}

export const deleteUser = (adminId, userIds) => {
  return request(`${admin_api}/deleteUser`, {
    method: 'delete',
    params: { adminId },
    data: userIds,
  })
}
export const updateUserInfo = (adminId, userInfo) => {
  return request(`${admin_api}/updateUserInfo`, {
    method: 'post',
    params: { adminId },
    data: userInfo,
  })
}
export const updateUserGroup = (adminId, groupId, userIds) => {
  return request(`${admin_api}/updateUserGroup`, {
    method: 'post',
    params: { adminId, groupId },
    data: userIds,
  })
}
export const getUserTemplate = () => {
  return request(`${admin_api}/getUserTemplate2`, {
    method: 'get',
  })
}
export const batchAddUser = (params, formData) => {
  return request(`${admin_api}/batchAddUser`, {
    method: 'post',
    params,
    data: formData,
    contentType: 'multipart/form-data',
  })
}
