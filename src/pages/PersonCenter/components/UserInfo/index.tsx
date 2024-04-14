import userLogo from '@/assets/avatar.svg'
import { SvgImg } from '@/components'
import { getUsername } from '@/utils/tool'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { useModel } from '@umijs/max'
import type { GetProp, UploadProps } from 'antd'
import { Button, Form, Input, InputNumber, Radio, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import { useEffect, useState } from 'react'
import styles from './index.less'
const BASE_API = process.env.BASE_API
const file_api = BASE_API + '/file'

const UserInfo = () => {
  const { userInfo, changeUserInfo } = useModel('user') || {}
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const username = getUsername()
  const onFinish = (values: any) => {
    changeUserInfo({ number: username, userDto: { ...values, icon: imageUrl } })
  }
  function beforeUpload(params: any) {
    console.log('params', params)
  }
  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
  }
  const handleChange: UploadProps['onChange'] = (info) => {
    console.log('info 222', info.file)
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }

    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false)
        console.log('url', url)

        setImageUrl(url)
      })
      // if (info.file?.response?.code === 200) {
      //   setLoading(false)
      //   setImageUrl(info.file?.response?.data)
      // }
    }
  }

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as FileType)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传头像</div>
    </button>
  )
  useEffect(() => {
    form.setFieldsValue(userInfo)
    console.log('userInfo', userInfo)

    if (userInfo?.icon) {
      setImageUrl(userInfo?.icon)
    }
  }, [userInfo])

  return (
    <div className={styles.userInfo}>
      <div className={styles.leftPanel}>
        <SvgImg src={userInfo?.icon || userLogo} className={styles.avatar} />
      </div>
      <Form
        className={styles.rightForm}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item label="头像" name="icon">
          <ImgCrop rotationSlider>
            <Upload
              name="file"
              listType="picture-card"
              showUploadList={false}
              action={`${file_api}/update`}
              onChange={handleChange}
              onPreview={onPreview}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </ImgCrop>
        </Form.Item>
        <Form.Item label="账号" name="number">
          {userInfo?.number}
        </Form.Item>

        <Form.Item label="姓名" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="性别" name="sex">
          <Radio.Group>
            <Radio value={1}>男</Radio>
            <Radio value={2}>女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="年龄" name="age">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="手机号"
          name="phone"
          rules={[
            {
              pattern: /^[1][0-9]{10}$/,
              message: '请输入正确的手机号',
            },
          ]}
        >
          <Input type="tel" />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            {
              pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              message: '请输入正确的邮箱',
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item label="组织">{userInfo?.organProjectsVoList?.map((item: any) => item.name).join(',')}</Form.Item> */}
        <div className={styles.footer}>
          <Button htmlType="submit" type="primary">
            保存修改
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default UserInfo
