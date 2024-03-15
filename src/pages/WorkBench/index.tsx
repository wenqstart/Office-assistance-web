import * as React from 'react'
import { Tabs } from 'antd'
import AppList from './components/AppList'
import AppItem from './components/AppItem'

const WorkBench: React.FC = () => {
  const { TabPane } = Tabs
  const tabList = ['全部应用', '教学互动']
  const contentList = [
    {
      appName: '数据结构',
      appLink: '',
      icon: '',
      desc: '',
    },
  ]

  const onChange = (key: string) => {
    console.log(key)
  }

  return (
    <div>
      <div>工作台</div>
      <Tabs onChange={onChange} type="card">
        {tabList.map((item, i) => {
          return (
            <TabPane key={i} tab={item}>
              <AppList appListData={contentList}></AppList>
            </TabPane>
          )
        })}
      </Tabs>
    </div>
  )
}

export default WorkBench
