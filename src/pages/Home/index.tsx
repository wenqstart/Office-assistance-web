// import Guide from '@/components/Guide';
// import { trim } from '@/utils/format';
// import { getUserTemplate } from '@/api/modules/admin'
import { PageContainer } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import React, { useEffect } from 'react'
import styles from './index.less'

const HomePage: React.FC = () => {
  const { name } = useModel('global')
  console.log('name', name)

  useEffect(() => {
    // getUserTemplate().then((res) => {
    //   console.log(res)
    // })
  })
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        {/* <Guide name={trim(name)} /> */}
        www
      </div>
    </PageContainer>
  )
}

export default HomePage
