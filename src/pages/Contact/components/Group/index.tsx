import LazyComponent from '@/components/LazyComponent/index'
import LoadingPage from '@/pages/LoadingPage/index.tsx'
import { getMessageByPoint } from '@/services/chat'
import { getJoiningGroup, getUserCreateGroup } from '@/services/contact'
import { history, useModel } from '@umijs/max'
import type { TabsProps } from 'antd'
import { Button, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import CreateGroupModal from '../CreateGroupModal'
import GroupList from '../GroupList/index'
import './index.less'

const Group: React.FC = () => {
  const [groupList, setGroupList] = useState<any>([])
  const [joinGroupList, setJoinGroupList] = useState<any>([])
  const [currentKey, setCurrentKey] = useState<string>('1')
  const [lastClickTime, setLastClickTime] = useState(null)

  const [open, setOpen] = useState(false)

  const { userInfo } = useModel('user', (model: any) => ({
    userInfo: model.userInfo,
  }))
  const { getCurrentChatId } = useModel('message')

  const [loading, setLoading] = useState(true)

  const onChange = (key: string) => {
    setCurrentKey(key)
  }

  const openModel = () => {
    setOpen(true)
  }
  const closeModal = (val: boolean) => {
    setOpen(val)
  }

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: '我创建的群组',
    },
    {
      key: '2',
      label: '我加入的群组',
    },
  ]

  const _getUserCreateGroup = async () => {
    setLoading(true)
    const { code, data } = await getUserCreateGroup(userInfo.id)
    setLoading(false)

    if (code === 200 && data && data.length > 0) {
      setGroupList([...data])
    }
  }
  const _getJoiningGroup = async () => {
    const { code, data } = await getJoiningGroup(userInfo.id)
    if (code === 200 && data && data.length > 0) {
      setJoinGroupList([...data])
    }
  }

  const clickItem = async (item) => {
    const currentTime = Date.now()
    if (lastClickTime && currentTime - lastClickTime < 300) {
      // 如果两次点击之间的时间小于300毫秒，则视为双击
      getCurrentChatId({ labelId: item.id, group: true })
      await getMessageByPoint(userInfo.id, item.id, false)
      history.push('/message')
      setLastClickTime(null) // 重置时间，以便下一次双击检测
    } else {
      setLastClickTime(currentTime)
    }
  }
  useEffect(() => {
    _getUserCreateGroup()
    _getJoiningGroup()
  }, [])

  return (
    <div className="groupContent">
      <div className="groupHeader">
        <div>我的群组</div>
        <Button type="default" size="large" onClick={openModel}>
          创建群组
        </Button>
      </div>
      <Tabs
        defaultActiveKey="1"
        items={tabItems.map((item) => ({
          key: item.key,
          label: `${item.label}(${
            item.key === '1' ? groupList.length : joinGroupList.length
          })`,
        }))}
        onChange={onChange}
      ></Tabs>
      {loading && <LoadingPage size="large"></LoadingPage>}
      {!loading && (
        <GroupList
          style={{ display: currentKey === '1' ? 'block' : 'none' }}
          groupList={groupList}
          clickItem={clickItem}
        ></GroupList>
      )}
      <GroupList
        style={{ display: currentKey === '2' ? 'block' : 'none' }}
        groupList={joinGroupList}
      ></GroupList>
      <LazyComponent>
        {open && (
          <CreateGroupModal
            open={open}
            closeModal={(val: boolean) => closeModal(val)}
          />
        )}
      </LazyComponent>
    </div>
  )
}

export default Group
