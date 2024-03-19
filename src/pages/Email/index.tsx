import * as React from 'react'
import { Button, Flex, Modal } from 'antd'
import EmailEditor from './components/EmailEditor'
import TabList from './components/TabList'
import EmailList from './components/EmailList'
import './index.less'

const Email: React.FC = () => {
  return (
    <div>
      <div>
        <Flex gap="small" wrap="wrap">
          <Button>写邮件</Button>
          <Button>回复</Button>
          <Button>删除</Button>
        </Flex>
      </div>
      <div className="content">
        <TabList></TabList>
        <EmailList></EmailList>
      </div>
    </div>
  )
}

export default Email
