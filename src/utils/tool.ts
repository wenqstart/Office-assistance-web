import { history } from '@umijs/max';
const getToken = () => {
  return localStorage.getItem('office_system_token');
};
const getUsername = () => {
  return localStorage.getItem('office_system_username');
};
const getChatId = () => {
  return sessionStorage.getItem('office_system_chatId');
};
const getUserinfo = () => {
  return JSON.parse(localStorage.getItem('office_system_userinfo') || '{}');
};
const goHome = () => {
  history.push('/');
};
const clearUserInfo = () => {
  localStorage.removeItem('office_system_token');
  localStorage.removeItem('office_system_username');
  localStorage.removeItem('office_system_userinfo');
  sessionStorage.removeItem('office_system_chatId');
};
const isLogin = () => {
  return !!getToken();
};
const goToLogin = (goBackUrl?: string) => {
  if (history.location.pathname === '/login') {
    return;
  }
  if (goBackUrl && goBackUrl !== '/' && goBackUrl !== '/login') {
    const query: { [key: string]: any } = {};
    query.back = goBackUrl;
    history.replace({ pathname: '/login' });
    // window.location.reload();
  } else {
    history.replace('/login');
    // window.location.reload();
  }
};
type errorCode = '404' | '403' | '500';

const goToError = (errorCode: errorCode) => {
  history.push(`/error/${errorCode}`);
};
const goTo = (pathname: string) => {
  history.push({ pathname });
};
const goBack = () => {
  history.back();
};
export {
  clearUserInfo,
  getToken,
  getUsername,
  getUserinfo,
  getChatId,
  goBack,
  goHome,
  goTo,
  goToError,
  goToLogin,
  isLogin,
};
