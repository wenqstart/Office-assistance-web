import {
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ActionType,
} from '@ant-design/pro-components'
import { Modal } from 'antd'
import React, { useRef, useEffect, useState } from 'react'

export interface FormValueType extends Partial<API.UserInfo> {
  target?: string
  template?: string
  type?: string
  time?: string
  frequency?: string
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void
  onSubmit: (values: FormValueType) => Promise<void>
  updateModalVisible: boolean
  values: Partial<API.UserInfo>
  groupList: any[]
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const stepRef = useRef<ActionType>()
  const [hasParent, setHasParent] = useState(0)
  const changeHasParent = (e) => {
    console.log(props.values)

    setHasParent(e.target?.value)
  }
  useEffect(() => {
    console.log('props.values', props.values)

    if (props.values.fatherId) {
      setHasParent(1)
    }
  }, [])

  return (
    <StepsForm
      formRef={stepRef}
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            styles={{ padding: '32px 40px 48px' }}
            destroyOnClose
            title="用户配置"
            open={props.updateModalVisible}
            footer={submitter}
            onCancel={() => props.onCancel()}
          >
            {dom}
          </Modal>
        )
      }}
      onFinish={props.onSubmit}
    >
      <StepsForm.StepForm
        initialValues={{
          name: props.values.name,
          number: props.values.number,
          sex: props.values.sex,
        }}
        title="基本信息"
      >
        <ProFormText
          width="md"
          name="number"
          label="用户学号"
          readonly
          rules={[{ required: true, message: '请输入用户学号！' }]}
        />
        <ProFormText
          width="md"
          name="name"
          label="用户姓名"
          rules={[{ required: true, message: '请输入用户姓名！' }]}
        />
        <ProFormRadio.Group
          width="md"
          name="sex"
          label="用户性别"
          rules={[{ required: true, message: '请选择用户性别！' }]}
          options={[
            {
              value: 1,
              label: '男',
            },
            {
              value: 2,
              label: ' 女',
            },
          ]}
        />
        {/* <ProFormTextArea
          name="desc"
          width="md"
          label="规则描述"
          placeholder="请输入至少五个字符"
          rules={[
            { required: true, message: '请输入至少五个字符的规则描述！', min: 5 },
          ]}
        /> */}
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          phone: props.values.phone,
          email: props.values.email,
          age: props.values.age,
        }}
        title="其他信息"
      >
        <ProFormText width="md" name="phone" label="电话号码" />
        <ProFormText width="md" name="email" label="用户邮箱" />
        {/* <ProFormDateTimePicker name="datetime" label="日期时间" /> */}
        <ProFormText width="md" name="age" label="用户年龄" />
        {/* <ProFormTextArea
          name="desc"
          width="md"
          label="规则描述"
          placeholder="请输入至少五个字符"
          rules={[
            { required: true, message: '请输入至少五个字符的规则描述！', min: 5 },
          ]}
        /> */}
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          adminGroupsId: props.values.adminGroupsId,
        }}
        title="设置分组"
      >
        <ProFormSelect
          width="md"
          name="adminGroupsId"
          label="选择分组"
          rules={[{ required: true, message: '请选择分组！' }]}
          valueEnum={Object.fromEntries(
            props.groupList.map((item) => [item.id, item.name]),
          )}
        />
      </StepsForm.StepForm>
      {/* <StepsForm.StepForm
        initialValues={{
          // type: '1',
          joinUser: 'month',
        }}
        title="分配人员"
      >
        <ProFormSelect
          name="joinUser"
          label="选择用户"
          width="xs"
          valueEnum={{
            month: '月',
            week: '周',
          }}
        />
      </StepsForm.StepForm> */}
    </StepsForm>
  )
}

export default UpdateForm
