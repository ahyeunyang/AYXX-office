import chevronDown from '../assets/icons/chevron-down.svg'
import chevronLeft from '../assets/icons/chevron-left.svg'
import chevronRight from '../assets/icons/chevron-right.svg'
import chevronUp from '../assets/icons/chevron-up.svg'
import x from '../assets/icons/x.svg'
import sidebarOpen from '../assets/icons/sidebar-open.svg'

const icons = {
  'chevron-down': chevronDown,
  'chevron-left': chevronLeft,
  'chevron-right': chevronRight,
  'chevron-up': chevronUp,
  x,
  'sidebar-open': sidebarOpen,
}

type IconProps = { name: keyof typeof icons; className?: string }

// 장식용 아이콘은 부모 색상을 따르며, 이를 감싸는 버튼에 접근성 이름을 지정합니다.
export function Icon({ name, className = '' }: IconProps) {
  const maskImage = `url("${icons[name]}")`
  return <span className={`icon ${className}`} aria-hidden="true" style={{ maskImage, WebkitMaskImage: maskImage }} />
}
