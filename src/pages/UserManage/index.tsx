import {
  addUser,
  batchAddUser,
  deleteUser,
  getGroupList,
  getUserPage,
  getUserTemplate,
  updateUserGroup,
  updateUserInfo,
} from '@/services/admin'
import { getUserinfo } from '@/utils/tool'
import { InboxOutlined } from '@ant-design/icons'
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components'
import type { UploadProps } from 'antd'
import {
  Button,
  Divider,
  Drawer,
  Popconfirm,
  Select,
  Upload,
  message,
} from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import BatchImport from './components/BatchImport'
import CreateForm from './components/CreateForm'
import SetGroup from './components/SetGroup'
import UpdateForm, { FormValueType } from './components/UpdateForm'
// const { addUser, queryUserList, deleteUser, modifyUser } =
//   services.UserController
const { Dragger } = Upload
/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  const hide = message.loading('正在添加')
  try {
    const { id: adminId } = getUserinfo()
    console.log('adminId', adminId)

    await addUser(adminId, fields)
    hide()
    message.success('添加成功')
    return true
  } catch (error) {
    hide()
    message.error('添加失败请重试！')
    return false
  }
}

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置')
  try {
    await modifyUser(
      {
        userId: fields.id || '',
      },
      {
        name: fields.name || '',
        nickName: fields.nickName || '',
        email: fields.email || '',
      },
    )
    hide()

    message.success('配置成功')
    return true
  } catch (error) {
    hide()
    message.error('配置失败请重试！')
    return false
  }
}

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: any[]) => {
  const hide = message.loading('正在删除')
  if (!selectedRows) return true
  try {
    const { id: adminId } = getUserinfo()

    await deleteUser(adminId, selectedRows.map((row) => row.number) || [])
    hide()
    message.success('删除成功，即将刷新')
    return true
  } catch (error) {
    hide()
    message.error('删除失败，请重试')
    return false
  }
}
const handleAddToGroup = async (groupId, selectedRows: any[]) => {
  const hide = message.loading('正在设置')
  if (!selectedRows) return true
  try {
    const { id: adminId } = getUserinfo()
    await updateUserGroup(
      adminId,
      groupId,
      selectedRows.map((row) => row.number) || [],
    )
    hide()
    message.success('设置成功，即将刷新')
    return true
  } catch (error) {
    hide()
    message.error('设置失败，请重试')
    return false
  }
}
const handleGetUserTemplate = async () => {
  const { data } = await getUserTemplate()

  const downloadLink = document.createElement('a')
  // 设置a标签的download属性为文件名
  downloadLink.download = '用户模板.xlsx'
  // 设置a标签的href属性为下载链接
  downloadLink.href = data.url
  // 将a标签添加到HTML文档中的某个元素中
  document.body.appendChild(downloadLink)
  // 触发a标签的点击事件，即模拟用户点击下载链接
  downloadLink.click()
  document.body.removeChild(downloadLink)
}

const TableList: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false)
  const [groupModalVisible, setGroupModalVisible] = useState<boolean>(false)
  const [batchModalVisible, setBatchModalVisible] = useState<boolean>(false)
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false)
  const [stepFormValues, setStepFormValues] = useState({})
  const actionRef = useRef<ActionType>()
  const [row, setRow] = useState<any>()
  const [selectedRowsState, setSelectedRows] = useState<any[]>([])
  const [groupList, setGroupList] = useState([])
  const [userList, setUserList] = useState([])
  const [pagination, setPagination] = useState({})
  const [currentFile, setCurrentFile] = useState({})
  const handledeleteUser = async (record) => {
    const { id: adminId } = getUserinfo()
    await deleteUser(adminId, [record.number])
    if (actionRef.current) {
      actionRef.current.reload()
    }
  }
  const getAllGroup = useCallback(async () => {
    const { data } = await getGroupList({
      current: 1,
      size: 9999,
      // @ts-ignore
      // sorter,
      // filter,
    })
    console.log('data', data)

    setGroupList(data.records)
  }, [])

  useEffect(() => {
    getAllGroup()
  }, [])

  const columns: any = [
    {
      title: '姓名',
      dataIndex: 'name',
      // tip: '名称不可重复',
      // hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '姓名为必填项',
          },
        ],
      },
    },
    {
      title: '编号',
      dataIndex: 'number',
      // tip: '名称不可重复',
      // hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '编号为必填项',
          },
        ],
      },
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      // tip: '名称不可重复',
      // hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '手机号码为必填项',
          },
        ],
      },
    },
    {
      title: '选择部门',
      dataIndex: 'adminGroupsId',
      tip: '选择部门',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请选择部门',
          },
        ],
      },
      renderFormItem: () => (
        <Select
          options={groupList.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
        />
      ),
    },
    {
      title: '性别',
      dataIndex: 'sex',
      // hideInTable: true,
      valueEnum: {
        1: { text: '男', status: 'MALE' },
        2: { text: '女', status: 'FEMALE' },
      },
    },
    {
      title: '初始密码',
      dataIndex: 'password',
      // tip: '名称不可重复',
      hideInTable: true,
      hideInSearch: true,
      // hideInForm: true,
      initialValue: '123456',
      readonly: true,
      // disable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '密码为必填项',
          },
        ],
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: any) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true)
              setStepFormValues(record)
            }}
          >
            配置
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="删除分组"
            description="确定删除该用户吗?"
            onConfirm={() => handledeleteUser(record)}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ]

  const groupColumns: any = [
    {
      title: '选择部门',
      dataIndex: 'groupId',
      tip: '选择部门',
      hideInTable: true,
      renderFormItem: () => (
        <Select
          options={groupList.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
        />
      ),
    },
  ]
  const batchProps: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }
    },
    beforeUpload: (file) => {
      setCurrentFile(file)
      return false
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const batchColumns: any = [
    {
      title: '导入用户',
      dataIndex: 'file',
      tip: '导入用户',
      // formItemProps: {
      //   rules: [
      //     {
      //       required: true,
      //       message: '请选择用户模板',
      //     },
      //   ],
      // },
      renderFormItem: () => (
        <Dragger {...batchProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
          <p className="ant-upload-hint">支持单文件上传</p>
        </Dragger>
      ),
    },
    {
      title: '选择部门',
      dataIndex: 'groupId',
      tip: '选择部门',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请选择部门',
          },
        ],
      },
      renderFormItem: () => (
        <Select
          options={groupList.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
        />
      ),
    },
  ]
  return (
    <PageContainer
      header={{
        title: '用户管理',
      }}
    >
      <ProTable
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="number"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleGetUserTemplate()}
          >
            下载模板
          </Button>,
          <Button
            key="1"
            type="primary"
            onClick={() => setBatchModalVisible(true)}
          >
            批量创建
          </Button>,
          <Button
            key="2"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const { current: searchCurrent, fatherId, pageSize, name } = params
          const searchParams = {
            ...params,
            current: searchCurrent,
            size: pageSize,
          }
          const { data } = await getUserPage({
            ...searchParams,

            // FIXME: remove @ts-ignore
            // @ts-ignore
            // sorter,
            // filter,
          })
          const { pages, size, total, current } = data
          setPagination({ pageSize: size, total, current })
          setUserList(data.records)
          return {
            data: data.records || [],
          }
        }}
        columns={columns}
        pagination={{
          ...pagination,
          // hideOnSinglePage: true,
          defaultPageSize: 10,
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
        }}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState)
              setSelectedRows([])
              actionRef.current?.reloadAndRest?.()
            }}
          >
            批量删除
          </Button>
          <Button
            type="primary"
            onClick={async () => {
              setGroupModalVisible(true)
            }}
          >
            设置部门
          </Button>
        </FooterToolbar>
      )}
      <BatchImport
        onCancel={() => setBatchModalVisible(false)}
        modalVisible={batchModalVisible}
      >
        <ProTable
          onSubmit={async (value) => {
            console.log('value', value)
            console.log('currentFile', currentFile)
            const { id: adminId } = getUserinfo()

            const formData = new FormData()
            formData.append('file', currentFile)
            console.log('formData', formData)

            const success = await batchAddUser(
              { adminId, groupId: value.groupId },
              formData,
            )
            if (success) {
              setBatchModalVisible(false)
              if (actionRef.current) {
                actionRef.current.reload()
              }
            }
          }}
          rowKey="groupId"
          type="form"
          columns={batchColumns}
        />
      </BatchImport>
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable
          onSubmit={async (value) => {
            const success = await handleAdd(value)
            if (success) {
              handleModalVisible(false)
              if (actionRef.current) {
                actionRef.current.reload()
              }
            }
          }}
          rowKey="number"
          type="form"
          columns={columns}
        />
      </CreateForm>
      <SetGroup
        onCancel={() => setGroupModalVisible(false)}
        modalVisible={groupModalVisible}
      >
        <ProTable
          onSubmit={async (value) => {
            await handleAddToGroup(value.groupId, selectedRowsState)
            setGroupModalVisible(false)
            setSelectedRows([])
            actionRef.current?.reloadAndRest?.()
          }}
          rowKey="groupId"
          type="form"
          columns={groupColumns}
        />
      </SetGroup>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const { id: adminId } = getUserinfo()
            const success = await updateUserInfo(adminId, value)
            if (success) {
              handleUpdateModalVisible(false)
              setStepFormValues({})
              if (actionRef.current) {
                actionRef.current.reload()
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false)
            setStepFormValues({})
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
          groupList={groupList.filter((item) => item.id !== stepFormValues.id)}
        />
      ) : null}

      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined)
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  )
}

export default TableList
