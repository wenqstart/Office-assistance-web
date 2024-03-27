import { Button, Flex, Input, Modal, Upload } from 'antd'
import { Suspense, lazy, useState } from 'react'
import './index.less'

const WangEditor = lazy(() => import('@/components/WangEditor'))
const EmailEditorDialog = (props: {
  isShowModal: boolean
  onClose: (val: boolean) => void
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  return (
    <>
      <Modal
        open={props.isShowModal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
        mask={false}
      >
        <Flex gap="small" wrap="wrap">
          <Button type="primary" disabled={true}>
            发送
          </Button>
          <Button>保存</Button>
          <Upload>
            <Button>附件</Button>
          </Upload>
          <Upload>
            <Button>超大附件</Button>
          </Upload>
        </Flex>

        <div className="modalContent">
          <div className="inputBox">
            <div>收件人:</div>
            <Input></Input>
          </div>
          <div className="inputBox">
            <div>抄送:</div>
            <Input></Input>
          </div>
          <div className="inputBox">
            <div>主题:</div>
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
