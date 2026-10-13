export type Theme = 'dark' | 'light'
export type NotificationCategory = 'calendar' | 'notices' | 'messenger'
export type NotificationMode = 'detail' | 'simple' | 'off'
export type Settings = { theme: Theme; notifications: Record<NotificationCategory, NotificationMode> }
export const settingsStorageKey = 'ayxx-office.settings.v1'
export const defaultSettings: Settings = { theme: 'light', notifications: { calendar: 'detail', notices: 'detail', messenger: 'detail' } }

export function parseSettings(raw: string | null): Settings {
  try {
    const value = JSON.parse(raw ?? 'null')
    const modes = ['detail', 'simple', 'off']
    return {
      theme: value?.theme === 'dark' || value?.theme === 'light' ? value.theme : defaultSettings.theme,
      notifications: {
        calendar: modes.includes(value?.notifications?.calendar) ? value.notifications.calendar : 'detail',
        notices: modes.includes(value?.notifications?.notices) ? value.notifications.notices : 'detail',
        messenger: modes.includes(value?.notifications?.messenger) ? value.notifications.messenger : 'detail',
      },
    }
  } catch { return { ...defaultSettings, notifications: { ...defaultSettings.notifications } } }
}

export function loadSettings(): Settings {
  try { return parseSettings(localStorage.getItem(settingsStorageKey)) }
  catch { return parseSettings(null) }
}

export type OfficeNotification = { category: NotificationCategory; id: string; title: string; body: string }
export type NotificationPayload = OfficeNotification & { mode: NotificationMode }

export function makeNotification(event: OfficeNotification, settings: Settings): NotificationPayload | null {
  const mode = settings.notifications[event.category]
  if (mode === 'off') return null
  const normalized = event.body.replace(/\s+/g, ' ').trim()
  return { ...event, title: event.title.slice(0, 120), mode, body: mode === 'detail' ? normalized.slice(0, 120) + (normalized.length > 120 ? '…' : '') : '' }
}
