import './index.less'

type TProps = {
  items: TBreadcrumb[]
  clickLabel: (item: TBreadcrumb, i: number) => void
}

type TBreadcrumb = {
  key: string
  label: string
}

const MyBreadcrumb = (props: TProps) => {
  const { items: breadcrumbList, clickLabel } = props

  const clickItem = (item: TBreadcrumb, i: number) => {
    clickLabel(item, i)
  }

  return (
    <div className="breadcrumbWrapper">
      {breadcrumbList.map((item, i) => {
        return (
          <div key={item.key} className="breadcrumbItem">
            {i > 0 && <span className="separator"></span>}
            <div
              className={`label ${
                breadcrumbList.length > 1 && i < breadcrumbList.length - 1
                  ? 'ableClick'
                  : ''
              }`}
              onClick={() => clickItem(item, i)}
            >
              {item.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { MyBreadcrumb, TBreadcrumb }
