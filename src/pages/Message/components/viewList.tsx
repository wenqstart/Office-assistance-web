import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Avatar, Divider, List, Skeleton } from 'antd'
import { useModel } from '@umijs/max'

interface DataType {
  gender: string
  name: {
    title: string
    first: string
    last: string
  }
  email: string
  picture: {
    large: string
    medium: string
    thumbnail: string
  }
  nat: string
}

const ViewList: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { chooseMessage } = useModel('websocket')

  const [data, setData] = useState<DataType[]>([
    {
      gender: 'male',
      fullnName: '温泉',
      name: {
        title: 'Mr',
        first: '温',
        last: '泉',
      },
      number: '200030111',
      email: 'wq.may@example.com',
      picture: {
        large: 'https://randomuser.me/api/portraits/men/79.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/79.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/79.jpg',
      },
      nat: 'US',
    },
    {
      gender: 'male',
      fullnName: '张三',
      name: {
        title: 'Mr',
        first: '张',
        last: '三',
      },
      number: '2000301209',
      email: 'zs.may@example.com',
      picture: {
        large: 'https://randomuser.me/api/portraits/men/79.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/79.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/79.jpg',
      },
      nat: 'US',
    },
  ])
  const { userInfo } = useModel('user')

  const userNumber = userInfo?.number

  const loadMoreData = () => {
    if (loading) {
      return
    }
    setLoading(true)
    fetch(
      'https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo',
    )
      .then((res) => res.json())
      .then((body) => {
        setData([...data, ...body.results])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    loadMoreData()
  }, [])

  return (
    <div
      id="viewList"
      style={{
        height: '75vh',
        overflow: 'auto',
        paddingRight: '16px',
        // border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length < 50}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="viewList"
      >
        <List
          dataSource={data}
          renderItem={(item) => (
            <>
              {item?.number !== userNumber && (
                <List.Item key={item.email} onClick={() => chooseMessage(item)}>
                  <List.Item.Meta
                    avatar={<Avatar src={item.picture?.large} />}
                    title={<a href="https://ant.design">{item.name.last}</a>}
                    description={item.email}
                  />
                  <div>Content</div>
                </List.Item>
              )}
            </>
          )}
        />
      </InfiniteScroll>
    </div>
  )
}

export default ViewList
