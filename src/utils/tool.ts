import { history } from '@umijs/max'
const getToken = () => {
  return localStorage.getItem('office_system_token')
}
const getUsername = () => {
  return sessionStorage.getItem('office_system_username')
}
const getChatId = () => {
  return sessionStorage.getItem('office_system_chatId')
}
const getUserinfo = () => {
  return JSON.parse(sessionStorage.getItem('office_system_userinfo') || '{}')
}
const getMsgList = () => {
  return JSON.parse(sessionStorage.getItem('office_system_msgList') || '[]')
}
const goHome = () => {
  history.push('/')
}
const clearUserInfo = () => {
  localStorage.removeItem('office_system_token')
  sessionStorage.removeItem('office_system_username')
  sessionStorage.removeItem('office_system_userinfo')
  sessionStorage.removeItem('office_system_chatId')
}
const isLogin = () => {
  return !!getToken()
}
const goToLogin = (goBackUrl?: string) => {
  if (history.location.pathname === '/login') {
    return
  }
  if (goBackUrl && goBackUrl !== '/' && goBackUrl !== '/login') {
    // const query: { [key: string]: any } = {};
    console.log('goBackUrl', goBackUrl)

    // query.back = goBackUrl;
    history.replace({ pathname: '/login', search: `?backUrl=${goBackUrl}` })
    // window.location.reload();
  } else {
    history.replace('/login')
    // window.location.reload();
  }
}
type errorCode = '404' | '403' | '500'

const goToError = (errorCode: errorCode) => {
  history.push(`/error/${errorCode}`)
}
const goTo = (pathname: string) => {
  history.push({ pathname })
}
const goBack = () => {
  history.back()
}
export {
  clearUserInfo,
  getChatId,
  getMsgList,
  getToken,
  getUserinfo,
  getUsername,
  goBack,
  goHome,
  goTo,
  goToError,
  goToLogin,
  isLogin,
}
