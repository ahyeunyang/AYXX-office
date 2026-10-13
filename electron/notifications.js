const categories = new Set(['calendar', 'notices', 'messenger']);
const modes = new Set(['detail', 'simple', 'off']);

export function buildNotification(payload) {
  if (!payload || !categories.has(payload.category) || !modes.has(payload.mode) || typeof payload.id !== 'string' || payload.id.length > 160 || typeof payload.title !== 'string' || !payload.title.trim() || typeof payload.body !== 'string') return null;
  if (payload.mode === 'off') return null;
  return {
    category: payload.category,
    id: payload.id,
    title: payload.title.trim().slice(0, 120),
    body: payload.mode === 'detail' ? payload.body.replace(/\s+/g, ' ').trim().slice(0, 121) : '',
  };
}

export function registerNotifications({ ipcMain, BrowserWindow, Notification }) {
  const active = new Set();
  ipcMain.handle('office-notification', async (event, payload) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win || event.senderFrame !== win.webContents.mainFrame) return { status: 'failed' };
    if (payload?.mode === 'off') return { status: 'disabled' };
    const message = buildNotification(payload);
    if (!message) return { status: 'failed' };
    if (!Notification.isSupported()) return { status: 'unsupported' };
    return new Promise(resolve => {
      let notification;
      let timer;
      const finish = status => { clearTimeout(timer); resolve({ status }); };
      try {
        notification = new Notification({ title: message.title, body: message.body, timeoutType: 'default' });
        active.add(notification);
        // 알림 클릭 처리를 유지하되 보관하는 알림 객체 수는 제한합니다.
        if (active.size > 50) active.delete(active.values().next().value);
        notification.once('show', () => finish('shown'));
        notification.once('failed', () => { active.delete(notification); finish('failed'); });
        notification.once('close', () => active.delete(notification));
        notification.once('click', () => {
          active.delete(notification);
          if (win.isDestroyed()) return;
          if (win.isMinimized()) win.restore();
          win.show();
          win.focus();
          win.webContents.send('office-notification-click', { category: message.category, id: message.id });
        });
        timer = setTimeout(() => { active.delete(notification); notification.close(); finish('failed'); }, 5000);
        notification.show();
      } catch { active.delete(notification); finish('failed'); }
    });
  });
}
