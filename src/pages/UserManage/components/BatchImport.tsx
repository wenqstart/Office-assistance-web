import { Modal } from 'antd'
import React, { PropsWithChildren } from 'react'

interface BatchImportProps {
  modalVisible: boolean
  onCancel: () => void
}

const BatchImport: React.FC<PropsWithChildren<BatchImportProps>> = (props) => {
  const { modalVisible, onCancel } = props

  return (
    <Modal
      destroyOnClose
      title="批量创建"
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <div style={{ width: '400px' }}>{props.children}</div>
    </Modal>
  )
}

export default BatchImport
