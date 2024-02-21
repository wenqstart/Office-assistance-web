const API_USER = process.env.API_USER;
import { request } from '@@/plugin-request'

// 获取用户信息
export const fetchUserInfo = () => {
  return request(`${API_USER}/provider/users`, {
    method: 'get',
    // headers: { 'Amp-Organ-Id': '1' },
  });
};
export const changeUserPassword = (data: any, token = '') => {
  return request(`${API_USER}/users/password`, {
    method: 'post',
    data,
    headers: { Authorization: token },
  });
};
export const changeUserInfoData = (data: any) => {
  return request(`${API_USER}/users/update`, {
    method: 'post',
    data,
  });
};
// 用户登录
export const accountSignIn = (data: any) => {
  return request(`${API_USER}/users/noCode/login`, {
    method: 'post',
    data,
  });
};

// 用户登出
export const accountSignOut = () => {
  return request(`${API_USER}/users/logout`, {
    method: 'post',
  });
};
