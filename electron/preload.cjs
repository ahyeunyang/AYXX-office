const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("officeWindow", {
  close: () => ipcRenderer.send("window-control", "close"),
  minimize: () => ipcRenderer.send("window-control", "minimize"),
  toggleFullScreen: () => ipcRenderer.send("window-control", "fullscreen"),
});
