import ImgUploader from '@/components/ImgUploader/index.tsx'
import { MyBreadcrumb, type TBreadcrumb } from '@/components/MyBreadcrumb'
import CloseBtn from '@/components/MyButton/CloseBtn/index'
import { getUserCreateGroup } from '@/services/contact'
import { createGroup } from '@/services/group.ts'
import { getOrganizationList, searchContactList } from '@/services/user'
import { debounce } from '@/utils/utils'
import { SearchOutlined } from '@ant-design/icons'
import { useModel } from '@umijs/max'
import { Button, Checkbox, Input, Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.less'

type TSelectedGroupMember = {
  person: number
  group: number
  department: number
}
const CreateGroupModal: React.FC<any> = (props) => {
  const { userInfo } = useModel('user', (model: any) => ({
    userInfo: model.userInfo,
  }))
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

  const dataRef = useRef(new Map())
  const newGroupInfo = useRef({
    userId: userInfo.id,
    name: '',
    picture: '',
    members: [],
  })

  const [breadcrumbList, setBreadcrumbList] = useState<TBreadcrumb[]>([
    { key: '1', label: '联系人' },
  ])
  const [btnLoading, setBtnLoading] = useState(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [checkList, setCheckList] = useState<any>([])
  const [currentSelectedData, setCurrentSelectedData] = useState<any>({
    person: 0,
    group: 0,
    department: 0,
    selectList: [],
  })

  useEffect(() => {}, [])

  const handleOk = async () => {
    newGroupInfo.current.members = Array.from(
      new Set(
        currentSelectedData.selectList
          .reduce((a, b) => a.concat(b.numberList), [])
          .concat(userInfo.number),
      ),
    )
    setBtnLoading(true)
    const { data } = await createGroup(newGroupInfo.current)
    setBtnLoading(false)
    closeModal(false)
    dataRef.current = null
  }
  const handleCancel = () => {
    closeModal(false)
    dataRef.current = null
  }
  const onGroupNameChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      newGroupInfo.current.name = e.target.value
    },
    1000,
  )

  const onSearchValueChange = debounce(
    async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearchValue(e.target.value)
      const { data } = await searchContactList(e.target.value)
    },
    1000,
  )

  // 点击组织内联系人或者我的群组
  const clickContactItem = async (item: any) => {
    if (breadcrumbList.find((data) => data.key === item.key)) return
    setBreadcrumbList([...breadcrumbList, { key: item.key, label: item.label }])
    if (!dataRef.current.get(item.key)) {
      if (item.key === contactList[1].key) {
        const { data } = await getUserCreateGroup(userInfo.id)
        const value = data.map((i) => ({
          id: i.id,
          parent: item.key,
          number: i.number,
          label: i.name,
          checked: false,
          disabled: false,
          isGroup: 1,
          isDepartment: 0,
          sum: i.sum ?? 0,
        }))

        dataRef.current.set(item.key, value)
        setCheckList([...value])
      } else if (item.key === contactList[0].key) {
        const { data } = await getOrganizationList()
        const userList = (data.userList ?? []).map((i) => ({
          ...i,
          isDepartment: 0,
        }))
        const groupList = (data.groupList ?? []).map((i) => ({
          ...i,
          isDepartment: 1,
        }))

        const value = groupList.concat(userList).map((i) => ({
          id: i.id,
          parent: item.key,
          number: 0,
          label: i.name,
          checked: false,
          disabled: false,
          isGroup: 0,
          isDepartment: i.isDepartment,
          sum: i.sum ?? 0,
          numberList: i.numberList ?? [],
        }))
        if (value.length > 0) {
          dataRef.current.set(item.key, value)
          setCheckList([...value])
        }
      }
    } else {
      setCheckList([...dataRef.current.get(item.key)])
    }
  }

  // 点击面包屑label
  const clickBreadcrumbLabel = (item: TBreadcrumb, i: number) => {
    if (breadcrumbList.length > 1 && i < breadcrumbList.length - 1) {
      setBreadcrumbList([...breadcrumbList.slice(0, i + 1)])
    }
  }

  // 选择联系人
  const onSelect = (item: any) => {
    setCheckList(
      checkList.map((checkItem) => {
        return checkItem.id === item.id
          ? { ...checkItem, checked: !checkItem.checked }
          : checkItem
      }),
    )

    // 如果选中
    if (!item.checked) {
      setCurrentSelectedData({
        person:
          !item.isDepartment && !item.isGroup
            ? currentSelectedData.person + 1
            : 0,
        department: (currentSelectedData.department += item.isDepartment
          ? 1
          : 0),
        group: (currentSelectedData.group += item.isGroup ? 1 : 0),
        selectList: [...currentSelectedData.selectList, { ...item }],
      })
    } else {
      setCurrentSelectedData({
        person:
          !item.isDepartment && !item.isGroup
            ? currentSelectedData.person - 1
            : 0,
        department: (currentSelectedData.department += item.isDepartment
          ? -1
          : 0),
        group: (currentSelectedData.group += item.isGroup ? -1 : 0),
        selectList: [
          ...currentSelectedData.selectList.filter((i) => i.id !== item.id),
        ],
      })
    }
  }

  // 点击下级按钮
  const clickNext = (e: any, item: any) => {
    e.stopPropagation()
  }

  // 取消选择
  const cancelSelect = (item: any) => {
    console.log(item)
  }

  const uploadSuccess = (res) => {
    newGroupInfo.current.picture = res.url
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
          <Input
            placeholder="请输入群名称"
            size="large"
            onChange={onGroupNameChange}
          ></Input>
        </div>
        <div className={styles.groupInfoItem}>
          <span className={styles.label}>群头像</span>
          <ImgUploader uploadSuccess={uploadSuccess} />
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
                <>
                  <MyBreadcrumb
                    items={breadcrumbList}
                    clickLabel={clickBreadcrumbLabel}
                  ></MyBreadcrumb>
                  <div className={styles.checkList}>
                    {checkList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className={styles.checkBox}
                      >
                        <div className={styles.checkBoxLeft}>
                          <Checkbox
                            disabled={item.disabled}
                            checked={item.checked}
                          />
                          <span className={styles.icon}></span>
                          <div>{item.label}</div>
                        </div>

                        {item.isDepartment > 0 && (
                          <div
                            className={styles.nextBtn}
                            onClick={(e) => clickNext(e, item)}
                          >
                            下级
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {breadcrumbList.length === 1 &&
                contactList.map((item) => (
                  <div
                    className={styles.contactListItem}
                    key={item.key}
                    onClick={() => clickContactItem(item)}
                  >
                    <span>{item.label}</span>
                    <span className={styles.arrow}></span>
                  </div>
                ))}
            </div>
            <div className={styles.selectListRight}>
              <div>
                <span>{`已选: ${currentSelectedData.person}人`}</span>
                {currentSelectedData.group > 0 && (
                  <span>{`, ${currentSelectedData.group}个群组`}</span>
                )}
                {currentSelectedData.department > 0 && (
                  <span>{`, ${currentSelectedData.department}个部门`}</span>
                )}
              </div>
              <div className={styles.selectList}>
                {currentSelectedData.selectList.length > 0 &&
                  currentSelectedData.selectList.map((item) => (
                    <div key={item.id} className={styles.selectedItemBox}>
                      <div>
                        <span>{item.label}</span>
                        {item.sum > 0 && <span>{`(${item.sum})`}</span>}
                      </div>
                      <CloseBtn onClick={() => cancelSelect(item)}></CloseBtn>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.btnFooter}>
          <Button onClick={handleCancel} size="large">
            取消
          </Button>
          <Button
            type="primary"
            onClick={handleOk}
            size="large"
            loading={btnLoading}
          >
            创建
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default CreateGroupModal
