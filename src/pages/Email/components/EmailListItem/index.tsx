import './index.less'

type TEmaliData = {
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

const EmailListItem = (props: TProps) => {
  const clickItem = () => {
    props.onClick()
  }

  return (
    <div
      onClick={clickItem}
      className={`box ${props.selected ? 'active' : ''}`}
    >
      <div className="emailLabel">{props.emailData.type ? '公告' : '作业'}</div>
      <div className="emailTextList">
        <span>{props.emailData.title}</span>
        <span>{props.emailData.subtitle}</span>
        <span>{props.emailData.desc}</span>
      </div>
    </div>
  )
}

export default EmailListItem
