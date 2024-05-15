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
        redirect: '/workBench',
      },
      {
        name: '工作台',
        path: 'workBench',
        icon: 'FundProjectionScreenOutlined',
        exact: true,
        component: '@/pages/WorkBench',
      },
      {
        name: '消息',
        path: 'message',
        icon: 'message',
        exact: true,
        component: '@/pages/Message',
        access: 'isUser',
      },
      {
        name: '通讯录',
        path: 'contact',
        icon: 'TeamOutlined',
        exact: true,
        component: '@/pages/Contact',
        access: 'isUser',
      },
      {
        name: '文档中心',
        path: 'data-center/*',
        icon: 'HddOutlined',
        microApp: 'data-center',
        microAppProps: {
          // autoSetLoading: true,
        },
      },
      {
        name: '分组管理',
        path: 'account',
        icon: 'SnippetsOutlined',
        exact: true,
        component: '@/pages/AccountManage',
        access: 'isAdmin',
      },
      {
        name: '用户管理',
        path: 'user',
        icon: 'UserSwitchOutlined',
        exact: true,
        component: '@/pages/UserManage',
        access: 'isAdmin',
      },
      {
        name: '任务管理',
        path: 'task',
        icon: 'UnorderedListOutlined',
        exact: true,
        component: '@/pages/TaskManage',
        access: 'isAdmin',
      },
      { path: '/404', component: '@/pages/Error/404' },
      { path: '/noAuth', component: '@/pages/Error/noAuth' },
      {
        name: '我的任务',
        path: 'email',
        icon: 'ProjectOutlined',
        exact: true,
        component: '@/pages/Email',
        access: 'isUser',
      },
      {
        path: '/person-center',
        name: '个人中心',
        icon: 'UserOutlined',
        component: '@/pages/PersonCenter',
      },
      {
        path: '/data-structure/*',
        microApp: 'data-structure',
        microAppProps: {
          autoSetLoading: true,
        },
        // component: '@/pages/DataStructure',
      },
      { path: '/404', component: '@/pages/Error/404' },
    ],
  },
]

export default routes
