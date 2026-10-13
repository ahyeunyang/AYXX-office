export const profileStatuses = { online: '온라인', away: '자리비움', meeting: '회의중', vacation: '휴가', offline: '오프라인' } as const
export type ProfileStatus = keyof typeof profileStatuses
export type Profile = { name: string; description: string; status: ProfileStatus }
export const defaultProfile: Profile = { name: 'AYXX 사용자', description: '내 워크스페이스', status: 'online' }
export const profileStorageKey = 'ayxx-office.profile.v1'

export function loadProfile(): Profile {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(profileStorageKey) ?? 'null')
    if (value && typeof value === 'object' && 'name' in value && 'description' in value && typeof value.name === 'string' && value.name.trim() && value.name.length <= 40 && typeof value.description === 'string' && value.description.length <= 80) {
      // 이전 프로필 데이터에 상태가 없거나 유효하지 않으면 온라인을 사용합니다.
      const status = 'status' in value && typeof value.status === 'string' && Object.hasOwn(profileStatuses, value.status) ? value.status as ProfileStatus : 'online'
      return { name: value.name, description: value.description, status }
    }
  } catch { /* 저장된 프로필을 읽을 수 없으면 기본값을 사용합니다. */ }
  return defaultProfile
}

