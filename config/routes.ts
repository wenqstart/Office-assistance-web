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
    name: '登录',
    path: '/login',
    component: '@/pages/Login',
  },
  {
    path: '/',
    wrappers: ['@/pages/EntryPage/AuthorizedEntry'],
    routes: [
      {
        path: '/',
        redirect: '/home',
      },
      {
        name: '首页',
        path: '/home',
        exact: true,
        component: '@/pages/Home',
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
