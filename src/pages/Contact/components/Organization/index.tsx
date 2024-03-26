import { getOrganizationData } from '@/services/user'
import React, { useEffect, useState } from 'react'
import './index.less'

type TBreadcrumb = {
  id: string
  label: string
}

const Organization: React.FC = () => {
  const [breadcrumbList, setBreadcrumbList] = useState<TBreadcrumb[]>([
    {
      id: '0',
      label: '计算机与信息安全学院',
    },
  ])
  const [organizationData, setOrganizationData] = useState<any>([])

  const clickItem = (item: any) => {
    if (breadcrumbList.find((data) => data.id === item.id)) return
    setBreadcrumbList([...breadcrumbList, { id: item.id, label: item.name }])
  }

  const clickLabel = (item: TBreadcrumb, i: number) => {
    if (breadcrumbList.length > 1 && i < breadcrumbList.length - 1) {
      setBreadcrumbList([...breadcrumbList.slice(0, i + 1)])
    }
  }

  const _getOrganizationData = async () => {
    const { data } = await getOrganizationData()
    setOrganizationData(data || [])
  }

  useEffect(() => {
    _getOrganizationData()
  }, [])

  return (
    <div className="organizationContent">
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
        {organizationData.map((item: any) => {
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
              <div className="listItemRight">下级</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Organization
