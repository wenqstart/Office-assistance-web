import styles from './index.less'

export type TEmaliData = {
  id: string
  type: number // 0-作业,1-公告
  title: string
  subtitle: string
  desc: string
}

type TProps = {
  emailData: TEmaliData
  selected: boolean
  onClick: () => void
}

export const EmailListItem = (props: TProps) => {
  const { emailData } = props
  const clickItem = () => {
    props.onClick()
  }
  return (
    <div
      onClick={clickItem}
      className={`${styles.box} ${props.selected ? 'active' : ''}`}
    >
      <div className={styles.emailLabel}>
        {emailData.title.substring(0, 1).toLocaleUpperCase() +
          emailData.title.substring(1, 2)}
      </div>
      <div className={styles.emailTextList}>
        <span>{emailData.title}</span>
        <span>{emailData.subtitle}</span>
        <span>{emailData.desc}</span>
      </div>
      {emailData.taskStatus > -1 && <div className={styles.tag}></div>}
    </div>
  )
}
