import { useState } from 'react';
import { NoticesPage } from './pages/NoticesPage';
import './styles/layout/AppLayout.scss';

function App() {
  const [page, setPage] = useState('공지사항');
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('ayxx-office.sidebar-collapsed') === 'true'; }
    catch { return false; }
  });
  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem('ayxx-office.sidebar-collapsed', String(next)); }
    catch { /* 저장 불가 시에도 현재 화면에서는 전환합니다. */ }
  }
  const menus = ['홈', '메신저', '캘린더', '업무관리', '문서보관함', '공지사항', '조직도'];
  return (
    <>
    {window.officeWindow && <div className="window-titlebar">
      <div className="window-controls" aria-label="창 제어">
        <button className="traffic-light close" aria-label="창 닫기" title="창 닫기" onClick={() => window.officeWindow?.close()}><span aria-hidden="true">×</span></button>
        <button className="traffic-light minimize" aria-label="최소화" title="최소화" onClick={() => window.officeWindow?.minimize()}><span aria-hidden="true">−</span></button>
        <button className="traffic-light fullscreen" aria-label="전체 화면 전환" title="전체 화면 / 원래 크기" onClick={() => window.officeWindow?.toggleFullScreen()}><span aria-hidden="true">↗</span></button>
      </div>
      <span className="window-title">AYXX Office</span>
    </div>}
    <div className={`office-shell ${window.officeWindow ? 'desktop-shell' : ''}`}>
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="brand"><span className="brand-mark">a.</span><span className="brand-name">AYXX <strong>Office</strong></span></div>
          <button className="sidebar-toggle" onClick={toggleSidebar} aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'} title={collapsed ? '사이드바 펼치기' : '사이드바 접기'} aria-expanded={!collapsed} aria-controls="sidebar-navigation"><span className="icon-placeholder" aria-hidden="true" /></button>
        </div>
        <div className="workspace-label">WORKSPACE<span>개인 워크스페이스</span></div>
        <nav id="sidebar-navigation" aria-label="주요 메뉴">{menus.map(name => <button key={name} className={`nav-item ${page === name ? 'active' : ''}`} aria-label={name} title={collapsed ? name : undefined} aria-current={page === name ? 'page' : undefined} onClick={() => setPage(name)}><span className="nav-icon icon-placeholder" aria-hidden="true" /><span className="nav-label">{name}</span>{name === '공지사항' && <span className="nav-dot" />}</button>)}</nav>
        <p className="sidebar-note">● 함께 만드는 더 나은 업무 공간</p>
        <div className="profile"><span className="avatar">A</span><div><strong>AYXX 사용자</strong><span>내 워크스페이스</span></div></div>
      </aside>
      <main className="workspace">
        <header className="topbar"><span>워크스페이스 <span className="divider">/</span><strong>{page}</strong></span><span className="workspace-pill">● AYXX Office</span></header>
        {page === '공지사항' ? <NoticesPage /> : <section className="coming-soon"><span className="kicker">YOUR WORKSPACE</span><h1>{page}</h1><p>{page === '홈' ? '각 업무 기능을 완성한 뒤, 한눈에 모아볼 수 있는 홈을 만들 예정입니다.' : '이 페이지는 순차적으로 준비할 예정입니다.'}</p><button className="button primary" onClick={() => setPage('공지사항')}>공지사항으로 돌아가기</button></section>}
      </main>
    </div>
    </>
  );
}

export default App;


