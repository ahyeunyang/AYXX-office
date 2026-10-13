const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("officeWindow", {
  close: () => ipcRenderer.send("window-control", "close"),
  minimize: () => ipcRenderer.send("window-control", "minimize"),
  toggleFullScreen: () => ipcRenderer.send("window-control", "fullscreen"),
  notify: (payload) => ipcRenderer.invoke("office-notification", payload),
  onNotificationClick: (callback) => {
    const listener = (_event, target) => callback(target);
    ipcRenderer.on("office-notification-click", listener);
    return () => ipcRenderer.removeListener("office-notification-click", listener);
  },
});
