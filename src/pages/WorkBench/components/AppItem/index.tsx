import styles from './index.less'
import { history } from '@umijs/max';

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
      {appName}
    </div>
  )
}

export default AppItem
