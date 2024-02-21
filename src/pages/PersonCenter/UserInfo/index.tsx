import { useEffect } from 'react';
import { useModel } from 'umi';
import { Form, Input, Button } from 'antd';
import styles from './index.less';
import userLogo from '@/assets/avatar.svg';
import { SvgImg } from '@/components';

const UserInfo = () => {
  const { userInfo, changeUserInfo } = useModel('user') || {};
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    changeUserInfo(values);
  };
  useEffect(() => {
    form.setFieldsValue(userInfo);
  }, [userInfo]);

  return (
    <div className={styles.userInfo}>
      <div className={styles.leftPanel}>
        <SvgImg src={userInfo?.avatar || userLogo} className={styles.avatar} />
      </div>
      <Form
        className={styles.rightForm}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item label="账号">{userInfo?.username}</Form.Item>

        <Form.Item label="姓名" name="name">
          <Input />
        </Form.Item>

        <Form.Item
          label="手机号"
          name="mobile"
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
  );
};

export default UserInfo;
