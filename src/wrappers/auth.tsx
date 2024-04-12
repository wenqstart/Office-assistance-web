// 登录鉴权
import { goToLogin, getUsername, clearUserInfo } from '@/utils/tool'
// import { notification } from 'antd';
import React, { useEffect } from 'react'
import { Outlet, history, useModel } from '@umijs/max'

const AuthorizedEntry = () => {
  const { token, fetchUser, isLogin, setIsLogin } = useModel('user') || {}
  // console.log('token', token);
  // console.log('isLogin', isLogin);

  // const [noticeApi, contextHolder] = notification.useNotification();
  const Context = React.createContext({ name: 'Default' })
  // const [noticeSocket, setNoticeSocket] = useState();

  useEffect(() => {
    if (token) {
      const username = getUsername()
      if (!username) {
        clearUserInfo()
        goToLogin()
      }
      // 页面手动刷新需要重新获取 userinfo
      if (!isLogin && username) {
        // 这里不用调用了，在 app.tsx 中调用了
        // fetchUser(username)
        setIsLogin(true)
      }
    } else {
      clearUserInfo()
      // 场景：接口 401 需要重定向至登录页
      if (isLogin) {
        goToLogin()
        setIsLogin(false)
      } else {
        // 场景：直接复制浏览器 url 进入（需要在登录后回到目标页面）
        goToLogin(history.location.pathname + history.location.search)
      }
    }
  }, [token])

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
      {/* <Context.Provider value={{ name: 'Ant Design' }}>
        {contextHolder}
      </Context.Provider> */}
    </div>
  )
}

export default AuthorizedEntry
