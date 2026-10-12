import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import '../styles/pages/NoticesPage.scss'

type Category = '일반' | '인사' | '업무' | '시스템'
type Notice = { id: string; title: string; body: string; category: Category; pinned: boolean; author: string; date: string }
const categories: Category[] = ['일반', '인사', '업무', '시스템']
const storageKey = 'ayxx-office.notices.v1'
const examples: Notice[] = [
  { id: 'welcome', title: 'AYXX Office에 오신 것을 환영합니다', body: '우리의 새로운 업무 공간, AYXX Office에 오신 것을 환영합니다.\n\n이곳에서 팀의 소식과 꼭 알아야 할 내용을 함께 공유해 주세요. 중요한 공지는 상단에 고정할 수 있습니다.\n\n현재 공지는 화면 확인을 위한 예시입니다.', category: '일반', pinned: true, author: '운영팀', date: '2026-10-13' },
  { id: 'guide', title: '공지사항 이용 안내', body: '새로운 소식을 작성하고, 분류별로 확인할 수 있습니다.\n\n제목이나 내용을 검색해 원하는 공지를 빠르게 찾아보세요. 중요한 소식은 상단 고정을 선택해 주세요.', category: '업무', pinned: true, author: '운영팀', date: '2026-10-13' },
  { id: 'system', title: '새로운 워크스페이스 준비 안내', body: '메신저, 캘린더, 문서보관함 등 업무에 필요한 공간을 순차적으로 준비하고 있습니다.', category: '시스템', pinned: false, author: '운영팀', date: '2026-10-12' },
  { id: 'team', title: '팀 소식을 자유롭게 공유해 주세요', body: '새로운 팀원 소개, 업무 안내, 함께 나누고 싶은 소식을 공지로 등록해 주세요.', category: '인사', pinned: false, author: '인사팀', date: '2026-10-12' },
]
function loadNotices(): Notice[] {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return examples
    const value: unknown = JSON.parse(raw)
    if (Array.isArray(value) && value.every(item => item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.body === 'string' && categories.includes(item.category) && typeof item.pinned === 'boolean' && typeof item.author === 'string' && typeof item.date === 'string')) return value as Notice[]
  } catch { /* 저장 공간에 접근할 수 없어도 페이지를 열 수 있습니다. */ }
  return examples
}
export function NoticesPage() {
  const [notices, setNotices] = useState(loadNotices)
  const [filter, setFilter] = useState<Category | '전체'>('전체')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Notice | null>(null)
  const [editing, setEditing] = useState<Notice | 'new' | null>(null)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const open = selected !== null || editing !== null
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal()
    if (!open && dialog.current?.open) dialog.current?.close()
  }, [open])
  function close() { setSelected(null); setEditing(null); setConfirmDelete(false); setFormError('') }
  function persist(next: Notice[]) {
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setError('') }
    catch { setError('저장 공간에 접근할 수 없어 변경 내용은 앱을 닫으면 사라집니다.') }
    setNotices(next)
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const title = String(data.get('title') ?? '').trim()
    const body = String(data.get('body') ?? '').trim()
    if (!title || !body) { setFormError('제목과 내용을 입력해 주세요.'); return }
    const original = editing !== 'new' ? editing : null
    const notice: Notice = { id: original?.id ?? crypto.randomUUID(), title, body, category: data.get('category') as Category, pinned: data.get('pinned') === 'on', author: original?.author ?? 'AYXX 사용자', date: original?.date ?? new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date()) }
    persist(original ? notices.map(item => item.id === original.id ? notice : item) : [notice, ...notices])
    close()
  }
  const visible = notices.filter(item => (filter === '전체' || item.category === filter) && `${item.title} ${item.body}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date))
  return <section className="notices-page">
    <div className="page-heading"><div><span className="kicker">STAY IN THE LOOP</span><h1>공지사항<span className="heading-dot">.</span></h1><p>함께 알아야 할 소식, 한곳에서 확인하세요.</p></div><button className="button primary" onClick={() => setEditing('new')}><span className="icon-placeholder" aria-hidden="true" />공지 작성</button></div>
    <div className="notice-intro"><span className="intro-icon" aria-hidden="true"><span className="icon-placeholder" /></span><div><strong>우리 팀의 소식을 연결하는 공간</strong><p>중요한 안내부터 일상의 소식까지, 모두에게 전해 주세요.</p></div><span className="intro-label">TEAM UPDATES</span></div>
    <div className="notice-toolbar"><div className="category-tabs" aria-label="공지 분류">{(['전체', ...categories] as const).map(category => <button key={category} aria-pressed={filter === category} className={filter === category ? 'selected' : ''} onClick={() => setFilter(category)}>{category}{category === '전체' && <span>{notices.length}</span>}</button>)}</div><label className="search-input"><span className="icon-placeholder" aria-hidden="true" /><input type="search" placeholder="공지 검색" aria-label="공지 제목 및 내용 검색" value={query} onChange={event => setQuery(event.target.value)} /></label></div>
    {error && <p className="feedback" role="status">{error}</p>}
    <div className="list-caption"><span>총 <strong>{visible.length}</strong>개의 공지</span><span>최근 등록순 · 중요 공지 우선</span></div>
    <div className="notice-list">{visible.map(item => <button className={`notice-row ${item.pinned ? 'pinned' : ''}`} key={item.id} onClick={() => { setSelected(item); setConfirmDelete(false) }}><span className={`category-badge category-${item.category}`}>{item.category}</span><span className="notice-text"><span className="notice-title">{item.pinned && <span className="pin-label">중요</span>}{item.title}</span><span className="notice-excerpt">{item.body.split('\n')[0]}</span></span><span className="notice-meta"><span>{item.author}</span><time dateTime={item.date}>{item.date.replaceAll('-', '.')}</time></span><span className="row-arrow icon-placeholder" aria-hidden="true" /></button>)}{visible.length === 0 && <div className="empty-state"><h2>{query ? '검색 결과가 없습니다' : '아직 등록된 공지가 없습니다'}</h2><p>{query ? '다른 검색어나 분류를 선택해 보세요.' : '첫 번째 소식을 공유해 보세요.'}</p></div>}</div>
    <p className="page-footnote">현재는 예시 공지와 이 기기에 저장된 공지를 표시합니다.</p>
    <dialog ref={dialog} className="notice-dialog" onCancel={close} aria-labelledby="notice-dialog-title">
      <div className="dialog-surface"><button className="dialog-close" aria-label="닫기" title="닫기" onClick={close}><span className="icon-placeholder" aria-hidden="true" /></button>
        {editing ? <form onSubmit={save} key={editing === 'new' ? 'new' : editing.id}><span className="kicker">TEAM UPDATES</span><h2 id="notice-dialog-title">{editing === 'new' ? '새 공지 작성' : '공지 수정'}</h2><label>제목<input name="title" required maxLength={120} placeholder="어떤 소식을 전할까요?" defaultValue={editing === 'new' ? '' : editing.title} /></label><label>분류<select name="category" defaultValue={editing === 'new' ? '일반' : editing.category}>{categories.map(category => <option key={category}>{category}</option>)}</select></label><label>내용<textarea name="body" required rows={8} maxLength={10000} placeholder="팀원들에게 전할 내용을 작성해 주세요." defaultValue={editing === 'new' ? '' : editing.body} /></label><label className="checkbox-label"><input type="checkbox" name="pinned" defaultChecked={editing === 'new' ? false : editing.pinned} />중요 공지로 상단에 고정</label>{formError && <p role="alert" className="feedback">{formError}</p>}<div className="dialog-actions"><button type="button" className="button" onClick={close}>취소</button><button className="button primary" type="submit">{editing === 'new' ? '공지 등록' : '변경 저장'}</button></div></form> : selected && <><span className="category-badge">{selected.category}</span><h2 id="notice-dialog-title">{selected.title}</h2><p className="detail-meta">{selected.author} · {selected.date.replaceAll('-', '.')} {selected.pinned && '· 중요 공지'}</p><div className="notice-body">{selected.body}</div><div className="dialog-actions">{confirmDelete ? <><span className="delete-question">이 공지를 삭제할까요?</span><button className="button" onClick={() => setConfirmDelete(false)}>취소</button><button className="button danger" onClick={() => { persist(notices.filter(item => item.id !== selected.id)); close() }}>삭제 확인</button></> : <><button className="button danger" onClick={() => setConfirmDelete(true)}>삭제</button><button className="button" onClick={() => { setEditing(selected); setSelected(null) }}>수정</button><button className="button primary" onClick={close}>닫기</button></>}</div></>}
      </div>
    </dialog>
  </section>
}

