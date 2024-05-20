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
  return request(`${task_api}/getTaskListForMe`, {
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
  return request(`${task_api}/getTaskListForOther`, {
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
  return request(`${task_api}/deleteTask`, {
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
  return request(`${task_api}/feedback`, {
    method: 'post',
    params: { userId },
    data: {
      taskId: data.taskId,
      content: data.content,
      fatherId: null,
    },
  })
}

// 获取任务详情
export const getTaskDetail = (userId: string, taskId: string) => {
  return request(`${task_api}/getTaskInfo`, {
    method: 'get',
    params: {
      userId,
      taskId,
    },
  })
}

// 保存编辑的任务
export const saveTask = (userId: string, data: TTaskData) => {
  return request(`${task_api}/saveTaskRecord`, {
    method: 'post',
    params: {
      userId,
    },
    data,
  })
}

// 获取草稿箱任务列表
export const getDraftList = (userId: string) => {
  return request(`${task_api}/getTaskRecord`, {
    method: 'get',
    params: {
      userId,
    },
  })
}

// 获取组织内所有人
export const getAllMember = (search?: string) => {
  return request(`${task_api}/getAllPeople`, {
    method: 'get',
  })
}

// 获取我删除的任务
export const getDeletedTaskList = (
  userId: string,
  size: number,
  current: number,
) => {
  return request(`${task_api}/getTaskListDeleteForMe`, {
    method: 'get',
    params: {
      userId,
      size,
      current,
    },
  })
}

// 提醒任务中的人
export const remindTaskMember = () => {}

export const getTaskReplyInfo = (userId: string, taskId: string) => {
  return request(`${task_api}/getFeedback`, {
    method: 'get',
    params: {
      userId,
      taskId,
    },
  })
}
