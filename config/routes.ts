interface RouteProps {
  name?: string;
  path?: string;
  exact?: boolean;
  component?: string;

  routes?: RouteProps[];
  redirect?: string;
  authentication?: boolean;
  wrappers?: string[];
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
    routes: [
      {
        path: '/',
        redirect: '/home',
      },
      {
        name: '首页',
        path: 'home',
        exact: true,
        component: '@/pages/Home',
      },
      {
        name: '账号管理',
        path: 'account',
        exact: true,
        component: '@/pages/AccountManage',
      },
      {
        name: '任务管理',
        path: 'task',
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
      { path: '/*', component: '@/pages/Error/404' },
    ],
  },
];

export default routes;
