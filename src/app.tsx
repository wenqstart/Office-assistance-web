// 运行时配置
import { RunTimeLayoutConfig, RuntimeAntdConfig  } from '@umijs/max';
import { theme } from 'antd';
import { LOGOUT_NAME } from "@/constants";
import { history } from "umi";
import { clearUserInfo, goToLogin } from '@/utils/tool';
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
// useModel("@@initialState");
export async function getInitialState(): Promise<{ name: string }> {
  return {
    name: LOGOUT_NAME,

  };
}

export const layout: RunTimeLayoutConfig  = () => {
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
    // rightRender: (initialState: any) => <div>rightRender</div>,
    // footerRender: (initialState: any) => <div>footerRender</div>,
    // rightContentRender: () => <div>rightContentRender</div>,

    // 自定义 403 页面
    // unAccessible: <div>'unAccessible'</div>,
    // 自定义 404 页面
    // noFound: <div>'noFound'</div>,
    // 默认布局调整
    // menuHeaderRender: undefined,
  };
};

export const antd: RuntimeAntdConfig = (memo) => {
  console.log('memo', memo)
  memo.theme ??= {};
  memo.theme.algorithm = theme.darkAlgorithm; // 配置 antd5 的预设 dark 算法

  memo.appConfig = {
    message: {
      // 配置 message 最大显示数，超过限制时，最早的消息会被自动关闭
      maxCount: 3,
    }
  }

  return memo;
};

// src/app.ts
// export const qiankun = {
//   // apps: [
//   //   {
//   //     name: 'doc-edit',
//   //     entry: '//localhost:8009',
//   //   },
//   // ],
//   lifeCycles: {
//     // 所有子应用在挂载完成时，打印 props 信息
//     async afterMount(props) {
//       console.log(props);
//     },
//   },
// };
