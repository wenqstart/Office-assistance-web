import { defineConfig } from '@umijs/max'
import path from 'path'
import { SYSTEM_NAME } from '../src/constants'
import routes from './routes'
import theme from './theme.hc'
const api = '/api'

export default defineConfig({
  // favicon: '/favicon_hc.ico', // 浏览器icon
  // plugins: ['@umijs/plugin-helmet'],
  favicons: [
    // 此时将指向 `/favicon.png` ，确保你的项目含有 `public/favicon.png`
    '/favicon.svg',
  ],
  // 一定要配置
  mfsu: {
    strategy: 'normal',
  },
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
    dataField: 'data',
  },
  layout: {
    title: SYSTEM_NAME,
  },
  fastRefresh: true,
  chainWebpack: (config: any) => {
    const oneOfsMap = config.module.rule('less').oneOfs.values()
    oneOfsMap.forEach((item: any) => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          resources: path.resolve(__dirname, '../src/style/theme.less'),
        })
        .end()
    })
  },
  npmClient: 'pnpm',
  define: {
    'process.env.SHOW_LOGO': true, // 是否显示logo
    'process.env.SHOW_PROJECT_NAME': false, // 是否显示登录界面右下角应用名称
    'process.env.PROJECT_NAME': SYSTEM_NAME, // 登录页展示名称
    'process.env.PROJECT_LOGO': '@/assets/logo.svg', // 项目logo，目前UI风格设计成不展示，但是需要配置
    'process.env.BASE_API': '/api', // 转发接口
    // 'process.env.dev_ip': '10.33.117.75:8081', // 开发环境地址
    'process.env.dev_ip': '10.33.121.9:8081', // 开发环境地址
    'process.env.prod_ip': '62137560yh.vicp.fun', // 生产环境地址
  },
  // forkTSChecker: {}, // ts编译时类型检查
  routes,
  ignoreMomentLocale: true, // 忽略 moment 的 locale 文件
  qiankun: {
    master: {
      apps: [
        {
          name: 'data-center',
          entry: '//10.33.10.171:3000',
        },
        {
          name: 'data-structure',
          entry: '//10.33.10.171:8100',
        },
      ],
    },
  },
  proxy: {
    // 多人文档编辑
    // '/doc-base': {
    //   target: 'http://localhost:5000',
    //   // secure: false,
    //   changeOrigin: true,
    //   // rewrite: (path) => path.replace('/doc-base', ''),
    //   rewrite: {
    //     '/doc-base': '/doc-base'
    //   },
    //   // xfwd: false,
    // },
    '/api/doc-base': {
      target: 'http://10.33.10.171:3000',
      changeOrigin: true,
      rewrite: { '^/api/doc-base': '' },
    },
    [api]: {
      // 本地
      // target: 'http://10.33.121.9:8081',
      // 云服务器
      target: 'http://121.40.170.103:8081',
      // 花生壳
      // target: 'http://62137560yh.vicp.fun',
      changeOrigin: true,
      pathRewrite: {
        [`^${api}`]: '',
      },
    },
  },
})
