import { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './index.less';

interface IconFontProps extends HTMLAttributes<any> {
  name: string;
  onClick?: () => any;
  type?: 'default' | 'primary' | 'error' | 'warning' | 'success' | 'disable';
  size?: number | string;
}

const IconFont = (props: IconFontProps) => {
  const { name, className, type = 'default', size, ...rest } = props;
  const iconClass = classNames(styles['iconfont'], className, {
    [styles[`icon-${name}`]]: name,
  });
  return <i {...rest} className={iconClass} />;
};

export default IconFont;
