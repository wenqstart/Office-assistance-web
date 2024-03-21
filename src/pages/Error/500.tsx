import { Button, Result } from 'antd';
import React from 'react';
import { history } from '@umijs/max';
import styles from './index.less';

const NoFoundPage: React.FC = () => {
  // const { menus, getAppDefaultPathname } = useModel('app');

  // const url = getAppDefaultPathname(menus);
  return (
    <Result
      status="500"
      title="500"
      subTitle="啊哦～，服务器崩溃了"
      className={styles.errorPage}
      extra={
        <Button type="primary" onClick={() => history.push('/workBench')}>
          Back Home
        </Button>
      }
    />
  );
};

export default NoFoundPage;
