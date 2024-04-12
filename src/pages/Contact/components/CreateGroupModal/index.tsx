import { MyBreadcrumb, type TBreadcrumb } from '@/components/MyBreadcrumb'
import { searchContactList } from '@/services/user'
import { debounce } from '@/utils/utils'
import { SearchOutlined, TeamOutlined } from '@ant-design/icons'
import { Avatar, Button, Input, Modal } from 'antd'
import React, { useState } from 'react'
import styles from './index.less'

const CreateGroupModal: React.FC<any> = (props) => {
  const { open, closeModal } = props
  const contactList = [
    {
      key: '1-1',
      label: '组织内联系人',
    },
    {
      key: '1-2',
      label: '我管理的群组',
    },
  ]

  const [breadcrumbList, setBreadcrumbList] = useState<TBreadcrumb[]>([
    { key: '1', label: '联系人' },
  ])
  const [searchValue, setSearchValue] = useState<string>('')

  const handleOk = () => {
    closeModal(false)
  }
  const handleCancel = () => {
    closeModal(false)
  }

  const onSearchValueChange = debounce(
    async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearchValue(e.target.value)
      const { data } = await searchContactList(e.target.value)
    },
    1000,
  )

  const clickItem = (item: any) => {
    if (breadcrumbList.find((data) => data.key === item.key)) return
    setBreadcrumbList([...breadcrumbList, { key: item.key, label: item.label }])
  }

  const clickLabel = (item: TBreadcrumb, i: number) => {
    if (breadcrumbList.length > 1 && i < breadcrumbList.length - 1) {
      setBreadcrumbList([...breadcrumbList.slice(0, i + 1)])
    }
  }

  return (
    <Modal
      open={open}
      title="创建群组"
      onOk={handleOk}
      onCancel={handleCancel}
      mask={false}
      footer={null}
    >
      <div className={styles.modalContent}>
        <div className={styles.groupInfoItem}>
          <span className={styles.label}>群名称</span>
          <Input placeholder="请输入群名称" size="large"></Input>
        </div>
        <div className={styles.groupInfoItem}>
          <span className={styles.label}>群头像</span>
          <Avatar
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 64, xxl: 64 }}
            icon={<TeamOutlined />}
            style={{ backgroundColor: '#2277ff' }}
          />
        </div>
        <div className={styles.groupInfoItem}>
          <span className={styles.label}>群成员</span>
          <div className={styles.memberSelectList}>
            <div className={styles.selectListLeft}>
              <Input
                addonBefore={<SearchOutlined />}
                size="large"
                placeholder="搜索联系人和我管理的群组"
                onChange={onSearchValueChange}
                allowClear
              />
              {breadcrumbList.length > 1 && (
                <MyBreadcrumb
                  items={breadcrumbList}
                  clickLabel={clickLabel}
                ></MyBreadcrumb>
              )}
              {breadcrumbList.length === 1 &&
                contactList.map((item) => (
                  <div
                    className={styles.contactListItem}
                    key={item.key}
                    onClick={() => clickItem(item)}
                  >
                    <span>{item.label}</span>
                    <span className={styles.arrow}></span>
                  </div>
                ))}
            </div>
            <div className={styles.selectListRight}></div>
          </div>
        </div>
        <div className={styles.btnFooter}>
          <Button onClick={handleCancel} size="large">
            取消
          </Button>
          <Button type="primary" onClick={handleOk} size="large">
            创建
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default CreateGroupModal
