import { Redirect } from 'umi';

const leftNavBg = '#f5f5f5';
const menuDarkBg = '#226EE7';

export default {
  'ant-prefix': 'micro',
  'font-family': 'PingFangSC-Regular, PingFang SC',
  'font-family-bold': 'PingFangSC-Medium, PingFang SC',
  'primary-color': '#226EE7', // 全局主色
  'link-color': '#226EE7', // 链接色
  'success-color': '#0AB283', // 成功色
  'warning-color': '#FFA726', // 警告色
  'error-color': '#D04443', // 错误色
  'font-size-base': '12px', // 主字号
  'heading-color': '#10173f', // 标题色
  'text-color': '#666', // 主文本色
  'text-color-secondary': '#0F173E', // 次文本色
  'disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
  'border-radius-base': '4px', // 组件/浮层圆角
  'border-color-base': '#d9d9d9', // 边框色
  'line-height-base': '1.5715',
  // layout 布局
  'layout-header-background': 'transparent',
  'layout-header-height': '64px',
  'layout-header-padding': '0 20px',
  'layout-header-color': '#646A88',
  'layout-sider-background': leftNavBg,

  // menu 菜单
  'menu-item-height': '32px',
  'menu-inline-toplevel-item-height': '32px',
  'menu-item-boundary-margin': '0px',
  'menu-collapsed-width': '60px',
  'menu-bg': leftNavBg,
  'menu-item-color': '#666666',
  // 'menu-highlight-color': '#dee3f8',
  'menu-highlight-color': '#10173F',
  'menu-item-active-bg': '#DEDEDE',
  'menu-inline-submenu-bg': 'transparent',
  'menu-dark-bg': `${menuDarkBg} !important`,
  'menu-dark-color': '#fff',
  'menu-dark-arrow-color': '#fff',
  'menu-dark-item-active-bg': '#1b2348',
  'menu-dark-selected-item-text-color': '#52BF96',
  'menu-dark-selected-item-icon-color': '#52BF96',
  'menu-dark-inline-submenu-bg': '#000c17',
  'menu-dark-item-hover-bg': menuDarkBg,
  'menu-dark-highlight-color': '#dee3f8',

  'input-placeholder-color': '#8F95B2',
  'input-height-lg': '40px',
  '--left-bar-bg': 'red',
};
