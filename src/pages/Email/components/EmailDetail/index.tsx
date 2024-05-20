import { getTaskDetail, getTaskReplyInfo, replyTask } from '@/services/task'
import { useModel } from '@umijs/max'
import { Button, Drawer, Flex, Modal, Upload } from 'antd'
import React, { Suspense, lazy, useEffect, useRef, useState } from 'react'
import styles from './index.less'

enum TaskListType {
  RECEIVED_TASK = 0, // 收件箱
  DRAFTS_TASK = 1, // 草稿箱
  SENDED_TASK = 2, // 已发送
  DELETED_TASK = 3, // 已删除
}

type TEmailDetailProp = {
  id: string
  type: number
}

type TEmailContent = {
  id: string
  publisher: string
  read: string | number
  state: number
  sum: number
  title: string
  type: string
  content: string
  createTime: string
  updateTime: string
}

const WangEditor = lazy(() => import('@/components/WangEditor'))

const EmailDetail: React.FC = (props: TEmailDetailProp) => {
  const { id, type } = props
  const { userInfo } = useModel('user', (model: any) => ({
    userInfo: model.userInfo,
  }))

  const htmlDetail = useRef()
  const [emailContent, setEmailContent] = useState<TEmailContent>(null)
  const [showTaskResModal, setShowTaskResModal] = useState(false)
  const [resContent, setResContent] = useState('')
  const [drawerLoading, setDrawerLoading] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(1)
  const submitStatusList = ['已提交', '未提交', '已打回']

  const _getTaskDetail = async () => {
    if (!id) {
      setEmailContent(null)
      return
    }
    const { code, data } = await getTaskDetail(userInfo.id, id)

    if (code === 200 && data && data.content !== null) {
      setEmailContent(data)
      htmlDetail.current.innerHTML = data?.content || '暂无内容'
    } else {
      htmlDetail.current.innerHTML = '暂无内容'
    }
  }
  const contentChanged = (html) => {
    setResContent(html)
  }
  const taskResponse = () => {
    setShowTaskResModal(true)
  }
  const handleOk = () => {
    setShowTaskResModal(false)
  }

  const handleCancel = () => {
    setShowTaskResModal(false)
  }

  const confirmReply = async () => {
    const { data } = await replyTask(userInfo.id, {
      taskId: id,
      content: resContent,
      fatherId: '',
    })
  }
  const showDrawerDetail = async () => {
    setOpenDrawer(true)
    const { data } = await getTaskReplyInfo(userInfo.id, id)
  }

  const clickStatus = (status: number) => {
    if (status === submitStatus) return
    setSubmitStatus(status)
    if (status === 1) {
    } else {
    }
  }

  useEffect(() => {
    _getTaskDetail()
  }, [id])

  const button = (() => {
    switch (type) {
      case TaskListType.RECEIVED_TASK:
        return <Button onClick={taskResponse}>回复</Button>
      case TaskListType.DRAFTS_TASK:
        return <Button>继续编写</Button>
      case TaskListType.SENDED_TASK:
        return <Button onClick={showDrawerDetail}>查看反馈详情</Button>
      case TaskListType.DELETED_TASK:
        return <></>
      default:
        return <></>
    }
  })()

  return (
    <div className={styles.emailDetail}>
      <div className={styles.title}>
        <span>{emailContent?.title || '(暂无主题)'}</span>
        {button}
      </div>
      <div className={styles.content}>
        <div>
          <div className={styles.label}>发件人:</div>
          <div>{emailContent?.publisher ?? '暂无发送人'}</div>
        </div>
        <div>
          <div className={styles.label}>收件人:</div>
          <div className={styles.tagList}>
            {emailContent?.numberUserList &&
              emailContent.numberUserList.length > 0 &&
              emailContent.numberUserList.map((item) => {
                return (
                  <span key={item.number} className={styles.tagItem}>
                    {item.name}
                  </span>
                )
              })}
          </div>
        </div>
        <div>
          <div className={styles.label}>截止时间:</div>
          <div>{emailContent?.endTime ?? '暂无发送人'}</div>
        </div>
        <div className={styles.label}>任务描述:</div>
        <div ref={htmlDetail}></div>
      </div>
      <Modal
        open={showTaskResModal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
        mask={false}
      >
        <Flex gap="small" wrap="wrap">
          <Button type="primary" disabled={false} onClick={confirmReply}>
            确认回复
          </Button>
          <Upload>
            <Button>添加附件</Button>
          </Upload>
        </Flex>
        <div className={styles.modalContent}>
          <Suspense fallback={<div>loading...</div>}>
            <div className={styles.editor}>
              <WangEditor
                contentChanged={(html) => contentChanged(html)}
                style={{ height: '100%', maxHeight: '400px', overflow: 'auto' }}
              ></WangEditor>
            </div>
          </Suspense>
        </div>
      </Modal>
      <Drawer
        styles={{ mask: { width: '450px' } }}
        destroyOnClose
        title="反馈详情"
        placement="right"
        closable={true}
        mask={false}
        open={openDrawer}
        loading={drawerLoading}
        onClose={() => setOpenDrawer(false)}
      >
        <div className={styles.submitStatusTabs}>
          {submitStatusList.map((item, i) => {
            return (
              <div
                key={item}
                className={`${styles.submitStatusTabsItem} ${
                  submitStatus === i + 1 ? styles.activeStatus : ''
                }`}
                onClick={() => clickStatus(i + 1)}
              >
                {item}
              </div>
            )
          })}
        </div>
      </Drawer>
    </div>
  )
}

export default EmailDetail
