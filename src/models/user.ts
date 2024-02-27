import { useState, useCallback, useEffect } from 'react';
import {
  fetchUserInfo,
  changeUserPassword,
  changeUserInfoData,
  accountSignIn,
  accountSignOut
} from '@/services/user';
import { getToken, clearUserInfo, goToLogin } from '@/utils/tool';
import { message } from 'antd';
// import { useModel, history } from 'umi';
import cookie from 'react-cookies';
import JSEncrypt from 'jsencrypt';

interface userProps {
  id: string;
  username: string;
  email: string;
  mobile: string;
  avatar: string;
  name: string;
}
type FunctionType<T extends any[]> = (...args: T) => void;
export interface UserModelState {
  userInfo?: any;
  token?: string | null;
  fetchUser?: FunctionType;
  prefixCls?: string;
}
export interface LoginModelState {
  signIn: FunctionType;
  signOut: FunctionType;
  loginLoading: boolean;
}

export default function useUser() {
  const [userInfo, setUserInfo] = useState<userProps | null>(null);
  const [token, setToken] = useState<string | null>('');
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [prefixCls, setPrefixCls] = useState<string>(localStorage.getItem('theme') || 'micro');
  const pubKey =
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoUYIgzTFpppvfYudUWdAl38Q5NxzuP/msHDDep9Khy0dB3E2BmgtpeKHw0IOQWVAbUNm5vEuyrghskaPlrEttAfxk1b56BiOnPsjb4Q9wNW5FMTOD1pio8WO8r9lyj7KmJcmThavGWJBjP8utepnHo6ppFCkIEv4T/7aW4/LHMm/rckYHJyafh3K+/AQbYHN/TSFnC/xmhDwbHPB3ymBwiepuYTyCVmnBRy6a1b0IKamKcfjmhmTIA4G1ThfhO45Vv70CVlwNt+ta8HmK9kwQfjMUnFGE/fLBOsHUGDFsaJPgDuMCZ5OLnJbLELg4PyBqf9XWpXI3t2M6JeYoVnkzQIDAQAB';

  // 进入项目，初始化用户信息、当前项目信息、当前组织信息
  useEffect(() => {
    if (getToken()) {
      setToken(getToken());
    }
  }, []);

  // 获取用户信息
  const fetchUser = useCallback(async () => {
    return await fetchUserInfo()
      .then(async (res) => {
        let data = res.data;
        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return res;
      })
      .catch((e) => {
        e?.msg && message.error(e && e.msg);
      });
  }, []);
  // 修改密码
  const changePassword = useCallback(async (data) => {
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(pubKey);
    try {
      await changeUserPassword({
        newPassword: encrypt.encrypt(data.newPassword),
        password: encrypt.encrypt(data.password),
        secondNewPassword: encrypt.encrypt(data.secondNewPassword),
        // newPassword: window.btoa(data.newPassword),
        // password: window.btoa(data.password),
        // secondNewPassword: window.btoa(data.secondNewPassword),
        // ...data,
        organId: '1',
      });
      message.success('修改成功！');
      clearUserInfo();
      goToLogin();
    } catch (err) {
      message.error(err.msg || '修改失败！');
    }
  }, []);

  // 修改用户信息
  const changeUserInfo = useCallback(
    async (data) => {
      try {
        const res = await changeUserInfoData({ ...data });
        message.success('保存成功！');
      } catch (err) {
        message.error(err.msg || '修改失败！');
      }
    },
    [userInfo],
  );

  const signIn = async (data: any) => {
    setLoginLoading(true);
    try {
      try {
        const res = await accountSignIn(data);
        const { data: data_2 } = res;
        setToken(data_2.token);
        setIsLogin(true);
        cookie.save('token', data_2.token);
        localStorage.setItem('office_system_token', data_2.token);
      } catch (e) {
        message.error(e.msg);
        return await Promise.reject(e);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const clearLoginInfo = () => {
    // 清除登录信息
    clearUserInfo();
    setToken('');
    cookie.remove('token');
    setUserInfo(null);
  };
  const signOut = useCallback(() => {
    accountSignOut().then(() => {
      clearLoginInfo();
    });
  }, []);



  return {
    token,
    setToken,
    userInfo,
    setUserInfo,
    fetchUser,
    changePassword,
    changeUserInfo,
    loginLoading,
    signIn,
    signOut,
    clearLoginInfo,
    pubKey,
    prefixCls,
    setPrefixCls,
    isLogin,
    setIsLogin,
  };
}
