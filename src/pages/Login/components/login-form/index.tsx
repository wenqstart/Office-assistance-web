// import { goHome } from '@/utils/tool'
import { getToken, goHome } from '@/utils/tool'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useModel } from 'umi'
import styles from './index.less'

// type FieldType = {
//   username?: string;
//   password?: string;
//   remember?: string;
// };

const LoginForm: React.FC = () => {
  const loginFormRef = useRef(null)
  const [form] = Form.useForm()
  const [clientReady, setClientReady] = useState<boolean>(false)
  const { setIsLogin } = useModel('Login.login')
  const {
    setLoggedInInfo,
    getLoggedInInfo,
    removeLoggedInInfo,
    signIn,
    loginLoading,
  } = useModel('user')
  const [rememberMe, setRememberMe] = useState<boolean>(false)

  const initLoggedInInfo = async () => {
    const { rememberMe, username, password } = await getLoggedInInfo()
    if (Boolean(rememberMe) && username && password) {
      form.setFieldsValue({
        username,
        password,
      })
      setRememberMe(Boolean(rememberMe))
    }
  }
  useEffect(() => {
    setClientReady(true)
    initLoggedInInfo()
  }, [])
  useEffect(() => {
    // @ts-ignore
    // const { token, back } = location.query
    // if (token) {
    //   // 用户通过第三方免登录方式跳转
    //   clearLoginInfo();
    //   setToken(token);
    //   localStorage.setItem('userToken', token);
    //   setTimeout(() => {
    //     if (back) {
    //       history.push(back.toString());
    //     } else {
    //       project.goHome();
    //     }
    //   }, 0);
    // }
    // 登录未失效
    const cacheToken = getToken()
    if (cacheToken) {
      goHome()
    }
  }, [])
  const onFinish = async (values: any) => {
    const { username, password } = values
    signIn({ username, password }).then(() => {
      if (rememberMe) {
        setLoggedInInfo(username, password, String(rememberMe))
      } else {
        removeLoggedInInfo()
      }
    })
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  function toRegister() {
    setIsLogin(false)
  }
  return (
    <Form
      name="login_form"
      form={form}
      ref={loginFormRef}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入账号!' }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="请输入账号"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="请输入密码"
        />
      </Form.Item>
      <Form.Item shouldUpdate>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            loading={loginLoading}
            style={{ width: '100%' }}
            disabled={
              !clientReady ||
              !form.isFieldsTouched(true) ||
              !!form.getFieldsError().filter(({ errors }) => errors.length)
                .length
            }
          >
            登录
          </Button>
        )}
      </Form.Item>

      <Form.Item>
        <div className={styles.registerTip}>
          <span>
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            &nbsp; 记住账号
          </span>
          <span>
            还没有账号？请
            <Button type="link" onClick={toRegister}>
              前往注册
            </Button>
          </span>
        </div>
      </Form.Item>
    </Form>
  )
}

export default LoginForm
