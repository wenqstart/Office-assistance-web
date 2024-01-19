import { Spin } from 'antd';
import styles from './index.less';

const LoadingPage = (props: any) => {
  const { loading = true, text, ...rest } = props;
  return loading ? (
    <div className={styles.loadingPage} {...rest}>
      <Spin spinning={loading} />
      {text && <div className={styles.text}>{text}</div>}
    </div>
  ) : null;
};

export default LoadingPage;
