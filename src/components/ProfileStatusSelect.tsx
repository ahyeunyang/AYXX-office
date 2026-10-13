import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Icon } from './Icon'
import { profileStatuses } from '../data/profile'
import type { ProfileStatus } from '../data/profile'
import '../styles/components/ProfileStatusSelect.scss'

const statuses = Object.keys(profileStatuses) as ProfileStatus[]

export function ProfileStatusSelect({ value, onChange }: { value: ProfileStatus; onChange: (value: ProfileStatus) => void }) {
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(value)
  useEffect(() => {
    if (!open) return
    function closeOutside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [open])
  function choose(status: ProfileStatus) { onChange(status); setActive(status); setOpen(false) }
  function handleKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); setOpen(false); return }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) { setActive(value); setOpen(true); return }
      const next = statuses.indexOf(active) + (event.key === 'ArrowDown' ? 1 : -1)
      setActive(statuses[(next + statuses.length) % statuses.length])
    } else if (open && (event.key === 'Home' || event.key === 'End')) {
      event.preventDefault(); setActive(statuses[event.key === 'Home' ? 0 : statuses.length - 1])
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (open) choose(active)
      else { setActive(value); setOpen(true) }
    }
  }
  return <div className="profile-status-field" ref={root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
    <span id={`${id}-label`}>상태</span>
    <button type="button" className="status-select-trigger" role="combobox" aria-labelledby={`${id}-label ${id}-value`} aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-list`} aria-activedescendant={open ? `${id}-${active}` : undefined} onKeyDown={handleKey} onClick={() => { setActive(value); setOpen(!open) }}>
      <span className="status-select-dot" aria-hidden="true" style={{ backgroundColor: `var(--color-status-${value})` }} />
      <span id={`${id}-value`}>{profileStatuses[value]}</span><Icon name={open ? 'chevron-up' : 'chevron-down'} />
    </button>
    {open && <div className="status-select-list" id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`}>
      {statuses.map(status => <div key={status} id={`${id}-${status}`} role="option" aria-selected={value === status} className={`status-select-option ${active === status ? 'active' : ''}`} onPointerDown={event => event.preventDefault()} onMouseMove={() => setActive(status)} onClick={() => choose(status)}>
        <span className="status-select-dot" aria-hidden="true" style={{ backgroundColor: `var(--color-status-${status})` }} />{profileStatuses[status]}
      </div>)}
    </div>}
  </div>
}
