import { postTask } from '@/services/task'
import { useModel } from '@umijs/max'
import { Button, Flex, Input, Modal, Upload } from 'antd'
import { Suspense, lazy, useState } from 'react'
import styles from './index.less'

const WangEditor = lazy(() => import('@/components/WangEditor'))
const EmailEditorDialog = (props: {
  isShowModal: boolean
  onClose: (val: boolean) => void
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { userInfo } = useModel('user', (model: any) => ({
    userInfo: model.userInfo,
  }))

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    props.onClose(false)
  }

  const sendTask = () => {
    console.log('send')
    postTask(userInfo.id, {
      title: 'test',
      content: 'test content',
      type: 0,
      numbers: [''],
      endTime: '000',
    })
  }
  const saveEditTask = () => {
    console.log('save')
  }
  return (
    <>
      <Modal
        open={props.isShowModal}
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
            <Button>附件</Button>
          </Upload>
          <Upload>
            <Button>超大附件</Button>
          </Upload>
        </Flex>

        <div className={styles.modalContent}>
          <div className={styles.inputBox}>
            <div>主题 :</div>
            <Input></Input>
          </div>
          <div className={styles.inputBox}>
            <div>收件人 :</div>
            <Input></Input>
          </div>
          <div className={styles.inputBox}>
            <div>期限 :</div>
            <Input></Input>
          </div>

          <Suspense fallback={<div>loading...</div>}>
            <WangEditor></WangEditor>
          </Suspense>
        </div>
      </Modal>
    </>
  )
}

export default EmailEditorDialog
