// 运行时配置
import { LOGOUT_NAME } from '@/constants'
import { clearUserInfo, getToken, goToLogin } from '@/utils/tool'
import { RunTimeLayoutConfig, RuntimeAntdConfig } from '@umijs/max'
import { message, notification, theme } from 'antd'
import type { RequestConfig } from 'umi'
import { history } from 'umi'
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
// useModel("@@initialState");
export async function getInitialState(): Promise<{ name: string }> {
  return {
    name: LOGOUT_NAME,
  }
}

export const layout: typeof RunTimeLayoutConfig = () => {
  return {
    logo: '/favicon.svg',
    menu: {
      locale: false,
    },
    title: '办公辅助系统',
    logout: () => {
      clearUserInfo()
      goToLogin()
    },
    pure: history.location.pathname === '/login' ? true : false, //如果为登录页面就隐藏系统布局
    siderWidth: 180,
    // rightRender: (initialState: any) => <div>rightRender</div>,
    // footerRender: (initialState: any) => <div>footerRender</div>,
    // rightContentRender: () => <div>rightContentRender</div>,

    // 自定义 403 页面
    // unAccessible: <div>'unAccessible'</div>,
    // 自定义 404 页面
    // noFound: <div>'noFound'</div>,
    // 默认布局调整
    // menuHeaderRender: undefined,
  }
}

export const antd: typeof RuntimeAntdConfig = (memo: any) => {
  console.log('memo', memo)
  memo.theme ??= {}
  memo.theme.algorithm = theme.darkAlgorithm // 配置 antd5 的预设 dark 算法

  memo.appConfig = {
    message: {
      // 配置 message 最大显示数，超过限制时，最早的消息会被自动关闭
      maxCount: 3,
    },
  }

  return memo
}

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean
  data: any
  errorCode?: number
  errorMessage?: string
  showType?: ErrorShowType
}

// 运行时配置
export const request: typeof RequestConfig = {
  // 统一的请求设定
  timeout: 1000,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },

  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res: ResponseStructure) => {
      const { success, data, errorCode, errorMessage, showType } = res
      if (!success) {
        const error: any = new Error(errorMessage)
        error.name = 'BizError'
        error.info = { errorCode, errorMessage, showType, data }
        throw error // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage)
              break
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage)
              break
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              })
              break
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break
            default:
              message.error(errorMessage)
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        if (error.response.status === 401) {
          clearUserInfo()
          message.error(`用户登录认证过期，请重新登录`)
        } else {
          message.error(`Response status:${error.response.status}`)
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.')
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.')
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: any) => {
      // 拦截请求配置，进行个性化处理。
      const accessToken = getToken()
      if (accessToken) {
        config.headers.Authorization = accessToken
      }
      return { ...config }
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: any) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response
      if (data.code !== 200) {
        message.error('请求失败！')
      }
      return response
    },
  ],
}
