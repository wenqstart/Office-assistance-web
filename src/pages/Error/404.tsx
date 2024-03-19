import { Button, Result } from 'antd';
import React from 'react';
import { history } from '@umijs/max';
import styles from './index.less';

const NoFoundPage: React.FC = () => {
  // const { menus, getAppDefaultPathname } = useModel('app');

  // const url = getAppDefaultPathname(menus);
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      className={styles.errorPage}
      extra={
        <Button type="primary" onClick={() => history.push('/home')}>
          Back Home
        </Button>
      }
    />
  );
};

export default NoFoundPage;
