import download from '@/assets/icons/download.png'
import LazyComponent from '@/components/LazyComponent/index'
import {
  getRepulseList,
  getSaveTaskInfo,
  getTaskDetail,
  getTaskReplyInfo,
  getUnCommitList,
  remindTask,
  replyTask,
  repulseTask,
} from '@/services/task'
import { useModel } from '@umijs/max'
import { Button, Drawer, Empty, Flex, Modal, Upload, message } from 'antd'
import React, { Suspense, lazy, useEffect, useRef, useState } from 'react'
import EmailEditorDialog from '../EmailEditorDialog'
import styles from './index.less'

const BASE_API = process.env.BASE_API

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
  const [messageApi, contextHolder] = message.useMessage()
  const htmlDetail = useRef()
  const [emailContent, setEmailContent] = useState<TEmailContent>(null)
  const [showTaskResModal, setShowTaskResModal] = useState(false)
  const [resContent, setResContent] = useState('')
  const [drawerLoading, setDrawerLoading] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(1)
  const [file, setFile] = useState()

  const [submitList, setSubmitList] = useState([]) // 已提交名单
  const [unSubmitList, setUnSubmitList] = useState([]) // 未提交名单
  const [repulsedList, setRepulsedList] = useState([]) // 被打回名单

  const submitStatusList = ['已提交', '待提交', '已打回']

  const _getTaskDetail = async () => {
    if (!id) {
      setEmailContent(null)
      return
    }
    const { code, data } =
      type === 1
        ? await getSaveTaskInfo(userInfo.id, id)
        : await getTaskDetail(userInfo.id, id)

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
    const { data, code } = await replyTask(userInfo.id, emailContent.id, file)
    if (code === 200) {
      setShowTaskResModal(false)
      messageApi.open({
        type: 'success',
        content: '上传成功！',
      })
    }
  }
  const showDrawerDetail = async () => {
    setOpenDrawer(true)
  }

  // 获取已提交
  const _getTaskReplyInfo = async () => {
    setDrawerLoading(true)
    const { data, code } = await getTaskReplyInfo(userInfo.id, id)
    setDrawerLoading(false)
    if (code === 200 && data) {
      setSubmitList(data)
    }
  }

  // 获取未提交
  const _getUnCommitList = async () => {
    setDrawerLoading(true)
    const { code, data } = await getUnCommitList(userInfo.id, id)
    setDrawerLoading(false)
    if (code === 200 && data) {
      setUnSubmitList(
        data.map((item) => ({
          number: Object.keys(item)[0],
          name: Object.values(item)[0],
        })),
      )
    }
  }

  // 获取被打回列表
  const _getRepulseList = async () => {
    setDrawerLoading(true)
    const { code, data } = await getRepulseList(userInfo.id, id)
    setDrawerLoading(false)
    if (code === 200 && data) {
      setRepulsedList(data)
    }
  }

  const clickStatus = (status: number) => {
    if (status === submitStatus) return
    setSubmitStatus(status)
    switch (status) {
      case 1:
        _getTaskReplyInfo()
        setUnSubmitList([])
        setRepulsedList([])
        break
      case 2:
        _getUnCommitList()
        setSubmitList([])
        setRepulsedList([])
        break
      case 3:
        _getRepulseList()
        setSubmitList([])
        setUnSubmitList([])
        break
      default:
        return
    }
  }

  const uploadChange = (info) => {
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        setFile(info.file.response.data)
      }
    }
  }
  // 打回材料
  const repulse = async (fileId: string) => {
    const { code, data } = await repulseTask(userInfo.id, fileId)
    if (code === 200) {
      setSubmitList(submitList.filter((item) => item.id !== fileId))
      messageApi.open({
        type: 'success',
        content: '打回成功',
      })
    } else {
      messageApi.open({
        type: 'error',
        content: '打回失败',
      })
    }
  }

  const pass = () => {}

  const remind = async (account: string) => {
    const { data, code } = await remindTask(userInfo.id, emailContent.id, [
      account,
    ])
    if (code === 200) {
      messageApi.open({
        type: 'success',
        content: '提醒成功!',
      })
    }
  }

  const remindAll = async () => {
    const { data, code } = await remindTask(
      userInfo.id,
      emailContent.id,
      unSubmitList.map((item) => item.number),
    )
    if (code === 200) {
      messageApi.open({
        type: 'success',
        content: '提醒成功!',
      })
    }
  }

  const [showPreview, setShowPreview] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const previewFile = (fileUrl: string) => {
    setShowPreview(true)
    setPreviewUrl(fileUrl)
  }

  const [showEditor, setShowEditor] = useState(false)
  const continueEditTask = () => {
    setShowEditor(true)
  }
  const closeModal = (val: boolean) => {
    setShowEditor(val)
  }

  useEffect(() => {
    _getTaskDetail()
    setOpenDrawer(false)
  }, [id])

  useEffect(() => {
    if (openDrawer) {
      setSubmitStatus(1)
      setUnSubmitList([])
      setRepulsedList([])
      _getTaskReplyInfo()
    }
  }, [openDrawer])

  const button = (() => {
    switch (type) {
      case TaskListType.RECEIVED_TASK:
        return <Button onClick={taskResponse}>上传材料</Button>
      case TaskListType.DRAFTS_TASK:
        return <Button onClick={continueEditTask}>继续编写</Button>
      case TaskListType.SENDED_TASK:
        return <Button onClick={showDrawerDetail}>查看提交情况</Button>
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
              emailContent.numberUserList
                .filter((item) => item.name !== emailContent.publisher)
                .map((item) => {
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
        {emailContent?.file && (
          <div className={styles.file}>
            <img src={download} />
            <a href={emailContent.file}>{`附件: ${
              emailContent.file.split('test/')[1]
            }`}</a>
            {/* <div onClick={() => previewFile(emailContent.file)}>预览</div> */}
          </div>
        )}
        <div className={styles.label}>任务描述:</div>
        <div ref={htmlDetail}></div>
      </div>
      <LazyComponent>
        <Modal
          open={showTaskResModal}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[]}
          mask={false}
        >
          <Flex gap="small" wrap="wrap">
            <Button type="primary" disabled={false} onClick={confirmReply}>
              确认上传
            </Button>
            <Upload
              onChange={uploadChange}
              name="file"
              crossOrigin=""
              action={`${BASE_API}/file/update`}
            >
              <Button>添加附件</Button>
            </Upload>
          </Flex>
          <div className={styles.modalContent}>
            <Suspense fallback={<div>loading...</div>}>
              <div className={styles.editor}>
                <WangEditor
                  contentChanged={(html) => contentChanged(html)}
                  style={{
                    height: '100%',
                    maxHeight: '400px',
                    overflow: 'auto',
                  }}
                ></WangEditor>
              </div>
            </Suspense>
          </div>
        </Modal>
        <Drawer
          destroyOnClose
          title="预览文件"
          size="large"
          placement="left"
          closable={true}
          open={showPreview}
          onClose={() => setShowPreview(false)}
        >
          <iframe src={previewUrl} width="100%" height="100%"></iframe>
        </Drawer>
        <Drawer
          destroyOnClose
          title="提交情况"
          size="large"
          placement="right"
          closable={true}
          open={openDrawer}
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
          {submitList.length > 0 && (
            <div className={styles.submitList}>
              {submitList.map((item) => {
                return (
                  <div key={item.id} className={styles.listItem}>
                    <div className={styles.itemContent}>
                      <div className={styles.userInfo}>
                        <span>姓名/单位:</span>
                        <span>{item.userName}</span>
                      </div>
                      <div className={styles.userInfo}>
                        <span>学号/工号:</span>
                        <span>{item.number}</span>
                      </div>
                      <div className={styles.file}>
                        <img src={download} />
                        <a href={item.url}>{`附件: ${item.name}`}</a>
                      </div>
                    </div>
                    <div className={styles.btnFlex}>
                      <Button onClick={pass}>完成</Button>
                      <Button danger onClick={() => repulse(item.id)}>
                        打回
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {unSubmitList.length > 0 && (
            <div className={styles.unSubmitListBox}>
              <div>
                <Button size="large" onClick={remindAll}>
                  一键提醒
                </Button>
              </div>
              <div className={styles.unSubmitList}>
                {unSubmitList.map((item) => {
                  return (
                    <div key={item.number} className={styles.unSubmitListItem}>
                      <div>
                        <div>{`学号/工号: ${item.number}`}</div>
                        <div>{`姓名/单位: ${item.name}`}</div>
                      </div>

                      <Button onClick={() => remind(item.number)}>提醒</Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {repulsedList.length > 0 && (
            <div className={styles.submitList}>
              {repulsedList.map((item) => {
                return (
                  <div key={item.id} className={styles.listItem}>
                    <div className={styles.itemContent}>
                      <div>
                        <span>姓名/单位:</span>
                        <span>{item.userName}</span>
                      </div>
                      <div>
                        <span>学号/工号:</span>
                        <span>{item.number}</span>
                      </div>
                      <div className={styles.file}>
                        <img src={download} />
                        <a href={item.url}>{`附件: ${item.name}`}</a>
                      </div>
                    </div>
                    <div className={styles.btnFlex}>
                      <Button onClick={() => remind(item.number)}>提醒</Button>
                      {/* <Button danger onClick={() => repulse(item.id)}>
                        打回
                      </Button> */}
                    </div>
                  </div>
                )
              })}
            </div>
          )}{' '}
          {!submitList.length &&
            !unSubmitList.length &&
            !repulsedList.length && <Empty className={styles.empty}></Empty>}
        </Drawer>
        <EmailEditorDialog
          isShowModal={showEditor}
          onClose={closeModal}
          saveData={emailContent}
        ></EmailEditorDialog>
      </LazyComponent>
    </div>
  )
}

export default EmailDetail
