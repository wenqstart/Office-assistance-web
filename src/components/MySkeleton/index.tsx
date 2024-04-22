import styles from './index.less'

type TSkeletonProp = {
  loading: boolean
  count: number
}

const MySkeleton = (props: TSkeletonProp) => {
  const { loading, count } = props
  const items = Array.from({ length: count }, (_, index) => index + 1)
  return (
    loading &&
    items.map((i) => (
      <div key={i} className={styles.box}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    ))
  )
}

export default MySkeleton
