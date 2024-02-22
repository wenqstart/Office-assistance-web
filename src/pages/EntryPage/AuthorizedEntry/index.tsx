// 登录鉴权
import { goToLogin } from '@/utils/tool';
import { notification } from 'antd';
import React, { useEffect } from 'react';
import { Outlet, history, useModel } from 'umi';

const AuthorizedEntry = () => {
  const { token, fetchUser, isLogin, setIsLogin } = useModel('user') || {};
  console.log('token', token);

  const [noticeApi, contextHolder] = notification.useNotification();
  const Context = React.createContext({ name: 'Default' });
  // const [noticeSocket, setNoticeSocket] = useState();

  useEffect(() => {
    if (token) {
      if (!isLogin) {
        fetchUser();
        setIsLogin(true);
      }
    } else {
      if (isLogin) {
        goToLogin();
        setIsLogin(false);
      } else {
        goToLogin(history.location.pathname + history.location.search);
      }
    }
  }, [token]);

  // 直接在浏览器中输入没有权限的url路径时，转到默认菜单的第一个url
  // useEffect(() => {
  //   const url = getAppDefaultPathname(menus);
  //   if (url && !url.includes(location.pathname)) {
  //     history.push(url);
  //   }
  // }, [location]);

  return (
    <div>
      <Outlet />
      <Context.Provider value={{ name: 'Ant Design' }}>
        {contextHolder}
      </Context.Provider>
    </div>
  );
};

export default AuthorizedEntry;
