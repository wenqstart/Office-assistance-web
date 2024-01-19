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
  // Codemirror 代码编辑器
  // {
  //   name: 'Codemirror',
  //   path: '/docEdit',
  //   component: './DocEdit',
  // },
  // 富文本编辑器
  {
    name: 'QuillDocEditor',
    path: '/QuillDocEditor',
    component: './QuillDocEditor',
  },
];

export default routes;
