import LoadingPage from '@/pages/LoadingPage/index.tsx'
import { getMessageByPoint } from '@/services/chat'
import { getOrganizationList } from '@/services/user'
import { history, useModel } from '@umijs/max'
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import './index.less'

type TBreadcrumb = {
  id: string
  label: string
}

const Organization: React.FC = () => {
  const { getCurrentChatId } = useModel('message')
  const { userInfo } = useModel('user', (model) => ({
    userInfo: model.userInfo,
  }))

  const [breadcrumbList, setBreadcrumbList] = useState<TBreadcrumb[]>([
    {
      id: '0',
      label: '计算机与信息安全学院',
    },
  ])
  const [organizationData, setOrganizationData] = useState<any>([])
  const [loading, setLoading] = useState(true)

  const _getOrganizationData = async (id?: string) => {
    setLoading(true)
    const { data } = await getOrganizationList(id)
    setLoading(false)
    const groupList =
      data.groupList?.map((item) => ({
        ...item,
        isDepartment: 1,
      })) || []
    const userList =
      data.userList?.map((item) => ({
        ...item,
        id: item.number,
        isDepartment: 0,
      })) || []
    setOrganizationData(groupList.concat(userList) || [])
  }

  const clickItem = async (item: any) => {
    if (!item.isDepartment) {
      getCurrentChatId({ number: item.number, group: false })
      await getMessageByPoint(userInfo.id, item.number, true)
      history.push('/message')
      return
    }
    if (breadcrumbList.find((data) => data.id === item.id)) return
    setBreadcrumbList([...breadcrumbList, { id: item.id, label: item.name }])

    _getOrganizationData(item.id)
  }

  const clickLabel = (item: TBreadcrumb, i: number) => {
    if (breadcrumbList.length > 1 && i < breadcrumbList.length - 1) {
      setBreadcrumbList([...breadcrumbList.slice(0, i + 1)])
      _getOrganizationData(item.id === '0' ? null : item.id)
    }
  }

  useEffect(() => {
    _getOrganizationData()
  }, [])

  return (
    <div className="organizationContent">
      <div className="organizationHeader">
        <div>组织架构</div>
        <Button type="default" size="large">
          添加成员
        </Button>
      </div>
      <div className="breadcrumbList">
        {breadcrumbList.map((item, i) => {
          return (
            <div key={i} className="breadcrumbItem">
              {i > 0 && <span className="separator"></span>}
              <div
                className={`label ${
                  breadcrumbList.length > 1 && i < breadcrumbList.length - 1
                    ? 'ableClick'
                    : ''
                }`}
                onClick={() => clickLabel(item, i)}
              >
                {item.label}
              </div>
            </div>
          )
        })}
      </div>
      <div className="organizationList">
        {loading && <LoadingPage size="large"></LoadingPage>}
        {!loading &&
          ((organizationData.length > 0 &&
            organizationData.map((item: any) => {
              return (
                <div
                  className="listItem"
                  key={item.id}
                  onClick={() => clickItem(item)}
                >
                  <div className="listItemLeft">
                    <div className="icon"></div>
                    <div>{item.name}</div>
                  </div>
                  {item.isDepartment > 0 && (
                    <div className="listItemRight">下级</div>
                  )}
                </div>
              )
            })) ||
            '暂无内容')}
      </div>
    </div>
  )
}

export default Organization
