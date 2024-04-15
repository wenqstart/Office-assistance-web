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
    console.log('props.values', props.values);
    
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
            title="分组配置"
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
        }}
        title="基本信息"
      >
        <ProFormText
          width="md"
          name="name"
          label="分组名称"
          rules={[{ required: true, message: '请输入分组名称！' }]}
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
          // target: '0',
          // template: '0',
          type: props.values?.fatherId ? 1 : 0,
          parentGroup: props.values.fatherId,
        }}
        title="配置上级分组"
      >
        <ProFormRadio.Group
          name="type"
          width="md"
          label="上级分组"
          onChange={changeHasParent}
          rules={[{ required: true, message: '请选择是否需要上级分组！' }]}
          options={[
            {
              value: 0,
              label: '无',
            },
            {
              value: 1,
              label: '有',
            },
          ]}
        />
        {hasParent === 1 && (
          <ProFormSelect
            width="md"
            name="parentGroup"
            label="选择上级分组"
            rules={[{ required: true, message: '请选择上级分组！' }]}
            valueEnum={Object.fromEntries(
              props.groupList.map((item) => [item.id, item.name]),
            )}
          />
        )}
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
