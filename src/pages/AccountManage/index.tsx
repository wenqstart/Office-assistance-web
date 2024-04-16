import {
  addNewGroup,
  deleteGroup,
  getGroupList,
  updateGroup,
} from '@/services/admin'
import { getUserinfo } from '@/utils/tool'
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components'
import { Button, Divider, Drawer, Popconfirm, Select, message } from 'antd'
import moment from 'moment'
import React, { useRef, useState } from 'react'
import CreateForm from './components/CreateForm'
import UpdateForm, { FormValueType } from './components/UpdateForm'
// const { addUser, queryUserList, deleteUser, modifyUser } =
//   services.UserController

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  const hide = message.loading('正在添加')
  try {
    const { id: adminId } = getUserinfo()
    console.log('adminId', adminId)

    await addNewGroup({ adminId, ...fields })
    hide()
    message.success('添加成功')
    return true
  } catch (error) {
    hide()
    message.error('添加失败请重试！')
    return false
  }
}

const TableList: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false)
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false)
  const [stepFormValues, setStepFormValues] = useState({})
  const actionRef = useRef<ActionType>()
  const [row, setRow] = useState<any>()
  const [selectedRowsState, setSelectedRows] = useState<any[]>([])
  const [parentGroupList, setParentGroupList] = useState([])
  const [groupList, setGroupList] = useState([])
  const [pagination, setPagination] = useState({})
  /**
   * 更新节点
   * @param fields
   */
  const handleUpdate = async (fields: FormValueType) => {
    console.log('value', fields)
    const { id: adminId } = getUserinfo()

    const hide = message.loading('正在配置')
    try {
      const submitData = {
        adminId: adminId,
        groupId: stepFormValues.id,
        name: fields.name,
        fatherId: fields.parentGroup,
      }
      console.log('submitData', submitData)

      await updateGroup(submitData)
      hide()

      message.success('配置成功')
      return true
    } catch (error) {
      hide()
      message.error('配置失败请重试！')
      return false
    }
  }
  const handleDeleteGroup = async (record) => {
    const { id: adminId } = getUserinfo()
    await deleteGroup(adminId, [record.id])
    if (actionRef.current) {
      actionRef.current.reload()
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
      await deleteGroup(
        adminId,
        selectedRows.map((row) => row.id),
      )
      hide()
      message.success('删除成功，即将刷新')
      return true
    } catch (error) {
      hide()
      message.error('删除失败，请重试')
      return false
    }
  }
  const createColumns = [
    {
      title: '分组名称',
      dataIndex: 'name',
      tip: '名称不可重复',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
    },
    {
      title: '上级分组',
      dataIndex: 'fatherId',
      tip: '可选择上级分组',
      valueEnum: Object.fromEntries(
        parentGroupList.map((item) => [item.id, item.name]),
      ),
    },
  ]
  const columns: any = [
    {
      title: '分组名称',
      dataIndex: 'name',
      // tip: '名称不可重复',
      // hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
    },
    {
      title: '上级分组',
      dataIndex: 'fatherId',
      tip: '查询某个分组下的子分组',
      hideInTable: true,
      hideInForm: true,
      renderFormItem: () => (
        <Select
          options={parentGroupList.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
        />
      ),
    },
    {
      title: '总人数',
      dataIndex: 'sum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true,
      render: (_: any, record: any) => (
        <>
          <span>{moment(_).format('YYYY-MM-DD HH:mm:ss')}</span>
        </>
      ),
    },
    // {
    //   title: '性别',
    //   dataIndex: 'gender',
    //   hideInForm: true,
    //   valueEnum: {
    //     0: { text: '男', status: 'MALE' },
    //     1: { text: '女', status: 'FEMALE' },
    //   },
    // },
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
            description="确定删除该分组吗?"
            onConfirm={() => handleDeleteGroup(record)}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ]

  return (
    <PageContainer
      header={{
        title: '分组管理',
      }}
    >
      <ProTable
        headerTitle="分组列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          console.log('params', params)
          const { current: searchCurrent, fatherId, pageSize, name } = params
          const searchParams = {
            current: searchCurrent,
            fatherId,
            size: pageSize,
            name,
          }
          const { data, success } = await getGroupList({
            ...searchParams,

            // FIXME: remove @ts-ignore
            // @ts-ignore
            // sorter,
            // filter,
          })
          if (!params.fatherId && !params.name) {
            setParentGroupList(data.records)
          }
          const { pages, size, total, current } = data
          setPagination({ pageSize: size, total, current })
          setGroupList(data.records)
          return {
            data: data.records || [],
            success,
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
          {/* <Button type="primary">批量审批</Button> */}
        </FooterToolbar>
      )}
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
          rowKey="id"
          type="form"
          columns={createColumns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value)
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
          groupList={parentGroupList.filter(
            (item) => item.id !== stepFormValues.id,
          )}
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
