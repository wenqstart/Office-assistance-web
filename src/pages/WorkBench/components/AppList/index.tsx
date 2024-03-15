import * as React from 'react'
import AppItem, { TAppItem } from '../AppItem'

type TAppListData = {
  appListData: TAppItem[]
}

const AppList = (props: TAppListData) => {
  const { appListData } = props
  return appListData.map((item: TAppItem) => {
    return <AppItem appItem={item} key={item.appLink}></AppItem>
  })
}

export default AppList
