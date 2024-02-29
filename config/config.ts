import { defineConfig } from 'umi';
import path from 'path';
import routes from './routes';
import proxy from '../config/proxy';
import theme from './theme.hc';
import {SYSTEM_NAME} from "../src/constants";
const proxyData = proxy;

export default defineConfig({
  // favicon: '/favicon_hc.ico', // 浏览器icon
  // qiankun: {
  //   master: {
  //     apps: [
  //       {
  //         name: 'doc-edit',
  //         entry: '//localhost:8001',
  //       },
  //     ],
  //   },
  // },
  clickToComponent: {},
  icons: { autoInstall: {} },
  verifyCommit: {},
  title: false, // 浏览器标题
  mountElementId: 'masterRoot',
  theme, // 主题色号改动
  hash: true,
  mock: false,
  // base: '/app',
  locale: {
    default: 'zh-CN',
    baseNavigator: true,
  },
  antd: {
    dark: false,
  },
  access: {},
  model: {},
  initialState: {},
  request: {
    dataField: 'data'
  },
  layout: {
    title: SYSTEM_NAME,
  },
  dva: {
    hmr: true,
  },
  chainWebpack: (config) => {
    const oneOfsMap = config.module.rule('less').oneOfs.values();
    oneOfsMap.forEach((item) => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          resources: path.resolve(__dirname, '../src/style/theme.less'),
        })
        .end();
    });
  },
  npmClient: 'pnpm',
  define: {
    'process.env.SHOW_LOGO': true, // 是否显示logo
    'process.env.SHOW_PROJECT_NAME': false, // 是否显示登录界面右下角应用名称
    'process.env.PROJECT_NAME': SYSTEM_NAME, // 登录页展示名称
    'process.env.PROJECT_LOGO': '@/assets/logo.svg', // 项目logo，目前UI风格设计成不展示，但是需要配置
    'process.env.API_USER': '/api/user', // 用户管理转发接口
  
  },
  forkTSChecker: {}, // ts编译时类型检查
  routes,
  ignoreMomentLocale: true, // 忽略 moment 的 locale 文件
  proxy: proxyData,
  favicons: [
    // 此时将指向 `/favicon.png` ，确保你的项目含有 `public/favicon.png`
    '/favicon.svg'
  ]
});
