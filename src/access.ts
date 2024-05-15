export default (initialState: any) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  console.log('initialState', initialState)
  const canSeeAdmin = !!(initialState && initialState.name !== 'dontHaveAccess')
  const isAdmin = !!(initialState?.userinfo?.role === 0)
  return {
    canSeeAdmin,
    isAdmin,
    isUser: !isAdmin,
  }
}
