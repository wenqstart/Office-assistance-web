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
export default sendTask = (data: TTaskData) => {
  return request(`${task_api}/pushTask`, {
    method: 'post',
    data,
  })
}
