export {};
declare global {
  interface Window {
    officeWindow?: {
      close: () => void;
      minimize: () => void;
      toggleFullScreen: () => void;
      notify: (payload: import('./data/settings').NotificationPayload) => Promise<{ status: 'shown' | 'unsupported' | 'failed' | 'disabled' }>;
      onNotificationClick: (callback: (target: { category: import('./data/settings').NotificationCategory; id: string }) => void) => () => void;
    };
  }
}
