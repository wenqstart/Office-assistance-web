import { SearchOutlined } from '@ant-design/icons'
import { Button, Input, Modal } from 'antd'
import React from 'react'
import './index.less'

const CreateGroupModal: React.FC<any> = (props) => {
  const { open, closeModal } = props

  const handleOk = () => {
    closeModal(false)
  }
  const handleCancel = () => {
    closeModal(false)
  }
  return (
    <>
      <Modal
        open={open}
        title="创建群组"
        onOk={handleOk}
        onCancel={handleCancel}
        mask={false}
        footer={null}
      >
        <div className="modalContent">
          <div className="groupInfoItem">
            <span>群名称</span>
            <Input placeholder="请输入群名称"></Input>
          </div>
          <div className="groupInfoItem">
            <span>群头像</span>{' '}
          </div>
          <div className="groupInfoItem">
            <span>群成员</span>
            <div className="memberSelectList">
              <div className="selectListLeft">
                <Input
                  addonBefore={<SearchOutlined />}
                  size="large"
                  placeholder="搜索联系人和我管理的群组"
                />
              </div>
              <div className="selectListRight"></div>
            </div>
          </div>
          <div className="btnFooter">
            <Button onClick={handleCancel} size="large">
              取消
            </Button>
            <Button type="primary" onClick={handleOk} size="large">
              创建
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default CreateGroupModal
