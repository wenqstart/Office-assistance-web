import { history } from 'umi';

const setToken = (token: string) => {
  return localStorage.setItem('office_system_token', token);
};
const getToken = () => {
  return localStorage.getItem('office_system_token');
};
const goHome = () => {
  history.push('/');
};
const clearUserInfo = () => {
  localStorage.removeItem('office_system_token');
  localStorage.removeItem('userInfo');
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
  setToken,
  getToken,
  goBack,
  goHome,
  goTo,
  goToError,
  goToLogin,
  isLogin,
};
