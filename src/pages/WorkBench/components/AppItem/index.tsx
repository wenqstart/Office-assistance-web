import { history } from '@umijs/max'
import styles from './index.less'

export type TAppItem = {
  appName: string
  appLink: string
  icon: string
  desc: string
}

const AppItem = (props: { appItem: TAppItem }) => {
  const { appName, appLink, icon, desc } = props.appItem

  const toApp = () => {
    console.log(appLink)
    history.replace(appLink)
  }

  return (
    <div className={styles.box} onClick={toApp}>
      <div className={styles.icon}>DS</div>
      <div className={styles.textBox}>
        <span>{appName}</span>
        <span>{desc}</span>
      </div>
    </div>
  )
}

export default AppItem
