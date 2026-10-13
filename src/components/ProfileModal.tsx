import { useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from './Modal'
import { ProfileStatusSelect } from './ProfileStatusSelect'

import { profileStorageKey } from '../data/profile'
import type { Profile, ProfileStatus } from '../data/profile'
export function ProfileModal({ profile, onSave, onClose }: { profile: Profile; onSave: (profile: Profile) => void; onClose: () => void }) {
  const [name, setName] = useState(profile.name)
  const [description, setDescription] = useState(profile.description)
  const [status, setStatus] = useState<ProfileStatus>(profile.status)
  const [error, setError] = useState('')
  function save(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) { setError('이름을 입력해 주세요.'); return }
    const next = { name: name.trim(), description: description.trim(), status }
    try { localStorage.setItem(profileStorageKey, JSON.stringify(next)) }
    catch { setError('프로필을 저장하지 못했습니다. 저장 공간을 확인하고 다시 시도해 주세요.'); return }
    onSave(next)
    onClose()
  }
  return <Modal open title="프로필 설정" size="s" onClose={onClose}>
    <form className="profile-form" onSubmit={save}>
      <label>이름<input autoFocus required maxLength={40} value={name} onChange={event => setName(event.target.value)} autoComplete="nickname" /></label>
      <label>소개<input maxLength={80} value={description} onChange={event => setDescription(event.target.value)} /></label>
      <ProfileStatusSelect value={status} onChange={setStatus} />
      {error && <p className="feedback" role="alert">{error}</p>}
      <div className="modal-actions"><button type="button" className="button" onClick={onClose}>취소</button><button type="submit" className="button primary">저장</button></div>
    </form>
  </Modal>
}
