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
import { useModel } from '@umijs/max'
import { goHome, getUserinfo } from '@/utils/tool'

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
  const [userInfo, setUserInfo] = useState<userProps | null>(getUserinfo())
  const [token, setToken] = useState<string | null>('')
  const [role, setRole] = useState<string | null>('')
  const [pubKey, setPubKey] = useState<string | null>('')
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [loginLoading, setLoginLoading] = useState<boolean>(false)
  const [prefixCls, setPrefixCls] = useState<string>(
    localStorage.getItem('theme') || 'micro',
  )
  const { refresh } = useModel('@@initialState')
  // 进入项目，初始化用户信息
  useEffect(() => {
    const cacheToken = getToken()
    if (cacheToken) {
      setToken(cacheToken)
    }
  }, [])

  // 获取用户信息
  const fetchUser = useCallback(async (number: string) => {
    return await fetchUserInfo(number)
      .then(async (res) => {
        console.log('res', res)
        setUserInfo(res.data)
        sessionStorage.setItem(
          'office_system_userinfo',
          JSON.stringify(res.data),
        )
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
    console.log('data', data.password, encrypt)
    console.log('data', encrypt.encrypt(data.password))
    console.log('data', encrypt.encrypt('333'))
    try {
      await changeUserPassword({
        number: data.number,
        password: encrypt.encrypt(data.password),
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
      console.log('data', data)
      try {
        const res = await changeUserInfoData({ ...data })
        fetchUser(data.number)
        message.success('保存成功！')
      } catch (err: any) {
        message.error(err.msg || '修改失败！')
      }
    },
    [userInfo],
  )

  const signIn = async (loginData: any) => {
    setLoginLoading(true)
    return accountSignIn(loginData)
      .then((res: any) => {
        const { data, message } = res
        if (!data) {
          console.log(message)
          return
        }
        setToken(data.token)
        setRole(data.role)
        // fetchUser(loginData.username)
        // cookie.save('token', data.token, { path: '/' })
        localStorage.setItem('office_system_token', data.token)
        sessionStorage.setItem('office_system_username', loginData.username)
        // 刷新全局状态
        refresh()
        // 后续用于第三方登录
        setIsLogin(true)
        goHome()
      })
      .catch((e: any) => {
        return Promise.reject(e)
      })
      .finally(() => {
        setLoginLoading(false)
      })
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
