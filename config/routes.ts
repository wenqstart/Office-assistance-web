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
    redirect: '/home',
  },
  {
    name: '首页',
    path: '/home',
    component: './Home',
  },
  {
    name: '权限演示',
    path: '/access',
    component: './Access',
  },
  {
    name: ' CRUD 示例',
    path: '/table',
    component: './Table',
  },
  {
    name: 'doc-edit',
    path: '/doc-edit',
    component: './WqDoc',
    // routes: [
    //   // {
    //   //   path: '/app1',
    //   //   component: '@/layouts/app-layout.tsx',
    //   //   routes: [
    //   //     // 配置微应用 app1 关联的路由
    //   //     {
    //   //       // 带上 * 通配符意味着将 /app1/project 下所有子路由都关联给微应用 app1
    //   //       path: '/project/*',
    //   //       microApp: 'app1',
    //   //     },
    //   //   ],
    //   // },
    //   // 配置 app2 关联的路由
    //   {
    //     path: '/doc-edit/*',
    //     microApp: 'doc-edit',
    //   },
    // ],
  },
  // Codemirror 代码编辑器
  // {
  //   name: 'Codemirror',
  //   path: '/docEdit',
  //   component: './DocEdit',
  // },
  // quill编辑器
  {
    name: 'QuillDocEditor',
    path: '/QuillDocEditor',
    component: './QuillDocEditor',
  },
  // wangeditor编辑器
  {
    name: 'WangDocEditor',
    path: '/WangDocEditor',
    component: './WangDocEditor',
  },
];

export default routes;
