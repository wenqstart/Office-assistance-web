import { useModel, history } from 'umi';
import { Form, Input, Button, Space } from 'antd';
import styles from './index.less';
import { getUsername } from '@/utils/tool'

const ChangePwd = () => {
  const { changePassword } = useModel('user') || {};
  const [form] = Form.useForm();
  const username = getUsername()

  const cancelForm = () => {
    form.resetFields();
    history.goBack();
  };
  const onFinish = (values: any) => {
    changePassword({number: username, password: values.newPassword});
  };
  // const pwdPattern = /^[A-Za-z0-9]{8,16}$/;
  const pwdPattern = /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,16}/;
  return (
    <Form
      form={form}
      className={styles.changePwd}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        label="原密码"
        name="password"
        rules={[
          {
            required: true,
            message: '请输入密码',
          },
          // { pattern: pwdPattern, message: '由数字、大小写字母组成的8-16个字符' },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="新密码"
        name="secondNewPassword"
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: '请输入新密码',
          },
          { pattern: pwdPattern, message: '必须含数字、大小写字母和特殊字符,长度为8～16' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') !== value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('新密码与原密码一致'));
            },
          }),
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="确认密码"
        name="newPassword"
        dependencies={['secondNewPassword']}
        rules={[
          {
            required: true,
            message: '请输入确认密码',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('secondNewPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('确认密码与新密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <div className={styles.footer}>
        <Space direction="horizontal">
          <Button onClick={cancelForm}>取消</Button>
          <Button htmlType="submit" type="primary">
            确认
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default ChangePwd;
