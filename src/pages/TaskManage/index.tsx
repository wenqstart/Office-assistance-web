import { getTaskCountApi } from '@/services/admin'
import { useModel } from '@umijs/max'
import ReactECharts from 'echarts-for-react'
import { useEffect, useState, useRef } from 'react'
import styles from './index.less'
import { Avatar, List, Skeleton, DatePicker, Input } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getUserPage } from '@/services/admin'
const { RangePicker } = DatePicker
// 在此组件中绘制一个简单的折线图
const TaskManage = () => {
  const { userInfo } = useModel('user')
  const [chartData, setChartData] = useState({})
  const [option, setOption] = useState({})
  const [currentUser, setCurrentUser] = useState({})
  const [loading, setLoading] = useState(false)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [number, setNumber] = useState('')
  const [current, setCurrent] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [personList, setPersonList] = useState([])
  const [data, setData] = useState([])
  const scrollViewRef = useRef()
  const [keyWord, setKeyWord] = useState('')
  const { Search } = Input

  function onSearch(params: any) {
    setKeyWord(params)
  }
  const userId = userInfo?.id
  const activeStyle = {
    borderLeft: '2px solid #436FF6',
    backgroundColor: '#EFF0F1',
  }
  async function getTaskCount(params = {}) {
    const res = await getTaskCountApi(userId, params)
    console.log('res', res)
    setChartData(res.data)
  }
  async function getAllUser(currentPage) {
    const res = await getUserPage({
      current: currentPage,
      size: 20,
    })
    console.log('res', res)
    setTotalCount(res.data?.total)
    setPersonList(res.data?.records)
    setData(res.data?.records)
  }
  useEffect(() => {
    getTaskCount()
    getAllUser(current)
  }, [])
  useEffect(() => {
    const filterData = data.filter((item) => item.name.indexOf(keyWord) !== -1)
    setPersonList(filterData)
  }, [keyWord])
  useEffect(() => {
    if (currentUser.number) {
      getTaskCount({
        number: currentUser.number,
        startTime2: startTime,
        endTime2: endTime,
      })
    }
  }, [currentUser, startTime, endTime])
  useEffect(() => {
    setOption({
      title: {
        text: '任务统计',
        subtext: chartData?.title,
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
            {
              value: chartData?.taskSum - chartData?.finishSum || 0,
              name: '未完成任务',
            },
            { value: chartData?.finishSum || 0, name: '已完成任务' },
            { value: chartData?.deleteSum || 0, name: '已删除任务' },
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
  const loadMoreData = () => {
    if (loading) {
      return
    }
    setLoading(true)
    setTimeout(() => {
      getAllUser(current + 1)
      setCurrent(current + 1)
      // 需要手动移动滚动条，防止一直触发
      if (scrollViewRef.current && scrollViewRef.current.el) {
        scrollViewRef.current.el.scrollTop += 150
      }
      console.log('scrollViewRef', scrollViewRef.current)
      // userChatRef.scrollTop = 30
      setLoading(false)
    }, 1000)
  }
  function onTimeChange(date: any, dateString: string) {
    console.log('dateString', dateString)
    setStartTime(dateString[0])
    setEndTime(dateString[1])
  }
  function choosePerson(item: any) {
    setCurrentUser(item)
  }
  return (
    <div className={styles.wrap}>
      <div className={styles.leftcontent}>
        <RangePicker showTime onChange={onTimeChange} />
        <ReactECharts className={styles.charts} option={option} />
        {chartData?.title && chartData?.taskSum !== 0 && (
          <div>任务完成率：{chartData?.finishSum / chartData?.taskSum} %</div>
        )}
      </div>
      <div
        className={styles.userList}
        id="userList"
        style={{
          height: '75vh',
          overflow: 'auto',
          paddingRight: '16px',
          // border: '1px solid rgba(140, 140, 140, 0.35)',
        }}
      >
        <div className={styles.search}>
          <Search placeholder="搜索用户" allowClear onSearch={onSearch} />
        </div>
        <InfiniteScroll
          ref={scrollViewRef}
          dataLength={personList.length}
          next={loadMoreData}
          hasMore={personList.length < totalCount}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="userList"
        >
          <List
            dataSource={personList}
            renderItem={(item) => (
              <>
                {
                  <List.Item
                    key={item.number}
                    onClick={() => choosePerson(item)}
                    className={styles.viewItem}
                    style={
                      currentUser.number === item.number ? activeStyle : {}
                    }
                  >
                    <List.Item.Meta
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      avatar={
                        <Avatar
                          shape="square"
                          size={40}
                          style={{ backgroundColor: '#377DF7' }}
                        >
                          {item.name?.slice(0, 1)}
                        </Avatar>
                      }
                      title={<span>{item.name}</span>}
                    />
                    {/* <div
                      style={{
                        color: '#8f959e',
                        fontSize: '12px',
                        transition: 'opacity .2s ease-in',
                      }}
                    >
                      {item.createTime}
                    </div> */}
                  </List.Item>
                }
              </>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default TaskManage
