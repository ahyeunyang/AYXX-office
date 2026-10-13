import { useEffect } from 'react'
import { Icon } from './Icon'
import type { NotificationPayload } from '../data/settings'
import '../styles/components/Notifications.scss'

export function NotificationToast({ notification, onOpen, onClose }: { notification: NotificationPayload; onOpen: () => void; onClose: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 7000)
    return () => window.clearTimeout(timer)
  }, [notification, onClose])
  return <aside className="notification-toast" aria-label="새 알림">
    <div role="status"><span className="notification-toast-label">AYXX Office</span><strong>{notification.title}</strong>{notification.body && <p>{notification.body}</p>}</div>
    <div className="notification-toast-actions"><button className="button" onClick={onOpen}>열기</button><button className="modal-close" aria-label="알림 닫기" onClick={onClose}><Icon name="x" /></button></div>
  </aside>
}
