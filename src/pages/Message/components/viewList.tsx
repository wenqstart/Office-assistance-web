import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Avatar, Divider, List, Skeleton } from 'antd'
import { useModel } from '@umijs/max'
import { getUserChatList_API } from '@/services/user'

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
      sayName: '单人',
      name: {
        title: 'Mr',
        first: '张',
        last: '三',
      },
      group: false,
      chatId: '1770820205788975105',
      number: '2000301209',
      email: 'jackson.may@example.com',
      picture: {
        large: 'https://randomuser.me/api/portraits/men/79.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/79.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/79.jpg',
      },
      nat: 'US',
    },
    {
      gender: 'male',
      sayName: '群聊',
      name: {
        title: 'Mr',
        first: '张',
        last: '三',
      },
      group: true,
      chatId: '1767776501935714306',
      number: '2000301209',
      email: 'jackson.may@example.com',
      picture: {
        large: 'https://randomuser.me/api/portraits/men/79.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/79.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/79.jpg',
      },
      nat: 'US',
    },
  ])
  const { userInfo } = useModel('user')

  const userId = userInfo?.id
  const userNumber = userInfo?.number

  const loadMoreData = () => {
    if (loading) {
      return
    }
    setLoading(true)
    getUserChatList_API({ userId })
      .then((res) => {
        console.log('res.data', res.data)

        setData([...data, ...res.data])
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
              {
                <List.Item
                  key={item.chatId}
                  onClick={() => chooseMessage(item)}
                  style={{
                    alignItems: 'start',
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        shape="square"
                        size={32}
                        style={{ backgroundColor: '#377DF7' }}
                      >
                        {item.sayName?.slice(0, 1)}
                      </Avatar>
                    }
                    title={<span>{item.sayName}</span>}
                    description={
                      <span
                        dangerouslySetInnerHTML={{
                          __html: item.content,
                        }}
                      ></span>
                    }
                  />
                  <span
                    style={{
                      color: '#8f959e',
                      fontSize: '12px',
                      transition: 'opacity .2s ease-in',
                    }}
                  >
                    {item.createTime}
                  </span>
                </List.Item>
              }
            </>
          )}
        />
      </InfiniteScroll>
    </div>
  )
}

export default ViewList
