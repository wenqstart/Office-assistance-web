import path from 'path';

const theme = [
  {
    name: 'micro',
    color: '#226EE7',
    // path: `${path.join(__dirname, '../src/theme/micro.less')}`,
    modifyVars: {
      '--ant-prefix': 'micro',
      '--font-family': 'PingFangSC-Regular, PingFang SC',
      '--font-family-bold': 'PingFangSC-Medium, PingFang SC',
      '--primary-color': '#226EE7', // 全局主色
      '--primary-color-bg': '#eef4fd', // 全局主色
      '--link-color': '#226EE7', // 链接色
      '--success-color': '#0AB283', // 成功色
      '--warning-color': '#FFA726', // 警告色
      '--error-color': '#D04443', // 错误色
      '--font-size-base': '14px', // 主字号
      '--heading-color': '#10173f', // 标题色
      '--text-color': '#646A88', // 主文本色
      '--text-color-secondary': '#9b9b9b', // 次文本色
      '--text-color-third': '#dedede',
      '--disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
      '--border-radius-base': '4px', // 组件/浮层圆角
      '--border-color-base': '#d9d9d9', // 边框色
      '--line-height-base': '1.5715',
      // layout 布局
      '--layout-header-background': 'transparent',
      '--layout-header-height': '64px',
      '--layout-header-padding': '0 20px',
      '--layout-header-color': '#fff',
      '--layout-header-more': '#226EE7',
      '--layout-header-more-color': '#fff',
      '--layout-header-shadow-color': '#e4e4e4',
      '--layout-sider-background': '#f5f5f5',

      // menu 菜单
      '--menu-item-height': '32px',
      '--menu-inline-toplevel-item-height': '32px',
      '--menu-item-boundary-margin': '0px',
      '--menu-collapsed-width': '60px',
      '--menu-bg': '#f5f5f5',
      '--menu-item-color': '#666666',
      // 'menu-highlight-color': '#dee3f8',
      '--menu-highlight-color': '#226EE7',
      '--menu-item-active-bg': 'rgba(34, 110, 231, 0.08)',
      '--menu-inline-submenu-bg': 'transparent',
      '--menu-dark-bg': '#226EE7 !important',
      '--menu-dark-color': '#fff',
      '--menu-dark-arrow-color': '#fff',
      '--menu-dark-item-active-bg': '#1b2348',
      '--menu-dark-selected-item-text-color': '#52BF96',
      '--menu-dark-selected-item-icon-color': '#52BF96',
      '--menu-dark-inline-submenu-bg': '#000c17',
      '--menu-dark-item-hover-bg': '#226EE7',
      '--menu-dark-highlight-color': '#dee3f8',

      '--input-placeholder-color': '#8F95B2',
      '--input-height-lg': '40px',
    },
  },
  // {
  //   name: 'dark',
  //   color: '#333333',
  //   path: `${path.join(__dirname, '../src/theme/dark.less')}`,
  // },
  {
    name: 'orange',
    color: '#F8A51A',
    // path: `${path.join(__dirname, '../src/theme/orange.less')}`,
    modifyVars: {
      '--ant-prefix': 'orange',
      '--font-family': 'PingFangSC-Regular, PingFang SC',
      '--font-family-bold': 'PingFangSC-Medium, PingFang SC',
      '--primary-color': '#fa8c16', // 全局主色
      '--primary-color-bg': '#fff7e6', // 全局主色
      '--link-color': '#fa8c16', // 链接色
      '--success-color': '#0AB283', // 成功色
      '--warning-color': '#FFA726', // 警告色
      '--error-color': '#D04443', // 错误色
      '--font-size-base': '14px', // 主字号
      '--heading-color': '#10173f', // 标题色
      '--text-color': '#646A88', // 主文本色
      '--text-color-secondary': '#f8a51a', // 次文本色
      '--text-color-third': '#ffd591',
      '--disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
      '--border-radius-base': '4px', // 组件/浮层圆角
      '--border-color-base': '#f8a51a', // 边框色
      '--line-height-base': '1.5715',
      // layout 布局
      '--layout-header-background': 'transparent',
      '--layout-header-height': '64px',
      '--layout-header-padding': '0 20px',
      '--layout-header-color': '#fff',
      '--layout-header-more': '#fa8c16',
      '--layout-header-more-color': '#fff',
      '--layout-header-shadow-color': '#e4e4e4',
      '--layout-sider-background': '#f5f5f5',

      // menu 菜单
      '--menu-item-height': '32px',
      '--menu-inline-toplevel-item-height': '32px',
      '--menu-item-boundary-margin': '0px',
      '--menu-collapsed-width': '60px',
      '--menu-bg': '#f5f5f5',
      '--menu-item-color': '#666666',
      // 'menu-highlight-color': '#dee3f8',
      '--menu-highlight-color': '#fa8c16',
      '--menu-item-active-bg': '#fff7e6',
      '--menu-inline-submenu-bg': 'transparent',
      '--menu-dark-bg': '#fa8c16 !important',
      '--menu-dark-color': '#fff',
      '--menu-dark-arrow-color': '#fff',
      '--menu-dark-item-active-bg': '#1b2348',
      '--menu-dark-selected-item-text-color': '#52BF96',
      '--menu-dark-selected-item-icon-color': '#52BF96',
      '--menu-dark-inline-submenu-bg': '#000c17',
      '--menu-dark-item-hover-bg': '#fa8c16',
      '--menu-dark-highlight-color': '#dee3f8',

      '--input-placeholder-color': '#8F95B2',
      '--input-height-lg': '40px',
    },
  },
];

export default theme;
