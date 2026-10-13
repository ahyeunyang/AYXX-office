import { useCallback, useEffect, useRef, useState } from 'react';
import { SettingsModal } from './components/SettingsModal';
import { NotificationToast } from './components/NotificationToast';
import { loadSettings, makeNotification, settingsStorageKey } from './data/settings';
import type { NotificationCategory, NotificationPayload, OfficeNotification, Settings } from './data/settings';
import { ProfileModal } from './components/ProfileModal';
import { loadProfile, profileStatuses } from './data/profile';
import { Icon } from './components/Icon';
import { NoticesPage } from './pages/NoticesPage';
import './styles/layout/AppLayout.scss';

function App() {
  const [page, setPage] = useState('공지사항');
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('ayxx-office.sidebar-collapsed') === 'true'; }
    catch { return false; }
  });
  const [profile, setProfile] = useState(loadProfile);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(loadSettings);
  const [settingsError, setSettingsError] = useState('');
  const [toast, setToast] = useState<NotificationPayload | null>(null);
  const [noticeTarget, setNoticeTarget] = useState<{ id: string; serial: number } | null>(null);
  const currentSettings = useRef(settings);
  currentSettings.current = settings;
  useEffect(() => { document.documentElement.dataset.theme = settings.theme; }, [settings.theme]);
  const dismissToast = useCallback(() => setToast(null), []);
  const clearNoticeTarget = useCallback(() => setNoticeTarget(null), []);
  const openNotification = useCallback((target: { category: NotificationCategory; id: string }) => {
    setSettingsOpen(false);
    setProfileOpen(false);
    setToast(null);
    if (target.category === 'notices') {
      setPage('공지사항');
      setNoticeTarget({ id: target.id, serial: Date.now() });
    }
  }, []);
  useEffect(() => window.officeWindow?.onNotificationClick(openNotification), [openNotification]);
  function changeSettings(next: Settings) {
    setSettings(next);
    currentSettings.current = next;
    setToast(null);
    try { localStorage.setItem(settingsStorageKey, JSON.stringify(next)); setSettingsError(''); }
    catch { setSettingsError('설정을 저장하지 못해 앱을 다시 열면 이전 설정으로 돌아갑니다.'); }
  }
  async function notify(event: OfficeNotification) {
    const notification = makeNotification(event, currentSettings.current);
    if (!notification) return;
    if (window.officeWindow) {
      try {
        const result = await window.officeWindow.notify(notification);
        if (result.status === 'shown' || result.status === 'disabled') return;
      } catch { /* 운영체제 알림 전송에 실패하면 앱 내부 팝업으로 표시합니다. */ }
    }
    const latest = makeNotification(event, currentSettings.current);
    if (latest) setToast(latest);
  }
  const hideButton = useRef<HTMLButtonElement>(null);
  const showButton = useRef<HTMLButtonElement>(null);
  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    requestAnimationFrame(() => (next ? showButton : hideButton).current?.focus());
    try { localStorage.setItem('ayxx-office.sidebar-collapsed', String(next)); }
    catch { /* 저장 불가 시에도 현재 화면에서는 전환합니다. */ }
  }
  const menus = ['홈', '메신저', '캘린더', '업무관리', '문서보관함', '공지사항', '조직도'];
  return (
    <>
    {window.officeWindow && <div className="window-titlebar">
      <div className="window-controls" aria-label="창 제어">
        <button className="traffic-light close" aria-label="창 닫기" title="창 닫기" onClick={() => window.officeWindow?.close()}><span aria-hidden="true"><Icon name="x" /></span></button>
        <button className="traffic-light minimize" aria-label="최소화" title="최소화" onClick={() => window.officeWindow?.minimize()}><span aria-hidden="true">−</span></button>
        <button className="traffic-light fullscreen" aria-label="전체 화면 전환" title="전체 화면 / 원래 크기" onClick={() => window.officeWindow?.toggleFullScreen()}><span aria-hidden="true">↗</span></button>
      </div>
      <span className="window-title">AYXX Office</span>
    </div>}
    <div className={`office-shell ${window.officeWindow ? 'desktop-shell' : ''}`}>
      <aside id="app-sidebar" className="sidebar" hidden={collapsed}>
        <div className="sidebar-header">
          <div className="brand"><span className="brand-mark">a.</span><span className="brand-name">AYXX <strong>Office</strong></span></div>
          <button ref={hideButton} className="sidebar-toggle" onClick={toggleSidebar} aria-expanded={!collapsed} aria-controls="app-sidebar">숨기기</button>
        </div>
        <div className="workspace-label">WORKSPACE<span>개인 워크스페이스</span></div>
        <nav id="sidebar-navigation" aria-label="주요 메뉴">{menus.map(name => <button key={name} className={`nav-item ${page === name ? 'active' : ''}`} aria-label={name} title={collapsed ? name : undefined} aria-current={page === name ? 'page' : undefined} onClick={() => setPage(name)}><span className="nav-icon icon-placeholder" aria-hidden="true" /><span className="nav-label">{name}</span>{name === '공지사항' && <span className="nav-dot" />}</button>)}</nav>
        <div className="sidebar-footer"><button className="nav-item settings-button" onClick={() => setSettingsOpen(true)}>설정</button>
        <button className="profile" onClick={() => setProfileOpen(true)} aria-label={`${profile.name} 프로필 설정`}><span className="profile-avatar"><span className="avatar">{Array.from(profile.name)[0]}</span><span className={`profile-status-dot profile-status--${profile.status}`} role="img" aria-label={profileStatuses[profile.status]} title={profileStatuses[profile.status]} /></span><span className="profile-text"><strong>{profile.name}</strong><span>{profile.description}</span></span><Icon name="chevron-right" /></button></div>
      </aside>
      <main className="workspace">
        {collapsed && <button ref={showButton} className="sidebar-open-button" onClick={toggleSidebar} aria-label="사이드바 열기" title="사이드바 열기" aria-expanded={!collapsed} aria-controls="app-sidebar"><Icon name="sidebar-open" /></button>}
        <header className="topbar"><div className="topbar-leading"><span>워크스페이스 <span className="divider">/</span><strong>{page}</strong></span></div><span className="workspace-pill">● AYXX Office</span></header>
        <div className="workspace-content">
          {page === '공지사항' ? <NoticesPage onCreated={notice => { void notify({ category: 'notices', ...notice }); }} notificationTarget={noticeTarget} onTargetHandled={clearNoticeTarget} /> : <section className="coming-soon"><span className="kicker">YOUR WORKSPACE</span><h1>{page}</h1><p>{page === '홈' ? '각 업무 기능을 완성한 뒤, 한눈에 모아볼 수 있는 홈을 만들 예정입니다.' : '이 페이지는 순차적으로 준비할 예정입니다.'}</p><button className="button primary" onClick={() => setPage('공지사항')}>공지사항으로 돌아가기</button></section>}
        </div>
      </main>
    </div>
    {profileOpen && <ProfileModal profile={profile} onSave={setProfile} onClose={() => setProfileOpen(false)} />}
    {settingsOpen && <SettingsModal settings={settings} error={settingsError} onChange={changeSettings} onClose={() => setSettingsOpen(false)} onTest={() => {
      setSettingsOpen(false);
      void notify({ category: 'notices', id: 'notification-test', title: '공지 알림 테스트', body: '새 공지가 등록되면 이렇게 알림이 표시됩니다.' });
    }} />}
    {toast && <NotificationToast notification={toast} onClose={dismissToast} onOpen={() => openNotification(toast)} />}

    </>
  );
}

export default App;


