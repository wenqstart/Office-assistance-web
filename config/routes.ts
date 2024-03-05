interface RouteProps {
  name?: string
  path?: string
  exact?: boolean
  component?: string

  routes?: RouteProps[]
  redirect?: string
  authentication?: boolean
  wrappers?: string[]
  // 更多功能查看
  // https://beta-pro.ant.design/docs/advanced-menu
  // ---
  icon?: string
  // 新页面打开
  target?: string //'_blank'
  // 不展示顶栏
  headerRender?: boolean
  // 不展示页脚
  footerRender?: boolean
  // 不展示菜单
  menuRender?: boolean
  // 不展示菜单顶栏
  menuHeaderRender?: boolean
  // 权限配置，需要与 plugin-access 插件配合使用
  access?: string // 'canRead'
  // 隐藏子菜单
  hideChildrenInMenu?: boolean
  // 隐藏自己和子菜单
  hideInMenu?: boolean
  // 在面包屑中隐藏
  hideInBreadcrumb?: boolean
  // 子项往上提，仍旧展示,
  flatMenu?: boolean
  // 一般用于跳转到详情页面时高亮显示父级菜单
  parentKeys?: string[]
  [key: string]: any
}
const routes: RouteProps[] = [
  {
    path: '/login',
    component: '@/pages/Login',
  },
  {
    path: '/',
    component: '@/layouts',
    wrappers: ['@/wrappers/auth'],
    headerRender: false,
    flatMenu: true,
    routes: [
      {
        path: '/',
        redirect: '/home',
      },
      {
        name: '首页',
        path: 'home',
        icon: 'home',
        exact: true,
        component: '@/pages/Home',
      },
      {
        name: '消息',
        path: 'message',
        icon: 'message',
        exact: true,
        component: '@/pages/Message',
      },
      {
        name: '联系人',
        path: 'contact',
        icon: '',
        exact: true,
        component: '@/pages/Contact',
      },
      {
        name: '工作台',
        path: 'work',
        icon: '',
        exact: true,
        component: '@/pages/Work',
      },
      {
        name: '账号管理',
        path: 'account',
        icon: 'SnippetsOutlined',
        exact: true,
        component: '@/pages/AccountManage',
      },
      {
        name: '任务管理',
        path: 'task',
        icon: 'UnorderedListOutlined',
        exact: true,
        component: '@/pages/TaskManage',
      },
      { path: '/404', component: '@/pages/Error/404' },
      { path: '/noAuth', component: '@/pages/Error/noAuth' },
      {
        path: '/personCenter',
        exact: true,
        component: '@/pages/PersonCenter',
      },
      // 为了实现菜单高亮
      {
        path: '/data-structure',
        name: '数据结构',
        icon: 'DatabaseOutlined',
        component: '@/pages/data-structure',
      },
      {
        path: '/data-structure/*',
        component: '@/pages/data-structure',
      },
      { path: '/*', component: '@/pages/Error/404' },
    ],
  },
]

export default routes
