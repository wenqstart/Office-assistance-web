import { Button, Checkbox, Form, Input } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import styles from './index.less';
import { LockOutlined, UserOutlined } from '@ant-design/icons';



// type FieldType = {
//   username?: string;
//   password?: string;
//   remember?: string;
// };

const RegisterForm: React.FC = () => {
  const loginFormRef = useRef(null);
  const [form] = Form.useForm();
  const [clientReady, setClientReady] = useState<boolean>(false);

  // To disable submit button at the beginning.
  useEffect(() => {
    setClientReady(true);
  }, []);

  const onFinish = (values: any) => {
    console.log('Finish:', values);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  
  function toRegister() {
    console.log('register');
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
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入账号" />
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
            style={{ width: '100%' }}
            disabled={
              !clientReady ||
              !form.isFieldsTouched(true) ||
              !!form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            登录
          </Button >
        )}
        </Form.Item>

      <Form.Item >
        <div className={styles.registerTip}>
          <span>
            已有账号？请
            <Button type="link" onClick={toRegister}>
              前往登录
            </Button>
          </span>
        </div>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
