import { Modal } from './Modal'
import type { NotificationCategory, NotificationMode, Settings } from '../data/settings'
import '../styles/components/Settings.scss'

const categories: { key: NotificationCategory; label: string }[] = [
  { key: 'calendar', label: '캘린더' }, { key: 'notices', label: '공지사항' }, { key: 'messenger', label: '메신저' },
]
const modes: { key: NotificationMode; label: string }[] = [
  { key: 'detail', label: '자세히 보기' }, { key: 'simple', label: '간단히 보기' }, { key: 'off', label: '끄기' },
]

export function SettingsModal({ settings, error, onChange, onClose, onTest }: {
  settings: Settings; error: string; onChange: (settings: Settings) => void; onClose: () => void; onTest: () => void
}) {
  return <Modal open title="설정" size="s" onClose={onClose}>
    <div className="settings-panel">
      <fieldset className="settings-section"><legend>화면 모드</legend>
        <div className="theme-options">{(['dark', 'light'] as const).map(theme => <button type="button" key={theme} className={`theme-option theme-option--${theme}`} aria-pressed={settings.theme === theme} onClick={() => onChange({ ...settings, theme })}>
          <span>{theme === 'dark' ? '다크' : '라이트'}</span><span className="theme-preview" aria-hidden="true"><i /><i /><i /></span>
          {settings.theme === theme && <span className="theme-selected">선택됨</span>}
        </button>)}</div>
      </fieldset>
      <section className="settings-section" aria-labelledby="notification-settings-title">
        <h3 id="notification-settings-title">알림</h3>
        <p className="settings-help">자세히 보기는 제목과 내용 요약, 간단히 보기는 제목만 표시합니다.</p>
        {categories.map(({ key, label }) => <fieldset className="notification-setting" key={key}><legend>{label}</legend>
          <div className="notification-modes">{modes.map(mode => <button type="button" key={mode.key} aria-pressed={settings.notifications[key] === mode.key} onClick={() => onChange({ ...settings, notifications: { ...settings.notifications, [key]: mode.key } })}>{mode.label}</button>)}</div>
        </fieldset>)}
        <p className="settings-help">캘린더와 메신저 알림은 해당 기능이 추가되면 연결됩니다.</p>
        <button type="button" className="button" disabled={settings.notifications.notices === 'off'} onClick={onTest}>공지 알림 테스트</button>
      </section>
      {error && <p role="alert" className="feedback">{error}</p>}
    </div>
  </Modal>
}
