import { getOrganizationData } from '@/services/user'
import React, { useEffect, useState } from 'react'
import './index.less'

type TGroupInfo = {
  name: string
}

type TBreadcrumb = {
  id: string
  label: string
}

const Organization: React.FC = () => {
  const [breadcrumbList, setBreadcrumbList] = useState<string[]>([
    '计算机与信息安全学院',
  ])
  const [organizationData, setOrganizationData] = useState<any>([])

  const clickItem = (item: any) => {
    setBreadcrumbList([...breadcrumbList, item.name])
  }

  const clickLabel = (i: number) => {
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
              <span
                className={`label ${
                  breadcrumbList.length > 1 && i < breadcrumbList.length - 1
                    ? 'ableClick'
                    : ''
                }`}
                onClick={() => clickLabel(i)}
              >
                {item}
              </span>
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
              <div className="icon"></div>
              <div>{item.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Organization
