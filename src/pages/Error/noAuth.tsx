import { Button, Result } from 'antd';
import React from 'react';
import { history } from '@umijs/max';
import styles from './index.less';

const NoAuthPage: React.FC = () => {
  // const { menus, getAppDefaultPathname } = useModel('app');

  // const url = getAppDefaultPathname(menus);
  return (
    <Result
      title="没有权限"
      subTitle="当前用户暂无访问该链接的权限，请联系组织管理员分配应用权限"
      className={styles.errorPage}
      extra={
        <Button type="primary" onClick={() => history.push('/workBench')}>
          Back Home
        </Button>
      }
    />
  );
};

export default NoAuthPage;
