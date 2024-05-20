import { getAllMember, postTask, saveTask } from '@/services/task'
import { timeFormatter } from '@/utils/format'
import { useModel } from '@umijs/max'
import type { GetProps } from 'antd'
import {
  Button,
  DatePicker,
  Flex,
  Input,
  Modal,
  TreeSelect,
  Upload,
} from 'antd'
import { Suspense, lazy, useEffect, useState } from 'react'
import styles from './index.less'

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

const WangEditor = lazy(() => import('@/components/WangEditor'))
const { SHOW_PARENT } = TreeSelect

const EmailEditorDialog = (props: {
  isShowModal: boolean
  onClose: (val: boolean) => void
}) => {
  const { isShowModal, onClose } = props

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [endTime, setEndTime] = useState('')
  const [treeValue, setTreeValue] = useState([])
  const [treeData, setTreeData] = useState([])

  const { userInfo } = useModel('user', (model: any) => ({
    userInfo: model.userInfo,
  }))
  const { onTaskSend } = useModel('taskSocket')

  const onSelectTreeChange = (newValue: string[]) => {
    console.log(newValue)

    setTreeValue(newValue)
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
    onClose(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    onClose(false)
  }

  const sendTask = () => {
    const taskData = {
      title,
      content,
      type: 0,
      numbers: treeValue,
      endTime: timeFormatter(endTime),
    }
    postTask(userInfo.id, taskData)
    onTaskSend(taskData)
    setIsModalOpen(false)
    props.onClose(false)
  }
  const saveEditTask = () => {
    saveTask(userInfo.id, {
      title,
      content,
      type: 0,
      numbers: treeValue,
      endTime: timeFormatter(endTime),
    })
    setIsModalOpen(false)
    props.onClose(false)
  }

  const titleChanged = (e) => {
    setTitle(e.target.value)
  }

  const contentChanged = (html) => {
    setContent(html)
  }

  const onTimeChanged = (value, dateString) => {
    setEndTime(dateString)
  }

  const _getAllMember = async () => {
    const { data } = await getAllMember()
    const list = Object.values(data[0])[0].map((item) => ({
      title: item.name,
      value: item.number,
    }))
    setTreeData([
      {
        title: '组织联系人',
        value: '0',
        key: '0',
        children: [
          ...list
            .map((item, idx) => ({
              title: item.title,
              value: item.value,
              key: item.value,
            }))
            .filter((item) => item.value !== userInfo.number),
        ],
      },
    ])
    console.log(list)
  }
  useEffect(() => {
    if (isShowModal) {
      _getAllMember()
    }
  }, [isShowModal])

  const treeProps = {
    treeData,
    value: treeValue,
    onChange: onSelectTreeChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: '请选择收件人',
    style: {
      width: '100%',
    },
  }

  return (
    <>
      <Modal
        open={isShowModal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
        maskClosable={false}
        mask={false}
      >
        <Flex gap="small" wrap="wrap">
          <Button type="primary" disabled={false} onClick={sendTask}>
            发送
          </Button>
          <Button onClick={saveEditTask}>保存</Button>
          <Upload>
            <Button>添加附件</Button>
          </Upload>
        </Flex>

        <div className={styles.modalContent}>
          <div className={styles.inputBox}>
            <div className={styles.inputLabel}>主题 :</div>
            <Input onChange={(e) => titleChanged(e)}></Input>
          </div>
          <div className={`${styles.inputBox} ${styles.select}`}>
            <div className={styles.inputLabel}>收件人 :</div>
            <TreeSelect {...treeProps} />
          </div>
          <div className={styles.inputBox}>
            <div className={styles.inputLabel}>截止时间 :</div>
            <DatePicker
              showTime
              onChange={(value, dateString) => onTimeChanged(value, dateString)}
            />
          </div>

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
    </>
  )
}

export default EmailEditorDialog
