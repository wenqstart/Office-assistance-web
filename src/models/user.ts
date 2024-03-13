import {
  accountSignIn,
  accountSignOut,
  changeUserInfoData,
  changeUserPassword,
  fetchUserInfo,
} from '@/services/user'
import { decrypt, encrypt } from '@/utils/jsencrypt'
import { clearUserInfo, getToken, goToLogin } from '@/utils/tool'
import { message } from 'antd'
import { useCallback, useEffect, useState } from 'react'
// import { useModel, history } from 'umi';
import JSEncrypt from 'jsencrypt'
import cookie from 'react-cookies'
interface userProps {
  id: string
  username: string
  email: string
  mobile: string
  avatar: string
  name: string
}
type FunctionType<T extends any[]> = (...args: T) => void
export interface UserModelState {
  userInfo?: any
  token?: string | null
  fetchUser?: FunctionType<any>
  prefixCls?: string
}
export interface LoginModelState {
  signIn: FunctionType<any>
  signOut: FunctionType<any>
  loginLoading: boolean
}

export default function useUser() {
  const [userInfo, setUserInfo] = useState<userProps | null>(null)
  const [token, setToken] = useState<string | null>('')
  const [pubKey, setPubKey] = useState<string | null>('')
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [loginLoading, setLoginLoading] = useState<boolean>(false)
  const [prefixCls, setPrefixCls] = useState<string>(
    localStorage.getItem('theme') || 'micro',
  )
  // 进入项目，初始化用户信息、当前项目信息、当前组织信息
  useEffect(() => {
    if (getToken()) {
      setToken(getToken())
    }
  }, [])

  // 获取用户信息
  const fetchUser = useCallback(async () => {
    return await fetchUserInfo()
      .then(async (res) => {
        let data = res.data
        setUserInfo(data)
        localStorage.setItem('userInfo', JSON.stringify(data))
        return res
      })
      .catch((e) => {
        if (e && e.msg) {
          message.error(e && e.msg)
        }
      })
  }, [])
  // 修改密码
  const changePassword = useCallback(async (data: any) => {
    let encrypt = new JSEncrypt()
    encrypt.setPublicKey(pubKey || '')
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
      })
      message.success('修改成功！')
      clearUserInfo()
      goToLogin()
    } catch (err: any) {
      message.error(err.msg || '修改失败！')
    }
  }, [])

  // 修改用户信息
  const changeUserInfo = useCallback(
    async (data: any) => {
      try {
        const res = await changeUserInfoData({ ...data })
        message.success('保存成功！')
      } catch (err: any) {
        message.error(err.msg || '修改失败！')
      }
    },
    [userInfo],
  )

  const signIn = async (data: any) => {
    setLoginLoading(true)
    try {
      try {
        const res = await accountSignIn(data)
        const { data: data_2 } = res
        setToken(data_2.token)
        setIsLogin(true)
        cookie.save('token', data_2.token, {})
        localStorage.setItem('office_system_token', data_2.token)
      } catch (e: any) {
        message.error(e.msg)
        return await Promise.reject(e)
      }
    } finally {
      setLoginLoading(false)
    }
  }

  const clearLoginInfo = () => {
    // 清除登录信息
    clearUserInfo()
    setToken('')
    cookie.remove('token')
    setUserInfo(null)
  }
  const signOut = useCallback(() => {
    accountSignOut().then(() => {
      clearLoginInfo()
    })
  }, [])
  const setLoggedInInfo = async (
    username: string,
    password: string,
    rememberMe: string,
  ) => {
    const loggedInUser = {
      username: await encrypt(username),
      password: await encrypt(password),
      rememberMe: await encrypt(rememberMe),
    }
    cookie.save('LoggedInInfo', JSON.stringify(loggedInUser), { path: '/' })
  }
  const getLoggedInInfo = async () => {
    const loggedInInfo = cookie.load('LoggedInInfo') || {}
    const rememberMe = await decrypt(loggedInInfo.rememberMe)
    if (Boolean(rememberMe) === true) {
      const username = await decrypt(loggedInInfo.username)
      const password = await decrypt(loggedInInfo.password)
      return { rememberMe, username, password }
    }
    return {}
  }
  const removeLoggedInInfo = () => {
    cookie.remove('LoggedInInfo')
  }

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
    setLoggedInInfo,
    getLoggedInInfo,
    removeLoggedInInfo,
  }
}
