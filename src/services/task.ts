import { request } from '@umijs/max'
const BASE_API = process.env.BASE_API
const task_api = BASE_API + '/task'

export type TTaskData = {
  title: string
  content: string
  type: number
  numbers: string[]
  endTime: string
}

// 发布任务(发布邮件)
export const postTask = (userId: string, data: TTaskData) => {
  return request(`${task_api}/pushTask`, {
    method: 'post',
    params: { userId },
    data,
  })
}
// 获取用户已发送的任务
export const getUserSendedTask = (
  userId: string,
  size: number,
  current: number,
) => {
  return request(`${group_api}/getTaskListForMe`, {
    method: 'get',
    params: {
      userId,
      size,
      current,
    },
  })
}

// 获取用户接收到的任务
export const getUserReceivedTask = (
  userId: string,
  size: number,
  current: number,
) => {
  return request(`${group_api}/getTaskListForOther`, {
    method: 'get',
    params: {
      userId,
      size,
      current,
    },
  })
}

// 删除接收到的任务
export const deleteTask = (userId: string, taskId: string) => {
  return request(`${group_api}/getTaskListForOther`, {
    method: 'delete',
    params: {
      userId,
      taskId,
    },
  })
}

export type TReplyContent = {
  taskId: string
  content: string
  fatherId: string
}
// 回复接收的任务
export const replyTask = (userId: string, data: TReplyContent) => {
  return request(`${group_api}/feedback`, {
    method: 'delete',
    params: {
      userId,
      taskId,
    },
  })
}
