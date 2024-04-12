import React, { useEffect, useState } from 'react'

const LazyComponent: React.FC = (props: any) => {
  const [lazyLoad, setLazyLoad] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setLazyLoad(true)
    }, 200)
  }, [])
  return (lazyLoad && <div>{props.children}</div>) || <></>
}

export default LazyComponent
