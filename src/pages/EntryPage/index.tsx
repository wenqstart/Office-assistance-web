import { useEffect } from 'react';
import { ConfigProvider, message, notification } from 'antd';
import { useModel, Helmet, history, Outlet } from 'umi';

const EntryPage = (props: any) => {
  const { location, children } = props;
  message.config({ prefixCls: 'micro-message' });
  notification.config({ prefixCls: 'micro' });
  useEffect(() => {
    console.log('====================================');
    console.log('history', history);
    console.log('====================================');
    const unlisten = history.listen((location) => {
      const query = new URLSearchParams(location.search);
      console.log('====================================');
      console.log(query);
      console.log('====================================');
    });
    return unlisten;
  }, [history]);

  return (
    <div>
      {/* <Helmet>
        <meta charSet="utf-8" />
        <title>wq</title>
      </Helmet> */}
      <Outlet/> 
      {/* <ConfigProvider prefixCls="micro">{children}</ConfigProvider> */}
    </div>
  );
};

export default EntryPage;
