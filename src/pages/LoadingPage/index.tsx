import { Spin } from 'antd'
import styles from './index.less'

const LoadingPage = (props: any) => {
  const { loading = true, size = 'small', text, ...rest } = props
  return loading ? (
    <div className={styles.loadingPage} {...rest}>
      <Spin spinning={loading} size={size} />
      {text && <div className={styles.text}>{text}</div>}
    </div>
  ) : null
}

export default LoadingPage
