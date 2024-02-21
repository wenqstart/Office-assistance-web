interface RouteProps {
  name?: string;
  path?: string;
  exact?: boolean;
  component?: string;

  routes?: RouteProps[];
  redirect?: string;
  authentication?: boolean;
}
const routes: RouteProps[] = [
  {
    path: '/',
    component: '@/pages/EntryPage',
    routes: [
      {
        name: '登录',
        path: '/login',
        exact: true,
        component: '@/pages/Login',
      },
      {
        name: '首页',
        path: '/home',
        exact: true,
        component: '@/pages/Home',
      },
      // {
      //   path: '/',
      //   component: '@/pages/EntryPage/AuthorizedEntry', // 用户认证
      //   routes: [
      //     {
      //       path: '/',
      //       component: '@/layout',
      //       routes: [
      //         { path: '/', exact: true, component: '@/pages/LoadingPage' },
      //         { path: '/404', component: '@/pages/Error/404' },
      //         { path: '/noAuth', component: '@/pages/Error/noAuth' },
      //         {
      //           path: '/personCenter',
      //           exact: true,
      //           component: '@/pages/PersonCenter',
      //         },
      //         { path: '/*', component: '@/pages/Error/404' },
      //       ],
      //     },
      //   ],
      // },
    ]
  },

];

export default routes;
