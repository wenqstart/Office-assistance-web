import { getChatList } from '@/services/chat'
import { getUserinfo } from '@/utils/tool'
import { useModel } from '@umijs/max'
import { Avatar, List, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from './index.less'
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
  const { viewItem } = styles
  const [loading, setLoading] = useState(false)
  const { chooseMessage, currentMsg } = useModel('message')

  const [data, setData] = useState<DataType[]>([])
  const { userInfo } = useModel('user')

  const userNumber = userInfo?.number
  const activeStyle = {
    borderLeft: '2px solid #436FF6',
    backgroundColor: '#EFF0F1',
  }
  const loadMoreData = () => {
    if (loading) {
      return
    }
    console.log('userInfo', userInfo)

    const userId = userInfo?.id || getUserinfo()?.id
    if (userId) {
      setLoading(true)
      getChatList({ userId })
        .then((res) => {
          console.log('res.data', res.data)
          if (res.data && res.data.length > 0) {
            chooseMessage(res.data[0])
          }
          // setData([...data, ...res.data])
          setData(res.data)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }
  useEffect(() => {
    loadMoreData()
  }, [userInfo])

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
        hasMore={false}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
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
                  className={viewItem}
                  style={currentMsg.chatId === item.chatId ? activeStyle : {}}
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
                        {item.chatName?.slice(0, 1)}
                      </Avatar>
                    }
                    title={<span>{item.chatName}</span>}
                    description={
                      <div
                        style={{
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          width: '200px',
                        }}
                        dangerouslySetInnerHTML={{
                          __html:
                            item.content?.indexOf('<img') !== -1
                              ? '[图片]'
                              : item.content,
                        }}
                      ></div>
                    }
                  />
                  <div
                    style={{
                      color: '#8f959e',
                      fontSize: '12px',
                      transition: 'opacity .2s ease-in',
                    }}
                  >
                    {item.createTime}
                  </div>
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
