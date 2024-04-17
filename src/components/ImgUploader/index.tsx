import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import type { GetProp, UploadProps } from 'antd'
import { Upload, message } from 'antd'
import React, { useState } from 'react'
import styles from './index.less'
const BASE_API = process.env.BASE_API

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('请选择格式为 jpg/png 的图片!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不超过2MB!')
  }
  return isJpgOrPng && isLt2M
}

const App: React.FC = (props: any) => {
  const { listType = 'picture-circle', uploadSuccess, method = 'post' } = props
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false)
        setImageUrl(url)
      })
      if (info.file.response.code === 200) {
        uploadSuccess({ url: info.file.response.data })
      }
    }
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传头像</div>
    </button>
  )

  return (
    <Upload
      name="file"
      listType="picture-circle"
      className={styles.avatarUploader}
      crossOrigin=""
      showUploadList={false}
      action={`${BASE_API}/file/update`}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="avatar"
          style={{ width: '100%', borderRadius: '50%' }}
        />
      ) : (
        uploadButton
      )}
    </Upload>
  )
}

export default App
