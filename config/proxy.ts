const api = '/api'
// const devApi = 'http://10.1.11.156:33123';

const myPathRewrite = (target: string) => {
  // 子应用单独运行没有设置路由前缀的情况下需配置
  return function (path: string) {
    if (path.indexOf('/api/') >= 0) {
      // 忽略api代理的重写
      return path
    } else {
      return path.replace(target, '')
    }
  }
}

const proxy = {
  '/api': {
    target: 'http://62137560yh.vicp.fun',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
  },
}

export default proxy
