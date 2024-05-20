import { getTaskCountApi } from '@/services/admin'
import { useModel } from '@umijs/max'
import ReactECharts from 'echarts-for-react'
import { useEffect, useState } from 'react'
// 在此组件中绘制一个简单的折线图
const TaskManage = () => {
  const { userInfo } = useModel('user')
  const [chartData, setChartData] = useState({})
  const [option, setOption] = useState({})

  const userId = userInfo?.id
  async function getTaskCount() {
    const res = await getTaskCountApi(userId)
    console.log('res', res)
    setChartData(res.data)
  }
  useEffect(() => {
    getTaskCount()
  }, [])
  useEffect(() => {
    setOption({
      title: {
        text: '任务统计',
        subtext: chartData.title,
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: chartData.taskSum, name: '任务总数' },
            { value: chartData.finishSum, name: '任务完成' },
            { value: chartData.draftSum, name: '任务取消' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    })
  }, [chartData])
  // 返回折线图的配置对象

  return (
    <div>
      <ReactECharts option={option} />
    </div>
  )
}

export default TaskManage
